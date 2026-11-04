"use client";

import { useMemo, useRef, type CSSProperties } from "react";
import { usePreview } from "../engine/preview-context";
import { usePreviewFrame } from "../engine/use-preview-frame";
import { caretVisible, charsAt, typingSchedule } from "./motion";

type TypedTextProps = {
  /** The finished string. The substring shown is derived from time, never stored. */
  text: string;
  /** The step during which the text is typed. */
  step: string;
  /** Progress within the step at which the first keystroke lands. */
  from?: number;
  /**
   * Progress within the step at which the last keystroke lands. Defaults short of 1
   * so the finished value is legible for a beat before the step changes — the moment
   * that makes the typing read as *input* rather than as a transition.
   */
  to?: number;
  /** Show the caret. */
  caret?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Text that types itself, derived entirely from elapsed time (animations.md §5).
 *
 * **The substring comes from `stepProgress`, never from an interval.** An interval or a
 * `setState` counter drifts the moment the tab is backgrounded, the clock is paused
 * mid-hover, or the scene is seeked — and it can never render a correct frame without
 * having played through to it, which is the one property the whole architecture rests
 * on (animations.md §4). Deriving it means the text is at exactly the right character
 * at any instant, arrived at by any route.
 *
 * **No React state and no re-render per character.** The frame callback writes
 * `textContent` directly, and only when the count actually changes. A twelve-character
 * value costs zero renders instead of twelve.
 *
 * The rhythm is deliberately uneven — a beat after punctuation, a shorter one after a
 * space, and ±20% everywhere else — but derived from a hash of the character index, so
 * it is uneven *identically* on every replay. See `typingSchedule` in `motion.ts`.
 */
export function TypedText({
  text,
  step,
  from = 0,
  to = 0.88,
  caret = true,
  className,
  style,
}: TypedTextProps) {
  const { timeline, reducedMotion } = usePreview();
  const textRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const schedule = useMemo(() => typingSchedule(text), [text]);

  const window_ = useMemo(() => {
    const index = timeline.indexOf(step);
    if (index === -1) return null;
    const offset = timeline.offsets[index];
    const duration = timeline.steps[index].duration;
    return {
      index,
      startMs: offset + duration * from,
      endMs: offset + duration * to,
    };
  }, [timeline, step, from, to]);

  // Tracked here rather than read back off the DOM: reading textContent every frame
  // to compare lengths is a layout-adjacent read in a hot path, for a number we
  // already know.
  const renderedCount = useRef(-1);

  usePreviewFrame(({ elapsed, stepIndex }) => {
    if (!window_) return;

    let count: number;
    if (reducedMotion) {
      // §12: the composed frame, not a snapshot of one. The engine parks `elapsed`
      // at the poster step, which can easily land mid-word — and a static frame
      // showing "AED 2,5" reads as a bug, not as a resting state. Monotonic
      // accumulation is the rule everywhere else in a scene, so the value is either
      // wholly present or wholly absent. This is the "no partial word" case in the
      // Phase 4 manual test.
      count = stepIndex >= window_.index ? text.length : 0;
    } else {
      const span = window_.endMs - window_.startMs;
      const progress = span <= 0 ? 1 : (elapsed - window_.startMs) / span;
      count = charsAt(schedule, progress);
    }

    if (count !== renderedCount.current) {
      renderedCount.current = count;
      if (textRef.current) textRef.current.textContent = text.slice(0, count);
    }

    const caretEl = caretRef.current;
    if (!caretEl) return;
    // The caret belongs to the act of typing, so it lives and dies with the step.
    // Derived from stepIndex, which is a pure projection — so seeking past this step
    // composes a frame with a finished value and no caret, correctly, first try.
    // Absent entirely under reduced motion: it is the one element here whose whole
    // purpose is to signal that something is happening.
    const onStep = !reducedMotion && stepIndex === window_.index;
    const typing = elapsed >= window_.startMs && elapsed < window_.endMs;
    const visible =
      onStep && caretVisible(elapsed - window_.endMs, typing) ? "1" : "0";
    if (caretEl.style.opacity !== visible) caretEl.style.opacity = visible;
  });

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "baseline", ...style }}
    >
      {/* Deliberately empty in JSX. The first paint is filled by the layout-effect
          subscription, so there is no frame of wrong text and no render per keystroke.
          `pre` keeps a partially-typed string's spaces from collapsing. */}
      <span ref={textRef} style={{ whiteSpace: "pre" }} />
      {caret ? (
        <span
          ref={caretRef}
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            marginLeft: 2,
            // Only --pv-* (animations.md §6). A literal colour here is what breaks
            // dark mode, and a portfolio token is what stops this being reusable.
            background: "var(--pv-accent)",
            // Blink is opacity-driven and clock-derived, so it freezes when the clock
            // does and is simply absent under reduced motion (§12) — no branch needed.
            opacity: 0,
            transform: "translateY(0.12em)",
          }}
        />
      ) : null}
    </span>
  );
}
