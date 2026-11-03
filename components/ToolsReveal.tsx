"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Plays the Tools section's heading entrance once (animations.md); the coin row has its own spin-in (components/ToolCoins.tsx).
// The hidden start state only applies after data-ready, so without JS the section shows at rest.
export function ToolsReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-ready", "");
    const margin = getComputedStyle(el).getPropertyValue("--tools-reveal-margin").trim() || "0px";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: `1000000px 0px ${margin} 0px` }, // open top, so arriving from below a jump still plays it
    );
    el.querySelectorAll("[data-reveal]").forEach((group) => io.observe(group));
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id="tools" aria-labelledby="tools-title" className="tools border-t border-hairline">
      {children}
    </section>
  );
}
