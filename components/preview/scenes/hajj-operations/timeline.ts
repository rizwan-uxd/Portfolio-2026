import { defineTimeline } from "../../engine/timeline";

/**
 * Hajj hover scene timeline (spec §4).
 *
 * **The scene is time-driven, not step-driven.** Unlike every other scene here, its
 * visuals come from `frame.ts`'s continuous `hajjFrame(t)` rather than from
 * `isAtOrAfter`. These steps exist so the engine has a phase to derive, a `posterStep`
 * to seek to and a duration to loop on — and their boundaries are deliberately the
 * reference's own stage boundaries in loop time, so a step change always coincides with
 * a real beat rather than cutting one in half.
 *
 * Durations sum to 9000ms, which must equal `frame.ts`'s `DUR × 1000`. `check:engine`
 * asserts the agreement: the engine's clock and the ported maths are two independent
 * statements of the same nine seconds, and if they drift the loop seam lands mid-beat.
 *
 * Two departures from animations.md's defaults, both recorded in spec §9:
 *   - 9.0s is outside §5's 3.5–4.5s budget. Fourth exception, after SecureLink (6.95),
 *     DubaiNow (8.6) and Emirates (7.6). Not a precedent for a generic scene.
 *   - `onComplete: "loop"` rather than the locked `hold`. Second scene to loop, and for
 *     Emirates' reason: there is no success state worth resting on. The seam is the
 *     plain zoomed-out gallery, so it reads as breathing rather than as a restart.
 */
export const hajjOperationsTimeline = defineTimeline({
  aspect: "21 / 9",
  designWidth: 1120,
  posterStep: "buildIn",
  onComplete: "loop",
  // The default. Stated explicitly because it is a real decision here: this scene
  // replaces the poster, so a crossfade is a swap between two images rather than the
  // ghosting-out Emirates had to opt out of.
  exit: "fade",
  description:
    "A project approval in an operations data-entry platform, then a live executive dashboard building in — power load, meter connectivity, interruptions, drill-test readiness and alerts.",
  steps: [
    { id: "titleA", duration: 1000 },
    { id: "zoomInA", duration: 550 },
    { id: "approve", duration: 1500 },
    { id: "railToB", duration: 1400 },
    { id: "titleB", duration: 1000 },
    { id: "buildIn", duration: 2450 },
    { id: "zoomOut", duration: 1100 },
  ],
});
