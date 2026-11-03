"use client";

import { useEffect } from "react";

// Section reveals (animations.md): each [data-rise] group plays once when its top is --rise-margin inside the
// viewport bottom. The hidden start state only applies after data-rise-ready, so without JS everything shows at rest.
// The Tools heading and the Works cards keep their own reveals (ToolsReveal.tsx, WorksList.tsx).
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const margin = getComputedStyle(root).getPropertyValue("--rise-margin").trim() || "0px";
    root.setAttribute("data-rise-ready", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: `1000000px 0px ${margin} 0px` }, // open top, so a jump past a group still plays it
    );
    document.querySelectorAll("[data-rise]").forEach((group) => io.observe(group));
    // Clear the flag on unmount: it lives on <html>, which survives client navigation, so a page without this
    // component would otherwise keep its [data-rise] groups hidden (the case study Contact did).
    return () => { io.disconnect(); root.removeAttribute("data-rise-ready"); };
  }, []);
  return null;
}
