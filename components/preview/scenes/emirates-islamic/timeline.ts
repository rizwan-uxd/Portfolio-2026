import { defineTimeline } from "../../engine/timeline";

/**
 * Emirates Islamic hover reveal — the reference's `autoDemo` loop, 1:1.
 *
 * ## Where these numbers come from
 *
 * The reference (`assets/Project3_artifacts/Emirates Islamic project hover.html`) is a
 * `DCLogic` component whose loop is four literals:
 *
 *   inD   = [0.65, 1.75, 2.85, 1.15, 2.25, 3.35]s   per-element entrance delay
 *   settled at 4500ms · on=false at 5200+1200=6400ms · next run every 5200+2400=7600ms
 *
 * In the reference those entrance delays are CSS `transition-delay`s on six elements
 * that all flip together. Here the *sequencing* is the timeline's job and CSS keeps only
 * the transition (animations.md §"Three approaches" — Framer/CSS animates transitions,
 * never sequence), so each delay becomes a step boundary and every element's own delay
 * drops to 0. Sorting `inD` interleaves panels and phones:
 *
 *   0.65 accounts · 1.15 phone-atm · 1.75 atm · 2.25 phone-amount ·
 *   2.85 voucher  · 3.35 phone-voucher
 *
 * Step durations below are the first differences of that sorted list, so the composed
 * frame at any time is identical to the reference's at the same time. Change a number
 * here and the port stops matching; change it in `geometry.ts` and the layout does.
 *
 * The exit delays (`OUT_DELAY_S`) do NOT become steps — every element leaves on the one
 * `outro` step and its own near-zero delay produces the fast reverse cascade, exactly as
 * the reference does it.
 *
 * ## Two deliberate departures from the doc's defaults
 *
 * **`onComplete: "loop"`.** §5 locks `hold` as the default and argues a loop "reads as a
 * GIF". That holds for the flow scenes, which end on a meaningful success state worth
 * resting on. This one has no success state — it is an ambient reveal of six capability
 * panels that returns to the bare banner and starts again, and looping while hovered was
 * the explicit request (2026-08-09). The `outro`/`rest` beats mean the loop seam is the
 * plain poster, so it reads as breathing rather than as a restart.
 *
 * **7.6s duration**, outside §5's 3.5–4.5s budget. The third such exception after
 * SecureLink (6.95s) and DubaiNow (8.6s), and for the same reason: the reference's own
 * cadence is the brief. Not a precedent for a generic scene.
 */
const STEPS = [
  // Reference t=0..0.65: on, but every element still at its rest offset.
  { id: "rest", duration: 650 },
  { id: "accounts", duration: 500 },
  { id: "phone-atm", duration: 600 },
  { id: "atm", duration: 500 },
  { id: "phone-amount", duration: 600 },
  { id: "voucher", duration: 500 },
  // 3350 → 4500: the last element finishes arriving before the settle beat.
  { id: "phone-voucher", duration: 1150 },
  // Reference t=4.5s: `settled` — every element rises 2px and the card's lift eases
  // from -10px to -6px. 1900ms carries it to the 6.4s turn-off.
  { id: "settle", duration: 1900 },
  // Reference t=6.4s..7.6s: everything leaves on the fast reverse cascade, then the
  // banner sits bare until the loop wraps.
  { id: "outro", duration: 1200 },
];

const DESCRIPTION =
  "Preview: the Emirates Islamic website, with panels revealing the account selection, " +
  "cardless ATM withdrawal and voucher transfer flows, alongside the same journeys on " +
  "mobile.";

export const emiratesIslamicTimeline = defineTimeline({
  aspect: "4 / 3",
  designWidth: 560,
  // The most legible frame: all six panels up and settled. This is what reduced motion
  // composes statically (§12), so it must be a step where everything is present.
  posterStep: "settle",
  onComplete: "loop",
  // Mouse leave snaps straight back to the banner with no crossfade, by explicit
  // request (2026-08-09). See `engine/types.ts` — the default stays "fade".
  exit: "instant",
  description: DESCRIPTION,
  steps: STEPS,
});
