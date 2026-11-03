"use client";

import { useEffect, useRef } from "react";
import { toolsSection } from "@/lib/content";
import { ToolLogo, logoPaths } from "@/components/ToolLogos";

// The Tools section's coin row (owner, 2026-11-03). Three.js loads only as the section nears the viewport
// (`--coins-load-margin`); until then, and without JS or WebGL, the static tile row shows instead.
export function ToolCoins() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = root.current, st = stage.current, cv = canvas.current;
    if (!el || !st || !cv) return;
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const margin = getComputedStyle(el).getPropertyValue("--coins-load-margin").trim() || "0px";
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import("@/components/tool-coins/scene")
        .then(({ mountCoins }) => {
          if (cancelled) return;
          el.setAttribute("data-live", ""); // show the stage first, so it has a size to render at
          dispose = mountCoins(st, cv, labels.current, {
            names: toolsSection.tools,
            logos: logoPaths,
            reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
          });
        })
        .catch(() => el.removeAttribute("data-live"));
    }, { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      dispose?.();
    };
  }, []);

  return (
    <div ref={root} className="tools-coins pb-12 lg:pb-16">
      <ul className="tools-fallback grid grid-cols-4 gap-x-2 gap-y-4 px-4 md:grid-cols-8 lg:gap-4 lg:px-12">
        {toolsSection.tools.map((name) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <span className="flex aspect-square w-full items-center justify-center rounded-lg border border-hairline bg-card text-foreground">
              <ToolLogo name={name} />
            </span>
            <span className="micro text-muted-foreground">{name}</span>
          </li>
        ))}
      </ul>
      <div className="tools-stage-scroll">
        <div ref={stage} className="tools-stage">
          <canvas ref={canvas} role="img" aria-label={`${toolsSection.tools.join(", ")} logos as silver coins`} className="block size-full" />
          {toolsSection.tools.map((name, i) => (
            <span
              key={name}
              ref={(n) => { if (n) labels.current[i] = n; }}
              aria-hidden
              className="tools-coin-label micro text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
