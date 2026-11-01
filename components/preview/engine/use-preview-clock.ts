"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { CROSSFADE_MS } from "../constants";
import { isClockRunning, nextPhase, resetsClock } from "./playback-machine";
import { stepProgressAt } from "./timeline";
import { subscribeToTicker } from "./ticker";
import type {
  FrameSubscriber,
  PlaybackEvent,
  PlaybackPhase,
  Timeline,
} from "./types";

type ClockOptions = {
  timeline: Timeline;
  playing: boolean;
  reducedMotion: boolean;
  /** Engine root — receives the per-frame CSS variables. */
  rootRef: RefObject<HTMLElement | null>;
};

/**
 * The clock, and the single most important performance decision in the design
 * (animations.md §4).
 *
 * `elapsed` lives in a **ref** and is written on every frame. React state is touched
 * only when the derived **step index changes** — four to eight re-renders per play
 * cycle instead of sixty per second. Continuous effects read `--pv-step-progress`,
 * written to the DOM here each frame, bypassing React entirely (§10.3).
 *
 * **Reduced motion is derived, never stored** (animations.md §12). The clock simply
 * never starts and the returned phase/step are computed from `posterStep` at render
 * time. Storing it would mean syncing an external preference into React state through
 * an effect — cascading renders, and a state machine with two sources of truth.
 * `PreviewEngine` remounts this hook when the preference changes, so there is also
 * no stale motion-path state to unwind.
 */
export function usePreviewClock({
  timeline,
  playing,
  reducedMotion,
  rootRef,
}: ClockOptions) {
  const elapsedRef = useRef(0);
  const stepIndexRef = useRef(0);
  const phaseRef = useRef<PlaybackPhase>("idle");

  const [phase, setPhase] = useState<PlaybackPhase>("idle");
  const [stepIndex, setStepIndex] = useState(0);

  const subscribersRef = useRef<Set<FrameSubscriber>>(new Set());

  /**
   * Per-frame DOM writes plus the subscriber fan-out. Never React state — this runs
   * at 60Hz, and routing it through `setState` is the precise cost the engine exists
   * to avoid.
   *
   * Every path that changes time goes through here — the ticker, the reset on entering
   * `idle`, and the reduced-motion seek — so a subscriber sees them all without caring
   * which one fired.
   */
  const commitFrame = useCallback(
    (elapsed: number) => {
      const progress = stepProgressAt(timeline, elapsed);

      const root = rootRef.current;
      if (root) {
        root.style.setProperty("--pv-step-progress", progress.toFixed(4));
        root.style.setProperty("--pv-elapsed", `${Math.round(elapsed)}`);
      }

      if (subscribersRef.current.size === 0) return;
      const frame = {
        elapsed,
        stepIndex: timeline.indexAt(elapsed),
        stepProgress: progress,
      };
      // Iterate a copy: a subscriber may unsubscribe itself while being notified.
      for (const subscriber of Array.from(subscribersRef.current)) {
        subscriber(frame);
      }
    },
    [rootRef, timeline],
  );

  const send = useCallback(
    (event: PlaybackEvent) => {
      const from = phaseRef.current;
      const to = nextPhase(from, event);
      if (to === from) return;
      // Reset is the whole cleanup story: a scene is a pure projection of
      // stepIndex, so rewinding is one assignment (animations.md §8).
      if (resetsClock(from, to)) {
        elapsedRef.current = 0;
        stepIndexRef.current = 0;
        setStepIndex(0);
        commitFrame(0);
      }
      phaseRef.current = to;
      setPhase(to);
    },
    [commitFrame],
  );

  // ── `playing` → FSM ───────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;
    send(playing ? "play" : "stop");
  }, [playing, reducedMotion, send]);

  // ── Exit fade → idle ──────────────────────────────────────────────────────
  // The clock is already frozen; this timer only decides when the reset lands.
  // Re-entering before it fires resumes instead (see the FSM).
  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = window.setTimeout(() => send("exitEnd"), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, send]);

  // ── The clock itself ──────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion || !isClockRunning(phase)) return;

    return subscribeToTicker((delta) => {
      let elapsed = elapsedRef.current + delta;
      const ended = elapsed >= timeline.duration;

      if (ended) {
        elapsed =
          timeline.onComplete === "loop"
            ? elapsed % timeline.duration
            : timeline.duration;
      }

      elapsedRef.current = elapsed;
      commitFrame(elapsed);

      const index = timeline.indexAt(elapsed);
      if (index !== stepIndexRef.current) {
        stepIndexRef.current = index;
        setStepIndex(index);
      }

      // 'hold' rests on the end state rather than looping, because a loop reads
      // as a GIF and a held success state reads as a product (animations.md §5).
      if (ended && timeline.onComplete !== "loop") send("complete");
    });
  }, [phase, reducedMotion, timeline, commitFrame, send]);

  // ── Reduced motion: the composed poster frame, statically ─────────────────
  const reducedElapsed = timeline.offsets[timeline.posterIndex];

  useEffect(() => {
    if (!reducedMotion) return;
    // DOM-only sync so primitives reading --pv-step-progress see a settled frame
    // rather than a stale one. No state touched, so no cascading render.
    commitFrame(reducedElapsed);
  }, [reducedMotion, reducedElapsed, commitFrame]);

  const effectivePhase: PlaybackPhase = reducedMotion
    ? playing
      ? "complete"
      : "idle"
    : phase;
  const effectiveStepIndex = reducedMotion ? timeline.posterIndex : stepIndex;

  const getElapsed = useCallback(
    () => (reducedMotion ? reducedElapsed : elapsedRef.current),
    [reducedMotion, reducedElapsed],
  );
  const getStepProgress = useCallback(
    () =>
      stepProgressAt(timeline, reducedMotion ? reducedElapsed : elapsedRef.current),
    [timeline, reducedMotion, reducedElapsed],
  );

  /**
   * The primitives' only view of the clock (animations.md §3).
   *
   * The immediate call on subscribe is the important half: `commitFrame` only fires
   * when time *changes*, so a primitive mounting into a held `complete` state, or into
   * a reduced-motion static frame, would otherwise sit unpainted until something moved
   * — which, in both those cases, is never.
   *
   * Both dependencies are fixed for the life of a mount (`timeline` is a module
   * constant, `getElapsed` varies only with the reduced-motion preference, which
   * remounts the engine), so this identity is stable in practice.
   */
  const subscribeFrame = useCallback(
    (subscriber: FrameSubscriber) => {
      const elapsed = getElapsed();
      subscriber({
        elapsed,
        stepIndex: timeline.indexAt(elapsed),
        stepProgress: stepProgressAt(timeline, elapsed),
      });

      const subscribers = subscribersRef.current;
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    },
    [timeline, getElapsed],
  );

  return {
    phase: effectivePhase,
    stepIndex: effectiveStepIndex,
    getElapsed,
    getStepProgress,
    subscribeFrame,
  };
}
