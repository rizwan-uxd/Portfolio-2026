"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Comparison } from "@/lib/case-studies";

// Before/after drag slider (wireframe → UI by default), after 21st.dev's "Before after comparison" (ibrandify):
// drag the divider, jump with the Wireframe / Split / UI design tabs, or use the arrow keys on the handle.
// The frame takes the "after" image's ratio; the "before" is contained in it, so pairs exported at the same frame size line up exactly.

const sizes = "(min-width: 1214px) 1116px, 100vw";
const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function CompareSlider({ comparison }: { comparison: Comparison }) {
  const { before, after, title } = comparison;
  const [beforeLabel, afterLabel] = comparison.labels ?? ["Wireframe", "UI design"];
  const views = [
    { label: beforeLabel, value: 100 },
    { label: "Split", value: 50 },
    { label: afterLabel, value: 0 },
  ];
  const frame = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(50); // % of the width showing the wireframe
  const [dragging, setDragging] = useState(false);

  const seek = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (box) setReveal(clamp(((clientX - box.left) / box.width) * 100));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const next = { ArrowLeft: reveal - step, ArrowRight: reveal + step, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setReveal(clamp(next));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="micro text-muted-foreground">{title ?? "Drag to compare"}</p>
        <div role="group" aria-label="Show" className="flex rounded-btn border border-hairline p-0.5">
          {views.map((view) => (
            <button
              key={view.label}
              type="button"
              aria-pressed={reveal === view.value}
              onClick={() => setReveal(view.value)}
              className={`micro rounded-btn px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-ring ${reveal === view.value ? "bg-brand text-brand-foreground" : "text-muted-foreground"}`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={frame}
        className={`relative w-full touch-pan-y select-none overflow-hidden rounded-lg border border-border bg-card ${dragging ? "cursor-grabbing" : "cursor-ew-resize"}`}
        style={{ aspectRatio: `${after.w} / ${after.h}` }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); seek(e.clientX); }}
        onPointerMove={(e) => dragging && seek(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <Image src={after.src} alt={after.alt} fill sizes={sizes} draggable={false} className="object-contain" />
        <div className="absolute inset-0 bg-card" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes={sizes} draggable={false} className="object-contain" />
        </div>
        <span className="micro pointer-events-none absolute left-3 top-3 rounded-btn bg-background/80 px-2 py-1 text-foreground transition-opacity" style={{ opacity: reveal > 12 ? 1 : 0 }}>{beforeLabel}</span>
        <span className="micro pointer-events-none absolute right-3 top-3 rounded-btn bg-background/80 px-2 py-1 text-foreground transition-opacity" style={{ opacity: reveal < 88 ? 1 : 0 }}>{afterLabel}</span>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-brand" style={{ left: `${reveal}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`${beforeLabel} and ${afterLabel} divider`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(reveal)}
          aria-valuetext={`${Math.round(reveal)}% ${beforeLabel.toLowerCase()}`}
          onKeyDown={onKey}
          className="absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ left: `${reveal}%` }}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
