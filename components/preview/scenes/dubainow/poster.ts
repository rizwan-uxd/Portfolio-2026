/**
 * DubaiNow's poster framing, and the screen rect that has to follow it.
 *
 * This scene is the one that paints *only the inside of the poster's centre phone*
 * over a transparent canvas (see `scene.tsx`'s header). That makes the poster's own
 * framing load-bearing geometry, not decoration: move the poster a pixel and the live
 * screen no longer sits inside the phone it is meant to be inside. So the framing and
 * the rect derived from it live here, in one pure module, imported by both the layer
 * that draws the poster (`project-preview.tsx`) and the scene — and reachable from
 * `npm run check:engine`, which pins the numbers below.
 *
 * **Never change `POSTER_SCALE` in one file and not the other.** There is only one
 * copy of it precisely so that cannot happen.
 */

/** The featured card's design canvas (animations.md §7): 1120px at 21:9. */
const CANVAS_W = 1120;
const CANVAS_H = 480;

/** The banner's natural size. Every measurement below is in these pixels. */
const BANNER_W = 2400;
const BANNER_H = 1976;
export const POSTER_ASPECT = BANNER_W / BANNER_H; // 1.21457

/**
 * The centre phone's screen aperture, in banner px — threshold-scanned off
 * `public/images/work/dubainow-mobile-app/banner.png` (bezel is near-black, so the
 * aperture is the gap between the dark runs: x 949→958 and 1435→1447 horizontally,
 * y 463→472 and 1498→1510 vertically). Re-measure if the banner is re-exported.
 */
const APERTURE = { x: 959, y: 473, right: 1435, bottom: 1497 };

/**
 * Poster framing, by request (2026-08-02): the banner is drawn at 0.9 of the card's
 * width so ~10% more of the image reads — the centre phone stops bleeding off the top
 * and bottom edges and its bezel becomes visible. Visible source rows go 473→1502
 * (which is *exactly* the screen aperture, bezels excluded) to 417→1560, which clears
 * the phone body's 463→1510.
 *
 * **This must be a real resize, never `transform: scale()` on the `object-cover`
 * image — that was tried first and is the bug it caused.** A transform scales the
 * already-cropped paint result; it does not re-run the fit. So the poster still showed
 * only the aperture band, drawn smaller, and the scene's screen rect then covered
 * essentially all of it — the phone lost its top and bottom border entirely. Confirmed
 * against a screenshot: the side bezels landed exactly where the clipped model predicts
 * and there was not one black row above or below. The image is instead drawn into a box
 * of its own natural aspect at `POSTER_SCALE` of the card width, overflowing the card
 * vertically and clipped by it — which is what "show more of the image" actually means.
 *
 * A uniform 0.9 cannot also stay full-bleed: the image is 1.2146:1 into a 2.333:1
 * box, so `object-cover` already fits it to the width exactly and any zoom-out opens
 * a 56px gap down each side. `BLEED` closes that visually — the banner's left and
 * right edge columns are a uniform `#cce4ff` across every row that becomes visible
 * (verified pixel-by-pixel over source y 400→1590), so painting the card that colour
 * behind the image is indistinguishable from the image continuing to the edges.
 * **If the banner is re-exported with a non-flat edge, this trick stops working** —
 * re-sample the edges before trusting it.
 */
export const POSTER_SCALE = 0.9;
export const POSTER_BLEED = "#cce4ff";

/**
 * The centre phone's whole body (bezel included), in banner px — the same threshold
 * scan that found the aperture, one step out: dark runs x 942→1454, y 463→1510. Only
 * used by `check:engine`, to pin that the framing actually leaves the border visible.
 */
export const PHONE_BODY = { x: 942, y: 463, right: 1454, bottom: 1510 };

/**
 * Where the poster is actually drawn: `POSTER_SCALE` of the card's width, at the
 * banner's own aspect, centred. Taller than the card, so it overflows top and bottom
 * and the card clips it — no letterboxing there, only the side gaps `POSTER_BLEED`
 * fills. This is the single description of the framing; both the layer that draws the
 * image and the rect below are computed from it, so they cannot disagree.
 */
const DRAWN_W = CANVAS_W * POSTER_SCALE;
const DRAWN_H = DRAWN_W / POSTER_ASPECT;
const OFFSET_X = (CANVAS_W - DRAWN_W) / 2;
const OFFSET_Y = (CANVAS_H - DRAWN_H) / 2;

/** Banner px → canvas px, under the framing above. */
export const toCanvas = (bx: number, by: number) => ({
  x: OFFSET_X + (bx / BANNER_W) * DRAWN_W,
  y: OFFSET_Y + (by / BANNER_H) * DRAWN_H,
});

/**
 * The rect the scene registers onto — the measured aperture mapped through the
 * framing. Derived, never hand-typed, so it follows `POSTER_SCALE` automatically.
 */
