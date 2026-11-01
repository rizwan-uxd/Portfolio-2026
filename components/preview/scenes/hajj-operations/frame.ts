/**
 * Hajj hover scene — the reference's `frame(t)`, ported 1:1 from lines 585–718 of
 * `ref images/hajj-tile-hover.unpacked.html`.
 *
 * **Pure: no React, no DOM, no engine imports.** That is what lets
 * `npm run check:engine` verify the loop seam and the reduced-motion settled frame
 * headlessly, the same way `primitives/motion.ts` is verified.
 *
 * This file is a transcription, not a design. If a beat feels wrong, the reference is
 * the authority — do not retime a constant here without changing the spec first.
 *
 * Two deliberate departures from the source, both structural rather than behavioural:
 *   - `accent` / `success` are module constants; the reference exposed them as editor
 *     props and nothing ever varied them.
 *   - `labelAColor` / `labelBColor` are dropped — they coloured the footer labels
 *     beneath the stage, which this port does not render (spec §3).
 */
import { SLOT_REF, ZOOM } from "./geometry";

/** One full loop, in seconds. The reference's own `DUR`. */
export const DUR = 9.0;

/**
 * The reduced-motion settled time, in seconds (spec §11).
 *
 * Not a step offset. This scene interpolates continuously within every step, so the
 * engine's usual "freeze the clock at `posterStep`" would compose a half-faded click
 * ripple and a partly-built dashboard as though they were a resting state — the exact
 * failure animations.md §12's Phase-4 correction describes. 7.6 s is a genuinely
 * settled moment: the dashboard's build-in completes by r ≈ 7.15, the cursor is long
 * gone, and the countdown has reached its final value. `check:engine` asserts all of
 * that rather than trusting the number.
 */
export const SETTLED_R = 7.6;

const ACCENT = "#E8792B";
const SUCCESS = "#2E9E4F";

// The reference's helpers, verbatim.
const C = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const P = (t: number, a: number, b: number) => C((t - a) / (b - a), 0, 1);
const EO = (x: number) => 1 - Math.pow(1 - x, 3);
const EIO = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const L = (a: number, b: number, x: number) => a + (b - a) * x;

/**
 * Dashboard build-in progress, in loop time: holds the finished state through the
 * zoomed-out title beat, then builds from zero as the dashboard zooms in.
 */
const A = (r: number, a: number, b: number) => (r < 5.45 ? 1 : P(r, a, b));

/** Doughnut wipe: one shared clockwise sweep starting at the Low segment's edge. */
const SEGS = [
  { key: "dLow", off: 0, len: 101, circ: 2 * Math.PI * 68 },
  { key: "dOpt", off: 101, len: 217, circ: 2 * Math.PI * 66 },
  { key: "dRisk", off: 324, len: 16, circ: 2 * Math.PI * 66 },
  { key: "dOver", off: 345, len: 13, circ: 2 * Math.PI * 66 },
] as const;

export type HajjFrame = {
  // — frame A: the approve interaction —
  btnBg: string;
  btnShadow: string;
  btnScale: number;
  btnLabel: string;
  checkOpacity: number;
  checkW: string;
  checkGap: string;
  flashOpacity: number;
  flashScale: number;
  cursorX: number;
  cursorY: number;
  cursorOpacity: number;
  clickOpacity: number;
  clickScale: number;
  // — the camera and the rail —
  zoom: number;
  railX: number;
  deScale: number;
  deBright: number;
  deBlur: number;
  deOpacity: number;
  dbScale: number;
  dbBright: number;
  dbBlur: number;
  dbOpacity: number;
  dbShift: number;
  syncX: number;
  syncW: number;
  syncOpacity: number;
  // — frame B: the dashboard build-in —
  mapScale: number;
  mapX: number;
  mapY: number;
  revealW: number;
  mwFillOpacity: number;
  markerOpacity: number;
  mcBar: number;
  umBar: number;
  dLow: string;
  dOpt: string;
  dRisk: string;
  dOver: string;
  dLabelOpacity: number;
  safDash: string;
  safTextOpacity: number;
  timerHrs: string;
  timerMin: string;
  timerSec: string;
  alertOpacity: number;
  alertHighlight: number;
  // — the two zoomed-out title scrims —
  titleAOpacity: number;
  titleBOpacity: number;
};

