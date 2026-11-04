"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cv, offClock, person } from "@/lib/content";

type Point = { x: number; y: number; oldx: number; oldy: number };

const POINTS = 13;
const ROPE = 140;           // px, anchor to the card's top
const GRAVITY = 0.55;
const DAMPING = 0.98;
const PASSES = 6;
const STEP = 1000 / 60;     // physics runs at 60Hz whatever the screen
const CLICK = 6;            // px of movement that still counts as a click
const THROW = 22;          // px per frame, the fastest a card can be let go
const TILT = 9;             // deg, towards the pointer
const DROP_AT = 0.35;       // share of the stage in view when the card drops in (animations.md)
const DROP_PUSH = 3;        // px per frame sideways as it drops, so it swings a little as it settles

// A card on a lanyard (motion from the 21st.dev id-card-lanyard demo, look and content ours).
// A Verlet rope holds the card: drag to swing it, click or press Enter to flip it, hover to tilt it towards the pointer.
export function Lanyard() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const flipper = useRef<HTMLDivElement>(null);
  const flipped = useRef(false);
  const flipTo = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = stage.current, cv2 = canvas.current, cardEl = card.current, flip = flipper.current;
    const ctx = cv2?.getContext("2d");
    if (!el || !cv2 || !cardEl || !flip || !ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(el);
    const color = (name: string) => css.getPropertyValue(name).trim();
    let width = 0, height = 0, dpr = 1;
    const anchor = { x: 0, y: 0 };
    const seg = ROPE / (POINTS - 1);
    const pts: Point[] = [];
    const end = () => pts[POINTS - 1];

    let dragging = false, down = { x: 0, y: 0 }, grab = { x: 0, y: 0 }, target = { x: 0, y: 0 }, last = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
    let hover = { x: -9999, y: -9999 };
    let spin = 0, spinTo = 0;                    // flip angle, eased
    const tilt = { x: 0, y: 0 }, tiltTo = { x: 0, y: 0 };
    // Until Contact is in view the card is pulled up to the clip, with the rope gathered behind it. Reduced motion: it already hangs.
    let dropped = reduced;

    const place = () => {
      pts.length = 0;
      for (let i = 0; i < POINTS; i++) {
        const x = anchor.x, y = dropped ? anchor.y + i * seg : anchor.y + i * 0.5;
        pts.push({ x, y, oldx: x, oldy: y });
      }
    };
    const resize = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = r.width; height = r.height;
      cv2.width = width * dpr; cv2.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      anchor.x = width / 2; anchor.y = -4;
      place();
    };
    // Keeps a point inside the stage. A held card also has to stay clear of the anchor.
    const clamp = (p: { x: number; y: number }, held = false) => {
      const half = cardEl.offsetWidth / 2 + 12;
      p.x = Math.max(half, Math.min(width - half, p.x));
      p.y = Math.max(anchor.y + (held ? 20 : 0), Math.min(anchor.y + ROPE * (held ? 1 : 1.3), p.y));
      return p;
    };
    const local = (e: PointerEvent | MouseEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const integrate = () => {
      for (let i = 1; i < POINTS; i++) {
        if (dragging && i === POINTS - 1) continue;
        const p = pts[i];
        const vx = (p.x - p.oldx) * DAMPING, vy = (p.y - p.oldy) * DAMPING;
        p.oldx = p.x; p.oldy = p.y;
        p.x += vx; p.y += vy + GRAVITY;
      }
    };
    const constrain = () => {
      pts[0].x = anchor.x; pts[0].y = anchor.y;
      if (dragging) { end().x = target.x; end().y = target.y; }
      for (let pass = 0; pass < PASSES; pass++) {
        for (let i = 0; i < POINTS - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-4;
          const k = ((seg - d) / d) * 0.5;
          if (i !== 0) { a.x -= dx * k; a.y -= dy * k; }
          if (!(dragging && i + 1 === POINTS - 1)) { b.x += dx * k; b.y += dy * k; }
        }
      }
      for (let i = 1; i < POINTS; i++) clamp(pts[i]);
    };

    const drawRope = () => {
      ctx.clearRect(0, 0, width, height);
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < POINTS - 1; i++) ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
        ctx.lineTo(pts[POINTS - 1].x, pts[POINTS - 1].y);
        ctx.lineCap = "round"; ctx.lineJoin = "round";
      };
      const stroke = (style: string, w: number) => { path(); ctx.strokeStyle = style; ctx.lineWidth = w; ctx.stroke(); };
      ctx.save(); ctx.translate(2, 4); ctx.globalAlpha = 0.35; stroke("#000", 14); ctx.restore();
      stroke(color("--hairline"), 14);
      stroke(color("--card"), 12);
      stroke(color("--brand"), 1.5);
    };

    const layoutCard = () => {
      const a = end(), b = pts[POINTS - 2];
      const angle = Math.atan2(a.y - b.y, a.x - b.x) - Math.PI / 2;
      cardEl.style.transform = `translate(${a.x - cardEl.offsetWidth / 2}px, ${a.y}px) rotate(${angle}rad)`;
    };

    const tiltAndFlip = () => {
      spin += (spinTo - spin) * 0.16;
      if (!dragging && hover.x > -1000) {
        const r = cardEl.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, (hover.x - (r.left + r.width / 2)) / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, (hover.y - (r.top + r.height / 2)) / (r.height / 2)));
        tiltTo.y = nx * TILT; tiltTo.x = -ny * TILT;
        cardEl.style.setProperty("--mx", `${Math.max(0, Math.min(100, ((hover.x - r.left) / r.width) * 100))}%`);
        cardEl.style.setProperty("--my", `${Math.max(0, Math.min(100, ((hover.y - r.top) / r.height) * 100))}%`);
        cardEl.dataset.hover = "";
      } else {
        tiltTo.x = 0; tiltTo.y = 0;
        delete cardEl.dataset.hover;
      }
      tilt.x += (tiltTo.x - tilt.x) * 0.12;
      tilt.y += (tiltTo.y - tilt.y) * 0.12;
      flip.style.transform = `rotateY(${spin + tilt.y}deg) rotateX(${tilt.x}deg)`;
    };

    const render = () => { drawRope(); layoutCard(); tiltAndFlip(); };

    flipTo.current = () => {
      flipped.current = !flipped.current;
      spinTo = flipped.current ? 180 : 0;
      if (reduced) { spin = spinTo; render(); }
    };

    // Loop
    let frame = 0, prev = 0, acc = 0, visible = true;
    const loop = (t: number) => {
      frame = 0;
      acc += Math.min(t - prev, 100); prev = t;
      while (acc >= STEP) { integrate(); constrain(); acc -= STEP; }
      render();
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const start = () => { if (!frame && !reduced && dropped) { prev = performance.now(); acc = 0; frame = requestAnimationFrame(loop); } };

    // Lets the raised card fall from rest; gravity and the rope do the rest.
    const drop = () => {
      if (dropped) return;
      dropped = true;
      end().oldx = end().x - DROP_PUSH;
      start();
    };

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a") || reduced) return;
      e.preventDefault();
      drop();
      dragging = true;
      try { cardEl.setPointerCapture(e.pointerId); } catch { /* a pointer that is already gone */ }
      down = last = local(e);
      grab = { x: down.x - end().x, y: down.y - end().y };
      target = { x: end().x, y: end().y };
      vel = { x: 0, y: 0 };
      cardEl.dataset.dragging = "";
    };
    const onMove = (e: PointerEvent) => {
      hover = { x: e.clientX, y: e.clientY };
      if (!dragging) return;
      const p = local(e);
      target = clamp({ x: p.x - grab.x, y: p.y - grab.y }, true);
      vel = { x: p.x - last.x, y: p.y - last.y };
      last = p;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete cardEl.dataset.dragging;
      const p = local(e);
      if (Math.hypot(p.x - down.x, p.y - down.y) < CLICK) {
        flipTo.current?.();
        end().oldx = end().x; end().oldy = end().y;
        return;
      }
      const speed = Math.hypot(vel.x, vel.y) || 1, k = Math.min(1, THROW / speed);
      end().oldx = end().x - vel.x * k; end().oldy = end().y - vel.y * k; // let go with the speed of the hand
    };
    const onOut = (e: PointerEvent) => { if (e.relatedTarget === null) hover = { x: -9999, y: -9999 }; };
    const onKey = (e: KeyboardEvent) => {
      if (e.target !== cardEl || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      flipTo.current?.();
    };

    resize();
    render();
    const sizes = new ResizeObserver(() => { resize(); render(); });
    sizes.observe(el);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); });
    io.observe(el);
    const dropIn = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { drop(); dropIn.disconnect(); } }, { threshold: DROP_AT });
    if (!dropped) dropIn.observe(el);
    const onVisibility = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVisibility);
    cardEl.addEventListener("pointerdown", onDown);
    cardEl.addEventListener("keydown", onKey);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);
    // Reduced motion: the card hangs still and a click flips it with no turn.
    const onClick = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("a")) flipTo.current?.(); };
    if (reduced) cardEl.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect(); io.disconnect(); dropIn.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      cardEl.removeEventListener("pointerdown", onDown);
      cardEl.removeEventListener("keydown", onKey);
      cardEl.removeEventListener("click", onClick);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div ref={stage} className="lanyard-stage">
      <canvas ref={canvas} aria-hidden className="lanyard-rope" />
      <span aria-hidden className="lanyard-clip" />
      <div ref={card} role="button" tabIndex={0} aria-label={`${person.name}'s card. Press Enter to flip it.`} className="lanyard-card">
        <div ref={flipper} className="lanyard-flipper">
          <div className="lanyard-face">
            <span aria-hidden className="lanyard-slot" />
            <span aria-hidden className="lanyard-sheen" />
            <div className="lanyard-photo">
              <Image src="/images/profile.png" alt={`Portrait of ${person.name}`} fill sizes="240px" className="object-cover object-top" draggable={false} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="title">{person.name}</p>
              <p className="text-muted-foreground">{cv.title}</p>
            </div>
            <div className="h-px w-full bg-hairline" />
            <dl className="grid gap-2">
              <div className="flex justify-between gap-3"><dt className="micro text-muted-foreground">Location</dt><dd className="label">{person.location}</dd></div>
              <div className="flex justify-between gap-3"><dt className="micro text-muted-foreground">Experience</dt><dd className="label">15+ years</dd></div>
            </dl>
            <p className="micro mt-auto text-center text-muted-foreground">Drag to swing · Click to flip</p>
          </div>
          <div className="lanyard-face lanyard-back">
            <span aria-hidden className="lanyard-slot" />
            <span aria-hidden className="lanyard-sheen" />
            <span aria-hidden className="lanyard-stripe" />
            <p className="subtitle text-brand">{offClock.heading}</p>
            <div className="lanyard-personal-photo">
              <Image src={offClock.photo} alt={offClock.photoAlt} fill sizes="220px" className="object-cover" draggable={false} />
            </div>
            <p>{offClock.description}</p>
            <p className="micro mt-auto text-center text-muted-foreground">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}
