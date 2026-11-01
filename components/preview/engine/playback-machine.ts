import type { PlaybackEvent, PlaybackPhase } from "./types";

/**
 * The playback FSM, as a pure function (animations.md §8).
 *
 * Pure and total: same input, same output, every phase/event pair defined. All the
 * awkward lifecycle questions — does leaving reset? does re-entering resume? — are
 * answered here, once, instead of being scattered through effects.
 *
 * The two transitions that carry the design:
 *
 * - **`playing` + `stop` → `exiting`, not `idle`.** Leaving mid-play *pauses*; the
 *   clock freezes where it is and the scene crossfades out. A jittery mouse must not
 *   stutter the scene back to frame 0.
 * - **`exiting` + `play` → `playing`.** Re-entering inside the 180ms fade *resumes*
 *   from the same elapsed time. Reset happens only on entering `idle`, after the
 *   fade settles.
 */
export function nextPhase(
  phase: PlaybackPhase,
  event: PlaybackEvent,
): PlaybackPhase {
  switch (phase) {
    case "idle":
      return event === "play" ? "playing" : "idle";

    case "playing":
      if (event === "stop") return "exiting";
      if (event === "complete") return "complete";
      return "playing";

    case "complete":
      // Holding the end state. Leaving fades it out; the clock is already parked
      // at the end, so there is nothing to pause.
      return event === "stop" ? "exiting" : "complete";

    case "exiting":
      if (event === "play") return "playing";
      if (event === "exitEnd") return "idle";
      return "exiting";

    // `arming` and `mounting` are owned by the card and by ProjectPreview
    // respectively (see types.ts). The engine never occupies them, but the machine
    // stays total rather than throwing on a phase it merely doesn't produce.
    case "arming":
    case "mounting":
      return event === "stop" ? "idle" : phase;
  }
}

/**
 * Entering `idle` is the *only* place the clock resets. Because a scene is a pure
 * projection of `stepIndex`, reset is literally `elapsed = 0` — no teardown, no
 * cleanup, nothing to get wrong (animations.md §8).
 */
export function resetsClock(from: PlaybackPhase, to: PlaybackPhase): boolean {
  return to === "idle" && from !== "idle";
}

/** Phases in which the scene layer is on screen. */
export function isSceneVisible(phase: PlaybackPhase): boolean {
  return phase === "playing" || phase === "complete" || phase === "exiting";
}

/** Phases in which the shared ticker should be driving this engine. */
export function isClockRunning(phase: PlaybackPhase): boolean {
  return phase === "playing";
}
