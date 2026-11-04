"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Plays the diagram while the box is hovered, or while it is in view on touch screens.
// On leave every part finishes the loop it is in, so nothing snaps back to its place.
export function ServiceBox({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let run = 0;
    let parts: Animation[] = [];

    const play = () => {
      run++;
      el.dataset.lit = "";
      el.dataset.playing = "";
      parts.forEach((part) => {
        part.effect?.updateTiming({ iterations: Infinity });
        if (part.playState !== "running") part.play();
      });
    };

    const stop = () => {
      const current = ++run;
      delete el.dataset.lit;
      parts = el.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation);
      const finishing = parts.filter((part) => {
        const iteration = part.effect?.getComputedTiming().currentIteration;
        if (iteration == null) part.cancel(); // still waiting for its turn in the stagger
        else part.effect?.updateTiming({ iterations: iteration + 1 });
        return iteration != null;
      });
      Promise.allSettled(finishing.map((part) => part.finished)).then(() => {
        if (current !== run) return;
        delete el.dataset.playing;
        parts = [];
      });
    };

    if (window.matchMedia("(hover: hover)").matches) {
      el.addEventListener("pointerenter", play);
      el.addEventListener("pointerleave", stop);
      return () => {
        el.removeEventListener("pointerenter", play);
        el.removeEventListener("pointerleave", stop);
      };
    }
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : el.dataset.playing !== undefined && stop()), { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
