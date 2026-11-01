import { defineTimeline } from "../../engine/timeline";
import type { TimelineStep } from "../../engine/types";

/**
 * Ported 1:1 from `ref images/mobile-flow-preview.html`'s `runCycle()` — every
 * duration below is that file's absolute-ms trigger minus the previous one, and the
 * steps sum to its 8600ms cycle exactly.
 *
 * Second explicit exception to the 3.5–4.5s hover budget (animations.md §5), after
 * `secure-communication`'s ~6.95s: the brief is exact fidelity to an approved
 * product simulation. Do not "tighten" this to fit the budget.
 *
 * **No `mockup`/`zoom` intro, unlike the other featured card** — and that is
 * geometry, not an omission. `PosterMockup` dollies by squeezing the scene into a
 * region of the poster and growing it to identity, so a push-in only exists if the
 * final phone is *larger* than the poster's. The DubaiNow banner's centre phone
 * already fills all 480px of canvas height (measured: the screen maps to canvas
 * y −0.4 → 480.3), so anything larger crops the bottom third — where the CTA, the
 * tab bar and the success sheet live. The scene instead registers 1:1 on that phone
 * and lets the engine's own 180ms poster↔scene crossfade (`CROSSFADE_MS`) be the
 * whole transition. See `scene.tsx`.
 *
 * Only used in the `featured` (21:9) slot — `dubainow-mobile-app` is always
 * `projects[1]`, which `selected-work.tsx` renders as the second featured card, so
 * no grid-canvas variant exists.
 *
 * Two beats are split out of a longer reference interval purely so that a state
 * which the reference drives with a nested `setTimeout` becomes *step-derived*
 * rather than progress-derived (`report-tap`, `press-cta`). That matters for
 * reduced motion: a frozen clock composes a correct frame only for step-derived
 * effects (animations.md §12), and both of these are transients that would
 * otherwise freeze half-applied — a tile mid-glow, a button mid-press.
 */
const STEPS: TimelineStep[] = [
  // Reference t=0..500: home screen, no cursor yet.
  { id: "rest", duration: 500 },
  // Reference t=500: cursor appears and moves to the Police tile; t=1000 it clicks.
  // The reference teleports it there on a CSS transition from its parked position;
  // `Cursor` travels ballistically over the same 500ms instead.
  { id: "approach-police", duration: 500 },
  // Reference t=1000: ring pings, the Police screen slides in over 500ms. Runs to
  // t=2200, when the next approach begins.
  { id: "to-police", duration: 1200 },
  // Reference t=2200..2700: cursor travels to the Report Accident tile and clicks.
  { id: "approach-report", duration: 500 },
  // Reference t=2700..2950: the tile's blue glow is on, and the location screen
  // slides in. Its own step so the glow is a step, not a fraction of one.
  { id: "report-tap", duration: 250 },
  // Reference t=2950..4400: glow off, map + bottom sheet at rest.
  { id: "location-rest", duration: 1450 },
  // Reference t=4400..4900: cursor travels to the Report Accident CTA and clicks.
  { id: "approach-cta", duration: 500 },
  // Reference t=4900..5050: the CTA's 150ms pressed state. Its own step, as above.
  { id: "press-cta", duration: 150 },
  // Reference t=5050..5300: released, before the modal.
  { id: "cta-release", duration: 250 },
  // Reference t=5300: the success sheet rises. The reference loops at t=8600; this
  // scene holds on the end state instead, per the locked `onComplete: 'hold'`
  // decision (animations.md §5) — a hover-triggered preview is not a demo page
  // repeating for an unattended viewer.
  { id: "success", duration: 3300 },
];

const DESCRIPTION =
  "Preview: the DubaiNow app home screen, tapping through to Police services, then " +
  "Report Accident, confirming the number of vehicles on a map, and submitting the " +
  "report successfully.";

export const dubainowTimeline = defineTimeline({
  aspect: "21 / 9",
  designWidth: 1120,
  posterStep: "success",
  onComplete: "hold",
  description: DESCRIPTION,
  steps: STEPS,
});
