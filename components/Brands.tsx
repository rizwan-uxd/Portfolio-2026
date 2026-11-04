"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { brands, brandsTitle } from "@/lib/content";

export function Brands() {
  // Auto-scroll and the arc are pure CSS (.brands-track in tokens.css). This only handles drag and arrow keys.
  const track = useRef<HTMLDivElement>(null);
  const nudge = useRef(0);
  const drag = useRef<{ x: number; start: number; size: number } | null>(null);

  const setNudge = (value: number) => {
    nudge.current = value;
    track.current?.style.setProperty("--brands-nudge", String(value));
  };
  const staticStrip = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (staticStrip() || e.button !== 0) return;
    const item = e.currentTarget.querySelector("li");
    if (!item) return;
    drag.current = { x: e.clientX, start: nudge.current, size: item.offsetWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) setNudge(drag.current.start + (e.clientX - drag.current.x) / drag.current.size);
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    e.currentTarget.dataset.dragging = "false";
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (staticStrip() || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    setNudge(nudge.current + (e.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section data-rise aria-labelledby="brands-title" className="border-t border-hairline px-4 pb-4 lg:px-6 lg:pb-6">
      {/* Same header as the other sections (owner, 2026-11-03): display size and section-head spacing */}
      <h2 id="brands-title" className="rise-head display pb-8 pt-12 lg:px-6 lg:pb-12 lg:pt-16">{brandsTitle}</h2>
      <div className="brands-panel rise-fade rounded-xl bg-card py-6" style={{ "--rise-at": "120ms" } as React.CSSProperties}>
        <div
          ref={track}
          role="group"
          aria-roledescription="carousel"
          aria-labelledby="brands-title"
          tabIndex={0}
          className="brands-track"
          style={{ "--brands-count": brands.length } as React.CSSProperties}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
        >
          <ul className="brands-list absolute inset-0">
            {brands.map((b, i) => (
              <li key={b.name} className="brands-item" style={{ "--i": i } as React.CSSProperties}>
                <img src={b.logo} alt={b.name} width={b.width} height={b.height} draggable={false} className="brands-logo" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
