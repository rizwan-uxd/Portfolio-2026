/**
 * Hajj hover scene — the 16:10 → 21:9 fit, and the only place a coordinate is
 * authored. See the spec: `docs/superpowers/specs/2026-08-14-hajj-card-hover-scene-design.md` §2.
 *
 * The reference (`ref images/hajj-tile-hover.unpacked.html`) is built inside a
 * 1040 × 650 stage. The featured card is 21:9. **The approved fit is by height, with
 * the animation preserved completely** — one uniform scale on the whole stage, centred,
 * with warm gutters either side. Nothing inside the stage is re-authored, re-cropped or
 * distorted.
 *
 * Two alternatives were considered and rejected (spec §2); do not re-propose them
 * without reading it:
 *   - fit by width — full-bleed zoom and ~10px type, but 31% of both screens falls
 *     outside the tile, taking the dashboard's top KPI row and bottom alerts feed;
 *   - re-crop each frame to a 21:9 band — a re-layout of both screens rather than a
 *     port, and it changes the animation's framing.
 *
 * `scripts/preview-engine-check.ts` pins every number below. If you change `S`, that
 * check fails — which is the point: the legibility trade-off should surface as a
 * decision, not as drift.
 */

/** The featured card's canvas (animations.md §7). 1120 × 9/21 is exactly 480. */
export const CANVAS_W = 1120;
export const CANVAS_H = 480;

/** The reference's stage, in its own space. */
export const STAGE_REF_W = 1040;
export const STAGE_REF_H = 650;

/** The fit. A height fit, so nothing is cropped. */
export const S = CANVAS_H / STAGE_REF_H;

/**
 * Where the 16:10 stage box lands on the canvas. **These describe a coordinate space,
 * not a visible edge** (see the note below): the frames sit here, but nothing is drawn
 * at `GUTTER` and nothing is clipped there.
 */
export const STAGE_W = STAGE_REF_W * S;
export const STAGE_H = CANVAS_H;
export const GUTTER = (CANVAS_W - STAGE_W) / 2;

/**
 * ## The stage box is coordinate space and zoom origin only (2026-08-14)
 *
 * It does not paint, it does not clip, and it has no radius, border or shadow. Three
 * treatments were tried before this one and each left a visible 16:10 edge:
 *
 *   1. radius + hairline border + drop shadow — a small rounded card inside the card;
 *   2. flush, but a warm gutter field against a cool stage — still a framed panel, just
 *      an unoutlined one;
 *   3. one continuous canvas, but the stage still `overflow: hidden` — and *that* is the
 *      subtle one. The clip cuts real content: at the gallery beats frame B sits at stage
 *      x 922–1662 and was guillotined at canvas x 944, a hard full-height line 176px
 *      inside the card, for ~1.6s of every 9s loop. Both frames are `opacity: 1` at all
 *      times in normal motion (`frame.ts` varies only brightness and blur with rail
 *      distance), so nothing was hiding it. Against a matching background a cut *is* the
 *      boundary — the two cannot be separated.
 *
 * So the clip moved to the card edge: the scene root carries `overflow: hidden` and the
 * frames run off the card's own rounded, bordered edge, which reads as off-screen rather
 * than as an invisible panel. The stage box keeps its 1040 × 650 dimensions because two
 * things still depend on them — every rail coordinate below is authored in that space,
 * and `transform-origin: 50% 50%` on it is what makes the zoom land on the canvas centre.
 *
 * **The consequence is deliberate, not a regression:** the neighbouring frame is now
 * visible in the periphery — a ~177px full-height slab during each zoomed-in beat, and
 * ~263px of frame B (rather than 87px) at the gallery beats — already dimmed to
 * `brightness 0.55` and `blur 2.4px` by the existing distance falloff. That is what "one
 * continuous canvas with product screens moving within it" looks like. Approved
 * 2026-08-14. Do not "fix" it by putting `overflow: hidden` back on the stage.
 *
 * The focused frame is untouched by any of this: at full zoom it is exactly centred,
 * because its centre is the stage centre is the canvas centre. It spans canvas
 * ~208–912 — see `FOCUS_INSET`, which is what sets the zoom.
 */

/**
 * The rail, in the reference's stage space — the scene renders it at these numbers
 * inside a box that is itself scaled by `S`, so its internal proportions are the
 * reference's exactly and the port can be diffed against the source line by line.
 */
export const RAIL_LEFT_REF = 150;
export const RAIL_TOP_REF = 94;
export const RAIL_W_REF = 1512;
export const RAIL_H_REF = 462;

/** One app frame, and the pitch between the two rail slots. */
export const FRAME_W_REF = 740;
export const FRAME_H_REF = 462;
export const SLOT_REF = 772;

/** Each frame renders a 1440 × 900 layout at this scale (the reference's own value). */
export const FRAME_UI_SCALE = 0.51389;

/**
 * The letterbox at every fully focused beat (2026-08-14, second pass). The focused screen
 * keeps this much clear canvas above and below it, so it reads as a screen sitting *in*
 * the card rather than one butted against its top and bottom edges.
 */
export const FOCUS_INSET = 20;

/**
 * The stage's zoom at its zoomed-in beats — **derived from `FOCUS_INSET`, not authored**.
 *
 * The reference's own value is 1.405, which makes one frame fill the stage in both axes
 * (740 × 1.405 = 1040 = the stage width; 462 × 1.405 ≈ 650 = its height). Height-fitted
 * onto this canvas that is a flush 480px-tall screen with no breathing room at the card
 * edge, so the zoom is now set by the inset instead: the frame is `CANVAS_H - 2 ×
 * FOCUS_INSET` = 440px tall, giving ≈1.2897. The frame is vertically centred in the stage
 * already (`RAIL_TOP_REF` 94 + `FRAME_H_REF` 462 spans 94–556 of 650, centre 325 = stage
 * centre), and the stage scales about `50% 50%`, so the 20px lands on both edges by
 * construction rather than by an offset.
 *
 * Horizontal framing is unchanged in kind — still centred — but the frame is now ~705px
 * wide rather than 768, so the peripheral neighbour is correspondingly wider. That is the
 * same approved continuous-canvas treatment, not a new edge.
 */
export const ZOOM = (CANVAS_H - 2 * FOCUS_INSET) / (FRAME_H_REF * S);

/**
 * What a pixel of the reference's 1440 × 900 screen layout measures on this canvas at
 * the zoomed-in beats: 0.4894. So 13px body type lands at 6.36px, and 27px headings at
 * 13.2px. Under the 14-design-px floor, the fourth scene to take that exception, on the
 * same grounds as DubaiNow — a product screenshot read as an object, not as prose. The
 * inset costs ~8% of that scale (it was 6.93px at the reference's 1.405) and the cost was
 * accepted explicitly: do not claw it back by raising `FRAME_UI_SCALE` or re-laying-out
 * the screens.
 */
export const UI_SCALE_AT_ZOOM = FRAME_UI_SCALE * ZOOM * S;
