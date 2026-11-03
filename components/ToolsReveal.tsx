"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Plays the Tools section's entrance once (animations.md). The hidden start state only applies after data-ready, so without JS the section shows at rest.
export function ToolsReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-ready", "");
    const margin = getComputedStyle(el).getPropertyValue("--tools-reveal-margin").trim() || "0px";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { rootMargin: `1000000px 0px ${margin} 0px` }, // open top, so arriving from below a jump still plays it
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id="tools" aria-labelledby="tools-title" className="tools border-t border-hairline">
      {children}
    </section>
  );
}
