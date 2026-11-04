/**
 * Emirates Islamic hover reveal — the geometry that registers the reference's overlay
 * composition onto *this card's* poster.
 *
 * ## Why this file exists at all
 *
 * The approved reference (`assets/Project3_artifacts/Emirates Islamic project hover.html`)
 * floats six UI panels over a 2400×1976 render of the Emirates Islamic site. The card's
 * poster is the *same artwork* exported differently: 5120×2880, a wider and looser crop
 * (`public/images/work/emirates-islamic-digital-ux/banner.png`). The reference's own
 * percentages are therefore meaningless here — dropped in unchanged they land the panels
 * on the wrong part of the artwork. Like `scenes/dubainow/poster.ts`, this scene composes
 * over the poster's actual pixels, so its coordinates are *geometry, not decoration*.
 *
 * Everything below derives from four measured numbers and nothing is hand-typed into a
 * component. `scripts/preview-engine-check.ts` pins the results.
 *
 * ## The measurement
 *
 * `REF_TO_BANNER` maps reference-image px to card-banner px. It was recovered by direct
 * image alignment, not by eye: downsample both, then search scale/offset minimising mean
 * squared error over the overlap. Coarse search reached MSE 241.9, refinement 24.2 at
 * s=1.666, t=(558,-34). An independent landmark (the bounding box of the browser
 * window's white chrome in both files) gives s=1.66795/1.66747, t=(558.47,-34.55) —
 * agreeing to within 0.1% on both axes and confirming the mapping is a pure similarity
 * transform, i.e. the two exports really are the same artwork at different crops.
 *
 * **Re-measure if either image is re-exported.** Nothing here degrades gracefully: a
 * wrong scale puts the panels over the wrong part of the page and it will look like a
 * styling bug rather than a geometry one.
 *
 * ## The authoring space
 *
 * The scene is authored in the reference's own layout box (`REF_BOX_W` wide, the
 * `max-width:1240px` its markup uses) and placed with ONE uniform transform. That is
 * deliberate: every fixed px value in the reference — blur radii, translate offsets,
 * corner radii, font sizes, and its `cqw` container units — then scales together and
 * stays in the proportion it was designed at. Converting them piecemeal into canvas px
 * would be forty chances to introduce a rounding error and no way to diff against the
 * source.
 */

/** The reference's background render. Its overlay percentages are relative to this. */
export const REF_IMG_W = 2400;
export const REF_IMG_H = 1976;

/** The card's poster file. */
export const BANNER_W = 5120;
export const BANNER_H = 2880;

/**
 * Reference-image px → banner px. See the measurement note above; MSE 24.2 at
 * 4× downsample, cross-checked against the browser-chrome bounding box to 0.1%.
 */
export const REF_TO_BANNER = { scale: 1.666, x: 558, y: -34 } as const;

/**
 * The reference's own layout box — `max-width:1240px` at `aspect-ratio:2400/1976`.
 * This is the coordinate space every overlay in `overlays.tsx` is written in.
 */
export const REF_BOX_W = 1240;
export const REF_BOX_H = (REF_BOX_W * REF_IMG_H) / REF_IMG_W;

/** The grid canvas (animations.md §7): 4:3 at the 560px Phase 0 design width. */
export const CANVAS_W = 560;
export const CANVAS_H = 420;

/**
 * The card paints the banner with `object-cover`. Banner aspect 1.778 into a 1.333 box
 * fits by *height* and crops the sides, so `k` is the height ratio and only x is offset.
 * Derived, never assumed — this is the step that decides which part of the artwork the
 * card is actually showing (banner px 640→4480 of 5120).
 */
export const COVER_SCALE = CANVAS_H / BANNER_H;
export const COVER_OFFSET_X = (CANVAS_W - BANNER_W * COVER_SCALE) / 2;

/**
 * The composite: reference-box px → canvas px, as one uniform scale plus a translate.
 * Composed from the three stages above rather than stated, so re-measuring any one of
 * them updates this automatically.
 *
 *   ref-box → ref-image → banner → canvas
 */
export const SCALE =
  (REF_IMG_W / REF_BOX_W) * REF_TO_BANNER.scale * COVER_SCALE;
