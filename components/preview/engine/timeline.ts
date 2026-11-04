import type { Timeline, TimelineSpec } from "./types";

/**
 * Turns a timeline *specification* into a timeline *object* with cumulative offsets
 * precomputed (animations.md §5). Call it once at module scope per scene — the work
 * happens at import, never per frame.
 *
 * Timelines are data, not code. Durations rather than absolute times means retiming
 * a scene is one number changed with no cascading edits — the thing that actually
 * gets done twenty times while tuning feel.
 */
export function defineTimeline(spec: TimelineSpec): Timeline {
  if (spec.steps.length === 0) {
    throw new Error("defineTimeline: a timeline needs at least one step");
  }

  const offsets: number[] = [];
  let total = 0;
  for (const step of spec.steps) {
    if (step.duration <= 0) {
      throw new Error(
        `defineTimeline: step "${step.id}" has a non-positive duration (${step.duration})`,
      );
    }
    offsets.push(total);
    total += step.duration;
  }

  const ids = spec.steps.map((step) => step.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("defineTimeline: step ids must be unique");
  }

  const posterIndex = ids.indexOf(spec.posterStep);
  if (posterIndex === -1) {
    throw new Error(
      `defineTimeline: posterStep "${spec.posterStep}" is not one of [${ids.join(", ")}]`,
    );
  }

  const { ratio: aspectRatio, width: aspectW, height: aspectH } = parseAspect(
    spec.aspect,
  );

  const indexOf = (id: string) => ids.indexOf(id);

  /**
   * Binary search for the step containing `elapsed`. Clamped at both ends so a
   * seek past the end holds on the last step rather than falling off it — which is
   * what `onComplete: 'hold'` means in practice.
   */
  const indexAt = (elapsed: number) => {
    if (elapsed <= 0) return 0;
    if (elapsed >= total) return spec.steps.length - 1;

    let low = 0;
    let high = spec.steps.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (offsets[mid] <= elapsed) low = mid;
      else high = mid - 1;
    }
    return low;
  };

  return {
    aspect: spec.aspect,
    aspectRatio,
    designWidth: spec.designWidth,
    // From the parsed numerator/denominator, not `designWidth / aspectRatio` —
    // the latter gives 479.99999999999994 for 1120 at 21/9, and a fractional
    // canvas height is a sub-pixel seam waiting to happen.
    designHeight: (spec.designWidth * aspectH) / aspectW,
    posterStep: spec.posterStep,
    onComplete: spec.onComplete ?? "hold",
    // Default preserves animations.md §8's crossfade for every scene that does not
    // explicitly opt out, so adding this changed no existing scene.
    exit: spec.exit ?? "fade",
    description: spec.description,
    steps: spec.steps,
    offsets,
    duration: total,
    posterIndex,
    indexOf,
    indexAt,
  };
}

/**
 * `'21 / 9'` → `2.333…`. Parsed once at module scope, never per frame — the engine
 * needs a number to size the authoring canvas, and the string to size the layout box.
 */
function parseAspect(aspect: string): {
  ratio: number;
  width: number;
  height: number;
} {
  const [width, height] = aspect.split("/").map((part) => Number(part.trim()));
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(
      `defineTimeline: could not parse aspect "${aspect}" (expected "w / h")`,
    );
  }
  return { ratio: width / height, width, height };
}

/** Progress (0→1) within the step containing `elapsed`. */
export function stepProgressAt(timeline: Timeline, elapsed: number): number {
  const index = timeline.indexAt(elapsed);
  const start = timeline.offsets[index];
  const { duration } = timeline.steps[index];
  const progress = (elapsed - start) / duration;
  return progress < 0 ? 0 : progress > 1 ? 1 : progress;
}