export const SCREEN = {
  x: toCanvas(APERTURE.x, APERTURE.y).x,
  y: toCanvas(APERTURE.x, APERTURE.y).y,
  w: ((APERTURE.right - APERTURE.x) / BANNER_W) * DRAWN_W,
  /**
   * Measured too, not derived from the width. The scene used to size itself
   * `844 * w/390` — the reference phone's own aspect — which is 0.5% taller than the
   * aperture and so laid a ~2.6px lip of white over the bottom bezel. At the card's
   * size that is not sub-pixel: the bottom border rendered visibly thinner than the
   * sides (measured off a screenshot, 2026-08-09). The screen is a hole in a photo,
   * so both of its dimensions must come from the hole.
   */
  h: ((APERTURE.bottom - APERTURE.y) / BANNER_H) * DRAWN_H,
};

/** The whole phone body, mapped the same way — `check:engine` asserts it's on-canvas. */
export const PHONE_BODY_RECT = {
  top: toCanvas(PHONE_BODY.x, PHONE_BODY.y).y,
  bottom: toCanvas(PHONE_BODY.right, PHONE_BODY.bottom).y,
};

/**
 * ── The hover collapse ─────────────────────────────────────────────────────
 *
 * On hover the four surrounding phones slide horizontally into the centre phone until
 * each is *completely occluded by it*, resolving the card from a five-phone spread to a
 * single hero phone. They disappear only because the centre phone covers them — nothing
 * fades, nothing scales, nothing leaves the canvas. On mouse leave the banner snaps back
 * to rest instantly, by request; there is no reverse animation.
 *
 * This needs no new assets, and the reason is a measurement: **the five phones partition
 * the banner with zero overlap.** Threshold-scanning the foreground's top edge (the
 * background is a uniform #cce4ff, so "foreground" is unambiguous) gives four clean
 * discontinuities, below. The centre band that falls out — 943→1454 — is the same rect
 * `PHONE_BODY` above found by an independent dark-run scan, which is the cross-check
 * that the seams are right rather than merely plausible.
 *
 * **The banner was edited once for this, and a re-export will undo it.** The phones butt
 * exactly along their top edges — which is where the seams above were scanned — but their
 * *bottom rounded corners* originally overlapped, with the centre phone drawn on top. That
 * put a crescent of phone 2's and phone 4's corners inside the centre phone's bounding box,
 * baked into the pixels. A band is a rectangle, so the centre band owned those crescents and
 * kept them when its neighbours slid away: two stray bezel arcs forking off the hero phone's
 * bottom corners, against flat blue. No `clip-path`, travel or z-order can fix that — the
 * corner is a squircle (a circle fits its arc only at left=946/top=461 while the true flats
 * are 943/456), so a rounded clip either leaves crescent or bites into the phone.
 *
 * The 485 offending pixels were therefore cleared to `POSTER_BLEED` in `banner.png` itself,
 * reconstructing the true silhouette by mirroring the phone's *clean* top half onto the
 * bottom (it is vertically symmetric to within 1–2px: row 456+k matches row 1517−k). The
 * original is kept at `ref images/dubainow-banner-original-2026-08-02.png`.
 * **If the banner is re-exported, the crescents come back and the collapse regresses.**
 * Re-run the clear, or export with the phones butted at the bottom as well as the top.
 *
 * So the poster is drawn five times from the *same* file, each copy clipped to one band
 * and given its own transform. Paint order is the card stack the interaction describes:
 * outermost at the bottom, centre on top. Two properties fall out of that ordering and
 * both are load-bearing:
 *
 *   1. **Blue spill is invisible.** A band is a full-height slice, so it carries flat
 *      background above and below its phone. Wherever that lands on a phone that
 *      matters, a higher-z band paints over it — a lower-z band can never cover a
 *      higher-z one. Wherever it lands on vacated background it is the identical colour
 *      as `POSTER_BLEED`. There is no case where it shows.
 *   2. **Occlusion is real.** The centre band is opaque across the full card height, so
 *      anything under it inside `CENTRE_CLIP` is genuinely hidden, not approximated.
 *      Every travel below is the exact distance that puts a phone inside that range —
 *      note it is the *clip*, not the seam (see `RIM_TRIM`) — and `check:engine`
 *      asserts the containment rather than trusting the arithmetic.
 */

/** Seam positions in banner px, left to right. Five bands, six seams. */
export const BAND_SEAMS = [120, 514, 943, 1454, 1885, 2280] as const;

/** Index of the centre phone — the one the scene registers onto, which never moves. */
const CENTRE = 2;

/**
 * Adjacent clips overlap by this much, always extended *toward* the centre so the
 * overlap falls under the higher-z neighbour. Without it, fractional canvas-px
 * boundaries can leave a hairline of the layer beneath showing at rest.
 */
const SEAM_OVERLAP = 1;