export const OFFSET_X = REF_TO_BANNER.x * COVER_SCALE + COVER_OFFSET_X;
export const OFFSET_Y = REF_TO_BANNER.y * COVER_SCALE;

/** Reference-box point → canvas point. The only conversion any caller should use. */
export function refToCanvas(x: number, y: number) {
  return { x: x * SCALE + OFFSET_X, y: y * SCALE + OFFSET_Y };
}

/**
 * The phone cascade's lift, in reference-box px.
 *
 * The reference's three phone screens cascade down-right into empty margin below the
 * artwork's own phone mockup. That margin does not survive the card's 4:3 crop: mapped
 * faithfully, phone B overshoots the bottom edge by 7 canvas px and phone C by 23.
 * Confirmed by rendering the mapped rects onto the real crop, not by inspection.
 *
 * Raising the group as a unit was the user's choice (2026-08-09) over shrinking it,
 * reframing the poster, or dropping the beat. The stagger, the sizes and the diagonal
 * are the reference's untouched; only the group's origin moves, so the cascade now
 * overlaps the artwork's phone rather than sitting below it.
 *
 * 55.3 ref px is 26.0 canvas px, which lands phone C's bottom edge at 417.5 of 420.
 * `check:engine` asserts all three stay inside the canvas — that margin is the whole
 * point of the constant, so do not raise it without re-running that.
 */
export const PHONE_LIFT_REF = 55.3;

/**
 * Caption chips are scaled up relative to everything else, and this is the one
 * deliberate infidelity in the port.
 *
 * The reference is designed to be read at 1240px wide; the card shows the same
 * composition at `SCALE` ≈ 0.47 of that. Product micro-UI surviving that reduction as
 * texture is fine and is the precedent both shipped scenes already set (SecureLink
 * 8–15px, DubaiNow 5–11px — animations.md, "read as a product screenshot, not prose").
 * The caption chips are the exception: they are annotation *meant to be read*, and the
 * reference's 11px would land at 5.2 canvas px, below anything legible.
 *
 * **1.65 is a ceiling, not a taste call.** The three panels stack with a uniform
 * 20.17 canvas px gap between them (derived below as `PANEL_GAP_CANVAS`), and each
 * chip hangs above its own panel. Boost the chip past that gap and it collides with
 * the panel above — white chip on white card, which reads as one merged blob rather
 * than as two layers. At 1.65 the chip box is 18.0 canvas px and clears by 0.76px;
 * the first draft used 1.9, measured 20.7px, and overlapped by 6.6.
 * `check:engine` pins the clearance.
 *
 * Set this to 1 for a pixel-exact port of the reference and illegible labels.
 */
export const CAPTION_BOOST = 1.65;

/**
 * The chip's own box, derived rather than taking the reference's fixed `top:-30px`.
 * The reference can hardcode that offset because its panels sit 42.9 ref px apart;
 * ours sit 20.17 canvas px apart, so the offset has to follow the chip's real height
 * or the clearance above is luck. `lineHeight` is stated explicitly for the same
 * reason — an inherited default would make the height unpredictable.
 */
export const CAPTION_FONT_REF = 11 * CAPTION_BOOST;
export const CAPTION_PAD_Y_REF = 5 * CAPTION_BOOST;
export const CAPTION_PAD_X_REF = 10 * CAPTION_BOOST;
export const CAPTION_RADIUS_REF = 7 * CAPTION_BOOST;
export const CAPTION_LINE_HEIGHT = 1.2;
export const CAPTION_H_REF =
  CAPTION_FONT_REF * CAPTION_LINE_HEIGHT + 2 * CAPTION_PAD_Y_REF;
/** Breathing room between the chip's bottom edge and its panel's top edge. */
export const CAPTION_GAP_REF = 3;
/** What the reference expresses as `top:-30px`, sized to this canvas. */
export const CAPTION_TOP_REF = -(CAPTION_H_REF + CAPTION_GAP_REF);

