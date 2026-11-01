"use client";

import { useMemo, useRef } from "react";
import { usePreview } from "../engine/preview-context";
import { usePreviewFrame } from "../engine/use-preview-frame";
import { buildCursorSchedule, cursorFrameAt, type CursorMove, type CursorPoint } from "./motion";

type CursorProps = {
  /** Where the pointer rests before the first move, in design px. */
  start: CursorPoint;
  /** Ordered legs of the journey, each anchored to a step. */
  moves: readonly CursorMove[];
  /** Pointer height in design px. */
  size?: number;
};

/** Ripple diameter in design px. */
const RIPPLE_SIZE = 44;

/**
 * A synthetic pointer — the single primitive that most sells "someone is using this"
 * (`docs/preview-engine-plan.md`, Phase 4).
 *
 * Everything about how it *feels* is in `motion.ts` and is pure: the ballistic easing,
 * the sideways bow that keeps it off a straight line, the dwell before a click, and the
 * press-and-ripple. Only the DOM writing lives here. That split is deliberate — risk
 * R3 ("cursor reads as robotic, illusion collapses") is a maths problem, and putting
 * the maths somewhere `npm run check:engine` can reach it means the tuning is
 * verifiable rather than eyeballed.
 *
 * **Position is written straight to `style.transform`, never through React.** The
 * cursor moves on every frame of a ~4s timeline; rendering that would be ~240 renders
 * per hover on its own and would undo the engine's entire performance model.
 *
 * Under reduced motion the engine parks `elapsed` at the poster step, which will often
 * be a few hundred ms after a click — so "just don't advance the clock" would freeze a
 * half-faded ripple and a mid-press cursor into the static frame. `settled` resolves it
 * to the composed resting position instead (animations.md §12).
 */
export function Cursor({ start, moves, size = 22 }: CursorProps) {
  const { timeline, phase, reducedMotion } = usePreview();
  const groupRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<SVGSVGElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const schedule = useMemo(
    () => buildCursorSchedule(timeline, start, moves),
    [timeline, start, moves],
  );

  usePreviewFrame(({ elapsed }) => {
    const frame = cursorFrameAt(schedule, start, elapsed, reducedMotion);

    const group = groupRef.current;
    if (group) {
      // translate3d, not top/left: transform and opacity only, never a layout
      // property (animations.md §10.4).
      group.style.transform = `translate3d(${frame.x.toFixed(2)}px, ${frame.y.toFixed(2)}px, 0)`;
    }

    const pointer = pointerRef.current;
    if (pointer) {
      // The dip on press. Small on purpose — at a card scale of ~0.4 anything larger
      // reads as the cursor jumping rather than as a click landing.
      pointer.style.transform = `scale(${(1 - frame.press * 0.14).toFixed(3)})`;
    }

    const ripple = rippleRef.current;
    if (ripple) {
      if (frame.ripple === null) {
        ripple.style.opacity = "0";
      } else {
        ripple.style.opacity = (1 - frame.ripple).toFixed(3);
        ripple.style.transform = `scale(${(0.3 + frame.ripple * 0.7).toFixed(3)})`;
      }
    }
  });

  const moving = phase === "playing" || phase === "exiting";

  return (
    <div
      ref={groupRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        // §10.5 — only while it can actually move.
        willChange: moving ? "transform" : undefined,
      }}
    >
      <div
        ref={rippleRef}
        style={{
          position: "absolute",
          left: -RIPPLE_SIZE / 2,
          top: -RIPPLE_SIZE / 2,
          width: RIPPLE_SIZE,
          height: RIPPLE_SIZE,
          borderRadius: "50%",
          border: "2px solid var(--pv-accent)",
          opacity: 0,
          willChange: moving ? "transform, opacity" : undefined,
        }}
      />
      {/* The tip of the arrow is at (1, 1) in the viewBox, so the whole glyph is
          nudged back by one unit — the hotspot then sits exactly on the coordinate a
          scene authored, rather than one pixel down and right of it. */}
      <svg
        ref={pointerRef}
        viewBox="0 0 16 22"
        width={(size * 16) / 22}
        height={size}
        style={{
          position: "absolute",
          left: -size / 22,
          top: -size / 22,
          transformOrigin: "top left",
          display: "block",
        }}
      >
        <path
          d="M1 1 L1 17.4 L5.2 13.6 L8.1 20.4 L11.2 19 L8.3 12.4 L13.9 12.4 Z"
          // Only --pv-* (animations.md §6). The outline is what keeps the pointer
          // readable when it crosses from a light field onto a dark one.
          fill="var(--pv-text)"
          stroke="var(--pv-bg)"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
