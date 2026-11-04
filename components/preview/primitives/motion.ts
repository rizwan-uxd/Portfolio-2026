import type { Timeline } from "../engine/types";

/**
 * The pure motion math behind `cursor.tsx` and `typed-text.tsx`.
 *
 * Split out from the components on purpose: **every function here is a pure function
 * of elapsed time**, so the two things Phase 4 is most likely to get wrong — a cursor
 * that reads as mechanical, and typing that desyncs on a paused or backgrounded tab —
 * are verifiable headlessly by `npm run check:engine`, with no DOM and no browser.
 *
 * The rule the whole file obeys: *no state, no randomness at call time*. Anything that
 * looks random (typing rhythm, the direction a cursor curves) is derived from a hash of
 * a fixed index, so seeking to 2.4s twice gives the same frame, and seeking there
 * directly gives the same frame as playing there. That is the load-bearing property of
 * the architecture (animations.md §4) applied to continuous effects rather than steps.
 */

// ── deterministic pseudo-randomness ──────────────────────────────────────────

/**
 * Integer hash → [0, 1). A real random number generator would make typing rhythm
 * differ between a play-through and a seek to the same instant, which is exactly the
 * desync this phase's manual test looks for.
 */
function hash01(seed: number): number {
  let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

// ── easing ───────────────────────────────────────────────────────────────────

/**
 * A CSS-equivalent `cubic-bezier(x1, y1, x2, y2)` as a plain function.
 *
 * Needed as JS rather than a CSS transition because the cursor's position is derived
 * from elapsed time on every frame — the whole point being that it is *seekable*. A
 * CSS transition would animate from wherever it currently is, which is the one thing a
 * pure projection of a scalar must never do.
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (t: number) => number {
  const curve = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };
  const slope = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
  };

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    // Newton–Raphson: four iterations puts the error well below a device pixel at
    // any scale this engine renders at, and it is branch-free and allocation-free.
    let guess = t;
    for (let i = 0; i < 4; i++) {
      const error = curve(x1, x2, guess) - t;
      const derivative = slope(x1, x2, guess);
      if (derivative === 0) break;
      guess -= error / derivative;
    }
    const clamped = guess < 0 ? 0 : guess > 1 ? 1 : guess;
    return curve(y1, y2, clamped);
  };
}

/**
 * The pointer travel curve: leaves fast, settles slowly.
 *
 * A hand moving a mouse is ballistic — most of the distance is covered early, then it
 * decelerates into the target (Fitts, roughly). A linear or symmetric ease is what makes
 * synthetic cursors read as cheap, which risk register R3 names as the most likely way
 * this feature fails. No overshoot: at a card scale of ~0.4 an overshoot resolves to
 * under two device pixels and reads as a wobble rather than as weight.
 */
export const easePointer = cubicBezier(0.32, 0.02, 0.18, 1);

/** Nudges a straight line into a hand-drawn one. Zero at both ends, 1 in the middle. */
export function arcOffset(t: number): number {
  return Math.sin(Math.PI * t);
}

/** How far a travel of `distance` bows off the straight line, in design px. */
export function arcAmplitude(distance: number): number {
  const bowed = distance * 0.14;
  return bowed > 48 ? 48 : bowed;
}

// ── typing ───────────────────────────────────────────────────────────────────

/**
 * Per-character arrival times, normalised to 0→1 across the typing window.
 *
 * Uniform character spacing is the tell that text is being animated rather than typed.
 * Real typing has structure: a beat after punctuation, a shorter one after a space, and
 * a constant small unevenness everywhere else. All three are here, all derived from the
 * character index, so the schedule is fixed at build time and identical on every replay.
 */
export function typingSchedule(text: string): readonly number[] {
  const arrivals: number[] = [];
  let total = 0;

  for (let i = 0; i < text.length; i++) {
    const previous = i > 0 ? text[i - 1] : "";
    // The pause lands *after* the punctuation, i.e. it is charged to the next
    // keystroke — which is how it feels when a person types.
    const beat =
      previous === "." || previous === "," || previous === "?" || previous === "!"
        ? 1.7
        : previous === " "
          ? 1.25
          : 1;
    // ±20%, deterministic per position.
    const jitter = 0.8 + hash01(i) * 0.4;
    total += beat * jitter;
    arrivals.push(total);
  }

  for (let i = 0; i < arrivals.length; i++) arrivals[i] /= total;
  return arrivals;
}

/** How many characters have arrived at progress `p` (0→1) through the window. */
export function charsAt(schedule: readonly number[], p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return schedule.length;
  let count = 0;
  while (count < schedule.length && schedule[count] <= p) count++;
  return count;
}

/**
 * Caret visibility, derived from elapsed time rather than a CSS animation.
 *
 * Two reasons it is not `animation: blink 1s infinite`. It must **freeze with the
 * clock** — a caret blinking on a paused, faded-out or backgrounded scene is motion the
 * user did not ask for; and it must be **absent under reduced motion**, which falls out
 * for free here because the engine simply never advances `elapsed`. Solid while typing,
 * because a real caret does not blink under a keystroke.
 */
export function caretVisible(msSinceTyping: number, typing: boolean): boolean {
  if (typing) return true;
  const BLINK_MS = 1060;
  return msSinceTyping % BLINK_MS < BLINK_MS / 2;
}

// ── cursor path resolution ───────────────────────────────────────────────────

export type CursorPoint = { x: number; y: number };

/** One leg of a cursor journey, anchored to a step (animations.md §5). */
export type CursorMove = CursorPoint & {
  /** The step this movement happens during. */
  step: string;
  /**
   * Progress within the step at which the cursor reaches the target. The remainder
   * of the step is dwell — the pause before a click that makes the gesture read as
   * deliberate rather than as a machine hitting a coordinate.
   */
  arrive?: number;
  /** Progress within the step at which the click lands. Implies a click ripple. */
  clickAt?: number;
};

type ResolvedMove = {
  from: CursorPoint;
  to: CursorPoint;
  /** Absolute ms at which travel starts and ends. */
  startMs: number;
  endMs: number;
  /** Absolute ms of the click, or `null`. */
  clickMs: number | null;
  /** Which way this leg bows. Alternates, so a path never looks like one long arc. */
  bow: number;
};

export type CursorSchedule = readonly ResolvedMove[];

export type CursorFrame = {
  x: number;
  y: number;
  /** 0→1, how far into a press the cursor is. Drives the scale dip. */
  press: number;
  /** 0→1 through the click ripple, or `null` when no ripple is live. */
  ripple: number | null;
};

const RIPPLE_MS = 420;
const PRESS_MS = 150;

/**
 * Flattens step-anchored moves into absolute-ms legs, once, at mount.
 *
 * Scenes author cursor positions against steps because that is the unit they think in
 * ("click confirm during `confirm`"); the per-frame code needs milliseconds. Doing the
 * conversion here means retiming a step moves the cursor with it automatically — the
 * same reason timelines are durations rather than absolute times (animations.md §5).
 *
 * Unknown step ids are dropped rather than thrown on: a cursor is decoration, and a
 * scene losing one leg is a far better failure than a card that throws.
 */
export function buildCursorSchedule(
  timeline: Timeline,
  start: CursorPoint,
  moves: readonly CursorMove[],
): CursorSchedule {
  const resolved: ResolvedMove[] = [];
  let from = start;

  moves.forEach((move, index) => {
    const stepIndex = timeline.indexOf(move.step);
    if (stepIndex === -1) return;

    const stepStart = timeline.offsets[stepIndex];
    const stepDuration = timeline.steps[stepIndex].duration;
    const arrive = clamp01(move.arrive ?? 0.55);
    const to = { x: move.x, y: move.y };

    resolved.push({
      from,
      to,
      startMs: stepStart,
      endMs: stepStart + stepDuration * arrive,
      clickMs:
        move.clickAt === undefined
          ? null
          : stepStart + stepDuration * clamp01(move.clickAt),
      bow: index % 2 === 0 ? 1 : -1,
    });
    from = to;
  });

  return resolved;
}

/**
 * The cursor's complete state at `elapsed` — position, press, ripple.
 *
 * **`settled` is the reduced-motion path, and it is not cosmetic.** The engine parks
 * `elapsed` at the poster step and never advances it (animations.md §12), and a poster
 * step will routinely land a few hundred ms after a click — at which point the
 * "static" frame renders a half-faded ripple ring frozen forever and a cursor stuck
 * mid-press. That is a transient rendered as a resting state, which is precisely what
 * §12 means by an ambient effect surviving into a static frame. `settled` collapses
 * every leg the timeline has reached to its final anchor, with no press and no ripple:
 * the composed frame a reduced-motion user should see.
 */
export function cursorFrameAt(
  schedule: CursorSchedule,
  start: CursorPoint,
  elapsed: number,
  settled = false,
): CursorFrame {
  let point: CursorPoint = start;
  let press = 0;
  let ripple: number | null = null;

  for (const move of schedule) {
    if (elapsed < move.startMs) break;

    if (settled) {
      point = move.to;
      continue;
    }

    if (elapsed >= move.endMs) {
      point = move.to;
    } else {
      const t = (elapsed - move.startMs) / (move.endMs - move.startMs);
      point = pointOnPath(move, t);
    }

    if (move.clickMs !== null) {
      const since = elapsed - move.clickMs;
      if (since >= 0) {
        if (since < RIPPLE_MS) ripple = since / RIPPLE_MS;
        if (since < PRESS_MS) {
          // Down fast, up slower — the shape of a real button press.
          press = since < PRESS_MS * 0.3 ? since / (PRESS_MS * 0.3) : 1 - (since - PRESS_MS * 0.3) / (PRESS_MS * 0.7);
        }
      }
    }
  }

  return { x: point.x, y: point.y, press: clamp01(press), ripple };
}

function pointOnPath(move: ResolvedMove, t: number): CursorPoint {
  const eased = easePointer(t);
  const dx = move.to.x - move.from.x;
  const dy = move.to.y - move.from.y;
  const distance = Math.hypot(dx, dy);

  const x = move.from.x + dx * eased;
  const y = move.from.y + dy * eased;
  if (distance === 0) return { x, y };

  // Perpendicular to the line of travel, so the bow is always sideways to the
  // direction of movement rather than in a fixed screen axis.
  const bow = arcOffset(eased) * arcAmplitude(distance) * move.bow;
  return { x: x + (-dy / distance) * bow, y: y + (dx / distance) * bow };
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