/**
 * The six overlays, in reference percentages exactly as the reference declares them.
 * `phone` marks the three that take `PHONE_LIFT_REF`.
 *
 * Order here is the reference's element order (o1..o6), NOT reveal order — the reveal
 * interleaves panels and phones and is owned by `timeline.ts`.
 *
 * **Captions are right-anchored, and that is a fix rather than a preference.** The
 * reference hangs each chip off its panel's top-LEFT corner, extending right into open
 * canvas. All three captioned panels sit against this card's right edge (x 398–415 of
 * 560), so left-anchored at `CAPTION_BOOST` the longest label runs 36 canvas px past
 * the edge and `contain: strict` on the engine root clips it. Measured, not guessed:
 * "CARDLESS ATM WITHDRAWAL" is ~181 canvas px at 9.83px with .09em tracking, ending at
 * 596. Right-anchored the three start at 375.0, 405.8 and 406.3, all comfortably on
 * canvas. The intent is preserved — the chip still hangs off the panel's top edge and
 * extends into the open part of the frame; on this crop that direction is left.
 */
export const OVERLAYS = [
  { id: "accounts", caption: "Account selection", left: 70.97, top: 27, width: 24.19, height: 9.3, phone: false },
  { id: "atm", caption: "Cardless ATM withdrawal", left: 73.23, top: 40.5, width: 24.19, height: 9.3, phone: false },
  { id: "voucher", caption: "Voucher transfer", left: 70.32, top: 54, width: 24.19, height: 9.3, phone: false },
  { id: "phone-atm", caption: null, left: 5, top: 70.5, width: 8, height: 15.9, phone: true },
  { id: "phone-amount", caption: null, left: 14.5, top: 74, width: 8, height: 15.9, phone: true },
  { id: "phone-voucher", caption: null, left: 24, top: 77.5, width: 8, height: 15.9, phone: true },
] as const;

export type OverlayId = (typeof OVERLAYS)[number]["id"];

/** An overlay's box in reference-box px, lift already applied. */
export function overlayBoxRef(overlay: (typeof OVERLAYS)[number]) {
  return {
    x: (overlay.left / 100) * REF_BOX_W,
    y: (overlay.top / 100) * REF_BOX_H - (overlay.phone ? PHONE_LIFT_REF : 0),
    width: (overlay.width / 100) * REF_BOX_W,
    height: (overlay.height / 100) * REF_BOX_H,
  };
}

/**
 * The vertical gap between the stacked right-hand panels, in canvas px. This is the
 * budget every caption chip has to fit inside; `CAPTION_BOOST` is capped by it.
 */
export const PANEL_GAP_CANVAS =
  ((OVERLAYS[1].top - (OVERLAYS[0].top + OVERLAYS[0].height)) / 100) *
  REF_BOX_H *
  SCALE;

/** An overlay's box in canvas px. Used by `check:engine` to pin the fit. */
export function overlayBoxCanvas(overlay: (typeof OVERLAYS)[number]) {
  const b = overlayBoxRef(overlay);
  const tl = refToCanvas(b.x, b.y);
  return {
    x: tl.x,
    y: tl.y,
    width: b.width * SCALE,
    height: b.height * SCALE,
  };
}

/**
 * The "same capabilities on mobile" chip, which belongs to the phone group and takes
 * the same lift. Reference: left 34%, top 88%.
 */
export const MOBILE_CAPTION_REF = {
  x: (34 / 100) * REF_BOX_W,
  y: (88 / 100) * REF_BOX_H - PHONE_LIFT_REF,
};

/**
 * Per-element entrance offsets, blur and exit delays — the reference's own arrays,
 * in its own px and seconds. Indexed by `OVERLAYS` order.
 *
 * Exit delays are near-zero and near-reversed (voucher and phone-C leave first). They
 * survive the port because the whole group leaves on one step, so the cascade has to
 * come from the delays rather than from sequencing.
 */
export const FROM_X = [-14, -14, -14, -10, -10, -10] as const;
export const FROM_Y = [16, 16, 16, 14, 14, 14] as const;
export const OUT_DELAY_S = [0.24, 0.16, 0.08, 0.18, 0.1, 0.02] as const;
export const REST_BLUR_PX = 9;
export const REST_SCALE = 0.965;
/** The `settled` beat nudges every element up by this much. Reference: -2px. */
export const SETTLE_RISE_PX = -2;
