import { defineTimeline } from "../../engine/timeline";
import type { TimelineStep } from "../../engine/types";

/**
 * Ported 1:1 from `ref images/securelink-preview.html`'s `setTimeout` chain — every
 * duration below is that file's absolute-ms trigger minus the previous one. This is
 * an explicit exception to the usual 3.5–4.5s hover budget (animations.md §5): the
 * brief for this scene is exact fidelity to an approved product simulation, not the
 * generic previews' pacing target. Do not "tighten" this to fit the budget.
 *
 * Only used in the `featured` (21:9) slot — `secure-communication-app` is always
 * `projects[0]` (`selected-work.tsx`), so no grid-canvas variant exists.
 *
 * `mockup`/`zoom` prepended (2026-08-01, by request) — a mockup intro
 * (`primitives/poster-mockup.tsx`) ahead of the reference's own sequence: the
 * card's own poster held as the first frame → camera dollies into the poster's
 * screen while the live UI fades up in register → then the reference's
 * interaction plays exactly as before. Adds ~1.45s on top of the exception
 * already documented above. `zoom` must stay equal to `MOCKUP_ZOOM_MS`
 * (`../../constants`), which `scripts/preview-engine-check.ts` enforces.
 */
const STEPS: TimelineStep[] = [
  // The poster itself, full bleed and untransformed — pixel-identical to the
  // resting card, so the hover opens on no visible change at all. 800ms, not
  // 600: this beat's whole job is to read as "the card you were already looking
  // at" before anything moves, and a shorter hold makes the dolly feel like it
  // starts mid-gesture (2026-08-01, revised — it used to be a drawn monitor
  // judged on legibility; the poster replaced it, the duration stands).
  { id: "mockup", duration: 800 },
  // Camera dollies into the poster's screen: PosterMockup scales the poster up
  // and the canvas down-to-identity on exactly inverse transforms, so the live
  // UI stays registered on the poster's screenshot of it for the whole move.
  { id: "zoom", duration: 650 },
  // Initial composed frame: sprint card selected + its detail panel visible,
  // cursor not yet on screen. Reference: t=0.
  { id: "rest", duration: 500 },
  // Reference: cursor fades in at t=500.
  { id: "cursor-in", duration: 400 },
  // Reference: cursor travels toward the standup card from t=900, arriving ~1450,
  // clicking at t=1550. Travel + click share this one step (Cursor's own
  // arrive/clickAt progress within it), matching the reference's dwell-then-click.
  { id: "approach", duration: 650 },
  // Reference: t=1550 — click ring pings, standup card selects, sprint deselects.
  { id: "select", duration: 200 },
  // Reference: t=1750 — detail panel crossfades, chat header/sub swap, empty-chat
  // hides.
  { id: "reveal", duration: 250 },
  // Reference: t=2000 — cursor fades out.
  { id: "cursor-out", duration: 100 },
  // Reference: t=2100 — "Today" day-chip fades in.
  { id: "day-chip", duration: 400 },
  // Reference: bubbles m1..m7 at t=2500, 2950, 3500, 4150, 4700, 5350, 5950 — each
  // duration below is that gap.
  { id: "m1", duration: 450 },
  { id: "m2", duration: 550 },
  { id: "m3", duration: 650 },
  { id: "m4", duration: 550 },
  { id: "m5", duration: 650 },
  { id: "m6", duration: 600 },
  // Reference loops at t=9200 (~3.25s after m7); this scene holds instead of
  // looping — a hover-triggered preview holding on its end state, per the locked
  // `onComplete: 'hold'` decision (animations.md §5), not a demo page that repeats
  // for an unattended viewer.
  { id: "m7", duration: 1000 },
];

const DESCRIPTION =
  "Preview: a desktop browser window zooming in, then selecting the Daily standup " +
  "meeting from a list, its details and participants loading, then the team's " +
  "chat messages arriving one by one.";

export const secureCommunicationTimeline = defineTimeline({
  aspect: "21 / 9",
  designWidth: 1120,
  posterStep: "m7",
  onComplete: "hold",
  description: DESCRIPTION,
  steps: STEPS,
});
