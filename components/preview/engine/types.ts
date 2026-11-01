/**
 * Preview engine — shared types. See `animations.md` §4 (state flow) and §5 (timeline).
 *
 * The engine tier knows about *time* and never about pixels or products.
 */

/** One ordered beat of a scene. Durations, not absolute times (animations.md §5). */
export type TimelineStep = {
  id: string;
  /** Milliseconds this step occupies. */
  duration: number;
};

export type TimelineSpec = {
  /** CSS aspect-ratio for the engine's outer box, e.g. `'4 / 3'`. */
  aspect: string;
  /** Fixed pixel width the scene is authored at (animations.md §7). */
  designWidth: number;
  /** Step whose composed frame represents the scene at rest — used for the poster
   *  and, critically, for the reduced-motion static render (animations.md §12). */
  posterStep: string;
  onComplete?: "hold" | "loop" | "once";
  /**
   * How the scene leaves on pointer-leave. Defaults to `"fade"` — the `CROSSFADE_MS`
   * poster crossfade animations.md §8 specifies, and what every flow scene wants.
   *
   * `"instant"` drops the scene in one frame instead. It exists for scenes composed
   * *over* the poster rather than replacing it: there the crossfade is not a swap
   * between two images but a ghosting-out of overlays on top of a banner that never
   * moved, which reads as lag rather than as a transition.
   * `scenes/emirates-islamic/` is the case it was added for (2026-08-09, by explicit
   * request); DubaiNow already snaps its own poster layer back for the same reason.
   *
   * Reduced motion is unaffected: §12 already replaces the crossfade with an instant
   * swap regardless of this setting.
   */
  exit?: "fade" | "instant";
  /** Prose account of what the animation shows, rendered as visually-hidden text
   *  so screen-reader users get the content of the scene (animations.md §11). */
  description: string;
  steps: TimelineStep[];
};

/**
 * A `TimelineSpec` with cumulative offsets precomputed once at module scope, so
 * per-frame lookup is a binary search over a small sorted array — no allocation,
 * no work (animations.md §5).
 */
export type Timeline = Required<Omit<TimelineSpec, "steps">> & {
  steps: readonly TimelineStep[];
  /** `aspect` parsed to a number (w ÷ h), precomputed at module scope. */
  aspectRatio: number;
  /** `designWidth ÷ aspectRatio` — the authoring canvas height in design px. */
  designHeight: number;
  /** `offsets[i]` is the elapsed time at which step `i` begins. */
  offsets: readonly number[];
  /** Total run time in ms. */
  duration: number;
  /** Resolved index of `posterStep`. */
  posterIndex: number;
  /** Index of a step id, or -1. */
  indexOf(id: string): number;
  /** Step index containing `elapsed` (binary search, clamped to range). */
  indexAt(elapsed: number): number;
};

/**
 * Full lifecycle from animations.md §8.
 *
 * `arming` and `mounting` are owned upstream — the *card* runs the 80ms hover-intent
 * timer (Phase 1) and `ProjectPreview` owns mounting. By the time the engine exists
 * it is already wanted, so the engine itself only ever produces `idle`, `playing`,
 * `complete` and `exiting`. The other two are in the union so the type describes the
 * real system rather than one tier's slice of it.
 */
export type PlaybackPhase =
  | "idle"
  | "arming"
  | "mounting"
  | "playing"
  | "complete"
  | "exiting";

/** Events the pure FSM accepts. */
export type PlaybackEvent =
  /** `playing` went true. */
  | "play"
  /** `playing` went false. */
  | "stop"
  /** Clock reached the end of the timeline. */
  | "complete"
  /** The exit crossfade finished. */
  | "exitEnd";

/**
 * A settled frame of the clock, handed to per-frame subscribers.
 *
 * Everything here is live, unlike the render-time snapshots on the context value.
 */
export type FrameState = {
  elapsed: number;
  stepIndex: number;
  /** Progress (0→1) within the current step. */
  stepProgress: number;
};

export type FrameSubscriber = (frame: FrameState) => void;

/**
 * Published to scenes and primitives (animations.md §4).
 *
 * **`stepIndex`, `stepId`, `elapsed` and `stepProgress` are render-time snapshots.**
 * The engine deliberately re-renders only when `stepIndex` changes, so `elapsed` and
 * `stepProgress` are accurate as of the last step boundary and are *not* live values —
 * reading `stepProgress` during render gives ~0. Continuous effects must use
 * `getStepProgress()` (imperative, from inside a rAF or effect) or the
 * `--pv-step-progress` CSS variable the engine writes on its root each frame
 * (animations.md §10.3). This is the whole point of the design: ~6 renders per play
 * cycle instead of ~240.
 */
export type PreviewContextValue = {
  phase: PlaybackPhase;
  stepIndex: number;
  stepId: string;
  /** Snapshot — see the note above. */
  stepProgress: number;
  /** Snapshot — see the note above. */
  elapsed: number;
  /** Live read of progress (0→1) within the current step. */
  getStepProgress: () => number;
  /** Live read of elapsed ms. */
  getElapsed: () => number;
  /**
   * Per-frame subscription, and **the only clock a primitive is allowed to see**
   * (animations.md §3: primitives "must never know the clock source").
   *
   * Continuous effects — a travelling cursor, a typing caret — need a value every
   * frame, but `stepProgress` on this object is a render-time snapshot and the engine
   * deliberately renders ~6 times per play cycle. Rather than let each primitive reach
   * for `requestAnimationFrame` (four rAF loops per card, and four places to forget
   * `document.hidden`), the engine fans out the frame it is already computing.
   *
   * Subscribers are called **immediately on subscribe** with the current frame, and on
   * every clock write thereafter — including reset and the reduced-motion seek, which
   * are not ticks. That is what lets a primitive mounting mid-play, or under reduced
   * motion, paint a correct frame without waiting for one.
   *
   * Returns an unsubscribe function. Identity is stable for the life of the engine.
   */
  subscribeFrame: (subscriber: FrameSubscriber) => () => void;
  /**
   * **The workhorse** (animations.md §4). Deliberately not `stepId === id`: scenes
   * are written as monotonic accumulation ("the toast exists from `success` onward"),
   * which makes a scene a pure projection of a scalar rather than a state machine
   * that must be walked through in order. That is precisely what lets the engine be
   * dropped at step 5 and render a correct composed frame with no play-through —
   * reduced motion, poster frames, resize and remount all collapse into this one
   * property.
   */
  isAtOrAfter: (id: string) => boolean;
  reducedMotion: boolean;
  /**
   * Container width ÷ `designWidth`, **as of mount** (animations.md §7).
   *
   * Deliberately a snapshot, not live: the live value is written to the
   * `--pv-scale` CSS variable by a `ResizeObserver`, so dragging a window resizes
   * four scenes without re-rendering any of them. A scene that needs to drop a
   * detail below a threshold should do it in CSS off `--pv-scale`, not by
   * re-rendering. `getScale()` is the escape hatch for an imperative read.
   */
  scale: number;
  /** Live read of the current scale. */
  getScale: () => number;
  timeline: Timeline;
};
