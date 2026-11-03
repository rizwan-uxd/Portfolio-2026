"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; dx: number; dy: number; vx: number; vy: number };

export function FooterWordmark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    let waveStart: number | null = null;
    let dots: Dot[] = [];
    let width = 0, height = 0, radius = 0, frame = 0;
    let visible = false, disposed = false;
    let pointer: { x: number; y: number } | null = null;
    let color = "";

    const draw = () => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.beginPath();
      const progress = waveStart === null ? 1 : Math.min((performance.now() - waveStart) / 1800, 1);
      const waving = waveStart !== null && progress < 1 && !reduced.matches;
      if (!waving) waveStart = null;
      const waveX = width * (progress * 1.4 - 0.2);
      let moving = waving;
      for (const dot of dots) {
        let tx = 0, ty = 0;
        if (waving) {
          const offset = (dot.x - waveX) / 45;
          ty = Math.sin(offset * 2) * Math.exp(-offset * offset) * 6 * Math.sin(progress * Math.PI);
        }
        if (pointer && !reduced.matches) {
          const x = dot.x - pointer.x, y = dot.y - pointer.y;
          const distance = Math.hypot(x, y);
          const reach = Math.min(80, width * 0.15);
          if (distance < reach && distance > 0) {
            const push = (1 - distance / reach) ** 2 * 14;
            tx = x / distance * push;
            ty = y / distance * push;
          }
        }
        dot.vx = (dot.vx + (tx - dot.dx) * 0.1) * 0.72;
        dot.vy = (dot.vy + (ty - dot.dy) * 0.1) * 0.72;
        dot.dx += dot.vx;
        dot.dy += dot.vy;
        moving ||= Math.abs(tx - dot.dx) + Math.abs(ty - dot.dy) + Math.abs(dot.vx) + Math.abs(dot.vy) > 0.03;
        const x = dot.x + dot.dx, y = dot.y + dot.dy;
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
      }
      context.fill();
      if (moving && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const build = () => {
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      width = box.width; height = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(canvas);
      color = style.color;
      const mask = document.createElement("canvas");
      mask.width = Math.ceil(width); mask.height = Math.ceil(height);
      const ink = mask.getContext("2d", { willReadFrequently: true });
      if (!ink) return;
      ink.font = `700 ${height}px ${style.fontFamily}`;
      const metrics = ink.measureText("Rizwan");
      const size = height * Math.min((width * 0.94) / metrics.width, (height * 0.78) / (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent));
      ink.font = `700 ${size}px ${style.fontFamily}`;
      ink.textAlign = "center";
      ink.fillStyle = "white";
      const fitted = ink.measureText("Rizwan");
      ink.fillText("Rizwan", width / 2, (height + fitted.actualBoundingBoxAscent - fitted.actualBoundingBoxDescent) / 2);
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
      const step = width < 480 ? 3 : 4;
      radius = step * 0.32;
      dots = [];
      for (let y = step; y < height; y += step) {
        for (let x = step; x < width; x += step) {
          if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] > 128) dots.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0 });
        }
      }
      draw();
      canvas.dataset.ready = "true";
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const box = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
      wake();
    };
    const leave = () => { pointer = null; wake(); };
    const resetMotion = () => {
      waveStart = null;
      pointer = null;
      cancelAnimationFrame(frame); frame = 0;
      dots.forEach(dot => { dot.dx = dot.dy = dot.vx = dot.vy = 0; });
      draw();
    };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; waveStart = null; }
      else wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      const entering = entry.isIntersecting && !visible;
      visible = entry.isIntersecting;
      if (visible) {
        if (entering && touch.matches && !reduced.matches) waveStart = performance.now();
        wake();
      } else { cancelAnimationFrame(frame); frame = 0; pointer = null; waveStart = null; }
    }, { threshold: 0.35 });
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(frame); frame = 0; build();
    });
    document.fonts.ready.then(() => {
      if (disposed) return;
      build(); resize.observe(canvas); observer.observe(canvas);
    });
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", resetMotion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect(); observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", resetMotion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <div className="footer-wordmark mx-auto" role="img" aria-label="Rizwan">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span aria-hidden="true" className="footer-wordmark-fallback">Rizwan</span>
    </div>
  );
}