/**
 * ── The rim trim (fixes: "a line down both sides of the phone") ─────────────
 *
 * The seams above are the *partition* — where one phone ends and the next begins. They
 * are not where the centre phone should be *cut*, and using them for both is what put a
 * pale vertical line down each side of the collapsed hero phone.
 *
 * The banner's phones are photographic renders with a metallic rim, and the rim is
 * brightest at its outermost columns. Sampling the centre phone's left edge at a
 * straight-side row (banner y 700, `#cce4ff` background):
 *
 *   940 941 942 | 943 944 945 946 947 948 949 950
 *   dark joint  | 34  214 226 187 133 107  18   0   ← centre phone, outward → inward
 *
 * At rest, columns 944–946 sit against the neighbouring phone's near-white screen, so
 * they read as the join between two devices. Once the neighbour slides away they sit
 * against flat blue instead, and the single dark column (943) that would have outlined
 * them is too thin to survive the ~0.42 downscale to canvas px. What is left is a
 * light grey strip with nothing dark outside it — a line, not an edge. Reproduced
 * exactly by compositing the five bands offline, and it disappears at trim ≥ 3.
 *
 * So the centre band is clipped `RIM_TRIM` px inside the partition on each side, which
 * makes the exposed edge the rim's dark inner ramp (947→950) rather than its bright
 * outer face. The mirror on the right is 1451, exposing 1449/1450 instead of 1453/1454.
 *
 * **It has to be this small, and it has to be a straight inset.** The rim only reaches
 * the seam along the phone's straight sides; around the rounded corners the silhouette
 * has already curved inside 943/1454, so a straight vertical trim eats into the corner
 * arc there. At 3px (1.26 canvas px) that is under half a device pixel of corner and
 * invisible; by 6 it is a visible flat on the squircle. Do not raise it to "be safe".
 *
 * Everything else follows from `CENTRE_CLIP`, never from the seam, so the two cannot
 * drift: the neighbours travel to the *clip* edge (3px deeper than before, so occlusion
 * is preserved exactly), and bands 1 and 3 extend their inner clip to it so the resting
 * render still tiles the box with no gap.
 */
const RIM_TRIM = 3;

/** The centre phone's painted extent in banner px — the trim applied to the partition. */
export const CENTRE_CLIP = {
  left: BAND_SEAMS[CENTRE] + RIM_TRIM,
  right: BAND_SEAMS[CENTRE + 1] - RIM_TRIM,
};

/** The collapse itself. All four phones share one duration by request — no stagger. */
export const COLLAPSE_MS = 380;
export const COLLAPSE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export type PosterBand = {
  /** The phone's own extent in banner px. What has to end up occluded. */
  phone: { left: number; right: number };
  /**
   * The band's painted extent in banner px — what `clipInset` below expresses. Differs
   * from `phone` on every band: extended toward the centre by `SEAM_OVERLAP`, out to
   * the drawn poster box's edges for the two outer bands, and pulled in by `RIM_TRIM`
   * on the centre band (with bands 1 and 3 extended to meet it). Exposed so
   * `check:engine` can assert occlusion against the extent that is actually opaque.
   */
  clip: { left: number; right: number };
  /**
   * The `clip-path` actually painted, as a ready-to-use CSS value — `clip` above, as
   * percentages of the drawn poster box.
   */
  clipInset: string;
  /** Signed travel to full occlusion, in banner px. Zero for the centre phone. */
  travel: number;
  /**
   * The same travel as a percentage of the drawn poster box's width — what the DOM
   * consumes. A percentage rather than px so it is correct at every viewport without
   * the layer knowing the card's rendered size.
   */
  travelPct: number;
  /** Paint order. Outermost 1, centre 3. */
  z: number;
};

/** Two decimals is well under a rendered pixel at any viewport, and keeps the
 *  generated `clip-path` strings stable enough to pin in `check:engine`. */
const round2 = (n: number) => Math.round(n * 100) / 100;

const pct = (bannerPx: number) => (bannerPx / BANNER_W) * 100;

export const BANDS: readonly PosterBand[] = BAND_SEAMS.slice(0, -1).map(
  (left, i, all): PosterBand => {
    const right = BAND_SEAMS[i + 1];
    const isLast = i === all.length - 1;
    /** Bands 1 and 3 — the only two whose clip touches the centre band's. */
    const isInner = Math.abs(i - CENTRE) === 1;

    // Left of centre, the phone slides right until its left edge meets the centre
    // phone's *painted* left edge; right of centre, it slides left until its right edge
    // does. Either way it lands with its outer edge flush against the centre phone's
    // matching edge — the shallowest position that is still fully covered.
    const travel =
      i < CENTRE ? CENTRE_CLIP.left - left : i > CENTRE ? CENTRE_CLIP.right - right : 0;

    const clipLeft =
      i === 0
        ? 0
        : i === CENTRE
          ? CENTRE_CLIP.left
          : i > CENTRE
            ? (isInner ? CENTRE_CLIP.right : left) - SEAM_OVERLAP
            : left;
    const clipRight = isLast
      ? BANNER_W
      : i === CENTRE
        ? CENTRE_CLIP.right
        : i < CENTRE
          ? (isInner ? CENTRE_CLIP.left : right) + SEAM_OVERLAP
          : right;

    return {
      phone: { left, right },
      clip: { left: clipLeft, right: clipRight },
      clipInset: `inset(0 ${round2(pct(BANNER_W - clipRight))}% 0 ${round2(pct(clipLeft))}%)`,
      travel,
      travelPct: pct(travel),
      z: 3 - Math.abs(i - CENTRE),
    };
  },
);
