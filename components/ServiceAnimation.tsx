"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { DiagramRenderer } from "@/lib/service-diagrams/engine.js";

export type ServiceScene = "growth" | "research" | "interaction" | "conversational" | "prototyping" | "tokenOps";

export function ServiceAnimation({ scene, title, children }: { scene: ServiceScene; title: string; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stageRef.current || !hostRef.current) return;
    const stage = stageRef.current;
    const host = hostRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    let renderer: DiagramRenderer | undefined;
    let nearby = false;
    let hovered = false;
    let failed = false;
    let loading = false;

    function play() {
      if (!hovered || !renderer?.renderer || renderer.lost || reduced.matches || document.hidden) return;
      if (!renderer.playing && renderer.time === 0) renderer.play();
    }

    function reset() {
      hovered = false;
      if (renderer && (renderer.playing || renderer.time > 0)) renderer.seek(0);
    }

    async function mount() {
      if (loading || renderer || failed) return;
      loading = true;
      try {
        const [{ DiagramRenderer }, { examples }] = await Promise.all([
          import("@/lib/service-diagrams/engine.js"),
          import("@/lib/service-diagrams/scenes.js"),
        ]);
        if (!nearby || listeners.signal.aborted) return;
        const diagram = new DiagramRenderer(host, examples[scene], {
          onFrame({ time, duration, playing }) {
            const phase = playing ? "playing" : time >= duration ? "complete" : time > 0 ? "paused" : "initial";
            if (stage.dataset.phase !== phase) stage.dataset.phase = phase;
          },
        });
        if (!diagram.renderer) {
          failed = true;
          diagram.destroy();
          delete stage.dataset.phase;
          return;
        }
        renderer = diagram;
        if (diagram.time > 0) diagram.seek(0);
        const canvas = diagram.renderer.domElement;
        canvas.addEventListener("webglcontextlost", () => {
          delete stage.dataset.ready;
          reset();
        }, options);
        canvas.addEventListener("webglcontextrestored", () => { stage.dataset.ready = ""; }, options);
        stage.dataset.ready = "";
        play();
      } catch (error) {
        failed = true;
        console.warn("Could not load the service animation.", error);
      } finally {
        loading = false;
      }
    }

    function dispose() {
      delete stage.dataset.ready;
      delete stage.dataset.phase;
      renderer?.destroy();
      renderer = undefined;
      hovered = false;
    }

    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) void mount();
      else dispose();
    }, { rootMargin: "160px 0px" });
    observer.observe(stage);

    // Scrolling can fire pointerenter under a stationary cursor. Start on pointermove rather than pointerenter.
    stage.addEventListener("pointermove", (event) => {
      if (hovered || event.pointerType !== "mouse" || event.buttons) return;
      hovered = true;
      play();
    }, options);
    stage.addEventListener("pointerleave", reset, options);
    document.addEventListener("visibilitychange", () => { if (document.hidden) reset(); }, options);
    reduced.addEventListener("change", () => queueMicrotask(reset), options);

    return () => {
      listeners.abort();
      observer.disconnect();
      dispose();
    };
  }, [scene]);

  return (
    <div ref={stageRef} className="service-animation" data-service-animation={scene}
      role="img" aria-label={`${title} diagram`}>
      <div className="service-animation-fallback" aria-hidden="true">{children}</div>
      <div ref={hostRef} className="service-animation-render" aria-hidden="true" />
    </div>
  );
}
