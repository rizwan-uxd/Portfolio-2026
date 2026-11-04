import { defineTimeline } from "../../engine/timeline";
import type { TimelineStep } from "../../engine/types";

/**
 * SecureLink UI on the 4:3 grid card (built 2026-08-01 for the since-deleted
 * `etihad-engineering-website` slot, now SecureLink's own grid scene)
 * (2026-08-01), by explicit request — same interaction shape as
 * `scenes/secure-communication/timeline.ts` (cursor → card selection → detail
 * crossfade → chat population → hold), re-timed for a 4-bubble subset instead of the
 * original 7 (see `scene.tsx` for which four and why). The shared beats before the
 * first bubble (cursor in/approach/select/reveal/cursor-out/day-chip) keep the
 * featured scene's exact durations; only the message cadence is compressed, since
 * this is a duplicate-and-adapt, not the 1:1 fidelity port the featured card is.
 *
 * Grid canvas (4:3, 560px) — the smaller of the two Phase 0 designWidths, ~12-element
 * budget, which is why the sidebar and one meeting card were dropped (`scene.tsx`).
 *
 * `mockup`/`zoom` prepended (2026-08-01, by request) — same desktop-monitor intro as
 * the featured scene, via the shared `primitives/device-mockup.tsx`. Retimed to
 * 800ms alongside it (2026-08-01) for the same legibility reason; the framed
 * scale is aspect-independent, so this 4:3 canvas frames at the same ~0.574 as
 * the 21:9 one.
 */
const STEPS: TimelineStep[] = [
  { id: "mockup", duration: 800 },
  { id: "zoom", duration: 650 },
  { id: "rest", duration: 500 },
  { id: "cursor-in", duration: 400 },
  { id: "approach", duration: 650 },
  { id: "select", duration: 200 },
  { id: "reveal", duration: 250 },
  { id: "cursor-out", duration: 100 },
  { id: "day-chip", duration: 400 },
  // Reuses message content from `secure-communication/shared.tsx`'s MESSAGES[0, 1, 3, 6]
  // (m1, m2, m4, m7) — the greeting, a reply, the question, and the kickoff line, the
  // subset that keeps a complete opening→close arc without the "waiting for Mike"
  // middle beat, which doesn't stand on its own without the bubbles around it.
  { id: "m1", duration: 450 },
  { id: "m2", duration: 550 },
  { id: "m4", duration: 650 },
  { id: "m7", duration: 900 },
];

const DESCRIPTION =
  "Preview: selecting the Daily standup meeting from a list, its details loading, " +
  "then the team's chat messages arriving one by one.";

export const secureCommunicationGridTimeline = defineTimeline({
  aspect: "4 / 3",
  designWidth: 560,
  posterStep: "m7",
  onComplete: "hold",
  description: DESCRIPTION,
  steps: STEPS,
});
