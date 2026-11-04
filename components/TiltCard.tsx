"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

// Same condition as the 3 column layout: below lg the cards sit in a swipe row that would clip them.
const canTilt = () => matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches;

// The pointer is read on the stage, which stays still. Reading it on the moving card makes the edges flicker,
// because the card tilts away from the pointer and out from under it.
export function TiltCard({ stageClassName, stageStyle, className, children }: { stageClassName: string; stageStyle?: CSSProperties; className: string; children: ReactNode }) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!canTilt()) return;
    const stage = e.currentTarget;
    const rect = stage.getBoundingClientRect();
    const share = (at: number, start: number, size: number) => Math.min(Math.max((at - start) / size, 0), 1) - 0.5;
    stage.style.setProperty("--tilt-px", String(share(e.clientX, rect.left, rect.width)));
    stage.style.setProperty("--tilt-py", String(share(e.clientY, rect.top, rect.height)));
    stage.dataset.tilted = "";
  };
  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    delete e.currentTarget.dataset.tilted;
  };

  return (
    <div className={`tilt-stage ${stageClassName}`} style={stageStyle} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <figure className={`tilt-card ${className}`}>
        <span aria-hidden className="tilt-spot" />
        {children}
      </figure>
    </div>
  );
}