export function hajjFrame(r: number, reduced: boolean): HajjFrame {
  // Two 1.0s holds are inserted into the beat clock so each frame's title can be read
  // while it sits zoomed out: one at the top of the loop, one when the dashboard
  // arrives. `r` is loop time (0→9); `t` is the beat clock (0→7).
  let t: number;
  if (r < 1.0) t = 0;
  else if (r < 4.45) t = r - 1.0;
  else if (r < 5.45) t = 3.45;
  else t = r - 2.0;

  const titleA = Math.max(1 - P(r, 1.0, 1.35), P(r, 8.55, 8.9));
  const titleB = P(r, 4.1, 4.45) * (1 - P(r, 5.45, 5.8));

  // — stage 1 (0–0.55): zoom into the Data Entry frame
  // — stage 2 (0.55–2.05): approve interaction, then the sync pulse
  // — stage 3 (2.05–3.45): zoom out to the gallery, rail rotates to the dashboard
  // — stage 4 (3.45–5.9): dashboard zooms in and builds, approval lands, hold
  // — stage 5 (5.9–7.0): zoom out, rail returns, button restored
  const press = P(t, 1.15, 1.25) * (1 - P(t, 1.25, 1.33));
  const approved = t >= 1.25 && t < 6.5;
  const flash = t >= 1.25 ? 1 - P(t, 1.25, 1.8) : 0;
  const move = EO(P(t, 0.6, 1.15));
  const click = t >= 1.2 ? 1 - P(t, 1.2, 1.65) : 0;

  let p = 0;
  if (t >= 2.55 && t < 3.45) p = EIO(P(t, 2.55, 3.45));
  else if (t >= 3.45 && t < 6.3) p = 1;
  else if (t >= 6.3) p = 1 - EIO(P(t, 6.3, 6.9));

  let zoom = 1;
  if (t < 0.55) zoom = L(1, ZOOM, EO(P(t, 0, 0.55)));
  else if (t < 2.05) zoom = ZOOM;
  else if (t < 2.55) zoom = L(ZOOM, 1, EIO(P(t, 2.05, 2.55)));
  else if (t < 3.45) zoom = 1;
  else if (t < 4.0) zoom = L(1, ZOOM, EO(P(t, 3.45, 4.0)));
  else if (t < 5.9) zoom = ZOOM;
  else if (t < 6.3) zoom = L(ZOOM, 1, EIO(P(t, 5.9, 6.3)));

  let railP = p;
  let dbShift = 0;
  let deOpacity = 1;
  let dbOpacity = 1;
  if (reduced) {
    zoom = ZOOM;
    railP = 0;
    dbShift = -SLOT_REF;
    const on = t < 2.4 ? 0 : t < 6.2 ? P(t, 2.4, 2.9) : 1 - P(t, 6.2, 6.7);
    dbOpacity = on;
    deOpacity = 1 - on;
  }

  // Reduced motion stacks both frames: no distance falloff, opacity alone differentiates.
  const dA = reduced ? 0 : Math.min(1, Math.abs(0 - railP));
  const dB = reduced ? 0 : Math.min(1, Math.abs(1 - railP));

  let syncX = 650;
  let syncW = 160;
  let syncOpacity = 0;
  if (t >= 1.55 && t < 2.25) {
    const q = P(t, 1.55, 2.2);
    syncX = reduced ? 640 : L(650, 860, q);
    syncOpacity = Math.sin(Math.PI * q);
  } else if (t >= 6.3 && t < 6.85) {
    const q = P(t, 6.3, 6.85);
    syncX = reduced ? 640 : L(860, 650, q);
    syncW = L(160, 70, q);
    syncOpacity = Math.sin(Math.PI * q) * 0.55;
  }

  // — dashboard build-in (loop-time keys) —
  const mapQ = EO(A(r, 5.5, 6.95));
  const sweep = 360 * A(r, 5.75, 6.6);
  const dough: Record<string, string> = {};
  for (const s of SEGS) {
    const vis = C(sweep - s.off, 0, s.len);
    dough[s.key] = ((s.circ * vis) / 360).toFixed(1) + " 999";
  }

  // The drill timer is present throughout; only the digits tick down, from 02:20:23
  // into the final 01:15:59.
  const total = Math.round(L(4559, 8423, 1 - EO(A(r, 5.85, 6.7))));
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    btnBg: approved ? SUCCESS : ACCENT,
    btnShadow: approved
      ? "0 6px 18px rgba(46,158,79,0.32)"
      : "0 6px 18px rgba(232,121,43,0.30)",
    btnScale: reduced ? 1 : 1 - 0.045 * press,
    // The reference's resting label is "Approve & Publish"; shortened to "Approve" on
    // 2026-08-14. It must stay in sync with the SSR text in `screens/data-entry.tsx`,
    // which is the same string — this callback only overwrites it once the scene runs.
    btnLabel: approved ? "Approved" : "Approve",
    checkOpacity: approved ? 1 : 0,
    checkW: approved ? "13px" : "0px",
    checkGap: approved ? "7px" : "0px",
    flashOpacity: flash * 0.9,
    flashScale: L(0.94, 1.08, 1 - flash),
    cursorX: reduced ? 1320 : L(1148, 1320, move),
    cursorY: reduced ? 852 : L(672, 852, move),
    cursorOpacity: P(t, 0.6, 0.72) * (1 - P(t, 1.5, 1.7)),
    clickOpacity: click * 0.9,
    clickScale: L(0.5, 1.25, 1 - click),
    zoom,
    railX: -railP * SLOT_REF,
    deScale: 1 - 0.1 * dA,
    deBright: 1 - 0.45 * dA,
    deBlur: reduced ? 0 : 2.4 * dA,
    deOpacity,
    dbScale: 1 - 0.1 * dB,
    dbBright: 1 - 0.45 * dB,
    dbBlur: reduced ? 0 : 2.4 * dB,
    dbOpacity,
    dbShift,
    syncX,
    syncW,
    syncOpacity,
    mapScale: reduced ? 1 : L(1.17, 1, mapQ),
    mapX: reduced ? 0 : L(-18, 0, mapQ),
    mapY: reduced ? 0 : L(12, 0, mapQ),
    revealW: reduced ? 408 : 408 * A(r, 5.55, 6.85),
    mwFillOpacity: A(r, 6.0, 6.9),
    markerOpacity: A(r, 6.85, 7.15),
    mcBar: 88 * A(r, 5.7, 6.45),
    umBar: 26 * A(r, 5.78, 6.5),
    dLow: dough.dLow,
    dOpt: dough.dOpt,
    dRisk: dough.dRisk,
    dOver: dough.dOver,
    dLabelOpacity: A(r, 6.45, 6.75),
    safDash: (106.8 * 0.94 * EO(A(r, 5.8, 6.6))).toFixed(1) + " 999",
    safTextOpacity: A(r, 6.4, 6.75),
    timerHrs: pad(Math.floor(total / 3600)),
    timerMin: pad(Math.floor((total % 3600) / 60)),
    timerSec: pad(total % 60),
    alertOpacity: A(r, 6.35, 6.7),
    alertHighlight:
      r < 5.45 ? 0 : P(r, 6.35, 6.6) * (1 - P(r, 6.95, 7.6)),
    titleAOpacity: titleA,
    titleBOpacity: titleB,
  };
}
