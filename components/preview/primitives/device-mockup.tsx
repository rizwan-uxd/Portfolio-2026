"use client";

import { useId, useMemo, type ReactNode } from "react";
import { MOCKUP_ZOOM_MS } from "../constants";
import { usePreview } from "../engine/preview-context";

/**
 * Desktop-monitor mockup + camera dolly, built from `ref images/OBJECTS.svg`
 * (2026-08-01, by request): "start by zoomed out view with animation inside the
 * mockup then zoom in to the UI and then start animating."
 *
 * Shared by both SecureLink scenes — `secure-communication` (21:9) and
 * `secure-communication-grid` (4:3). Neither is special-cased: the screen cutout is
 * *derived* from the timeline's own aspect (`CUTOUT_H × designWidth /
 * designHeight`), and the body is that cutout plus a bezel, so the monitor
 * reshapes itself to whatever canvas it is given. Body and chin are therefore
 * generated rounded rectangles; only the stand is the reference SVG's path
 * verbatim, translated to stay centred.
 *
 * `children` (the scene) always renders at full canvas size and is never resized
 * or re-authored. Two layers sit above it: an
 * untransformed **viewport** carrying the `clip-path`, and inside it a
 * **camera** whose `transform` maps the whole canvas into the screen rect with
 * one uniform scale, then animates to identity over `MOCKUP_ZOOM_MS`. Because
 * the cutout matches the canvas aspect exactly, that single scale is correct in
 * both axes — no distortion, no letterbox, and the *complete* start frame is
 * visible inside the monitor rather than a magnified crop of its middle.
 *
 * Superseded, and worth knowing so it is not reintroduced: this component
 * originally kept the SVG's own ~1.78 screen aspect and animated *only* the
 * `clip-path` from the cutout to the full canvas. That reads as a curtain wipe,
 * not a camera — nothing scales — and it shows a 1:1 crop of the middle of the
 * UI rather than the product's start frame. Reshaping the cutout removed the
 * reason that design existed.
 *
 * **animations.md §10.4 ("transform/opacity only") holds for the motion**: the
 * dolly is a compositor-only `transform` and the monitor's exit is `opacity`.
 * The `clip-path` transition remains as a narrow, documented exception — it is a
 * paint property — but it now only rounds the screen's corners and prevents
 * mid-transition spill, rather than being the effect itself. `will-change` is
 * applied only while `!zoomedIn`, per this codebase's rule of never leaving it
 * on at rest.
 *
 * Reduced motion / settled: a frozen clock lands at or after `zoom`, so
 * `zoomedIn` is true — transform `none`, clip full-canvas, monitor at opacity 0.
 * The settled frame is the plain scene, composed with no play-through.
 */

/**
 * Reference geometry, in `ref images/OBJECTS.svg`'s own units. Everything here
 * is measured off that file's path data and held fixed; only the body *width*
 * is derived, so the screen cutout can take the canvas's aspect exactly.
 */
const REF_BODY_W = 692.782;
const BODY_H = 473.36;
const VIEW_H = 570;
const CORNER_R = 17.1203;
const BEZEL = 15;
const CHIN_TOP = 401.855;
const CUTOUT_TOP = BEZEL;
const CUTOUT_BOTTOM = 386.855;
const CUTOUT_H = CUTOUT_BOTTOM - CUTOUT_TOP;

/**
 * Monitor height as a fraction of the canvas. Raised from 0.8 to 0.88 for
 * legibility (spec 2026-08-01 §3): the framed beat is the whole product frame at
 * `FIT_FRACTION × CUTOUT_H / VIEW_H` ≈ 0.574×, which is below the 14-design-px
 * floor whatever we do, so it is an establishing shot judged on recognisability
 * — and the only honest levers are a bigger frame and a longer hold. 0.90 is the
 * ceiling before the margin between monitor and card edge disappears. Never buy
 * legibility by starting the camera tighter than exact fit: that crops the frame,
 * which is the defect this component was rewritten to fix.
 */
const FIT_FRACTION = 0.88;

/** Guard for hypothetical very wide canvases. It does not bind for either frame
 *  in use: `monitor` lands at 0.594 of canvas width on 21:9, and `bezel`'s body
 *  matches the canvas aspect exactly so it lands at `FIT_FRACTION` in both axes. */
const MAX_WIDTH_FRACTION = 0.9;

const CLIP_RADIUS = 10;
const MONITOR_FADE_MS = 400;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Bezel thickness for the `bezel` frame, per axis.
 *
 * A *uniform* bezel around an A:1 screen gives a body of aspect
 * `(w + 2b) / (h + 2b)`, which is nearer 1:1 than the screen — so the frame
 * would not be 4:3 even though the screen is. Making the horizontal bezel
 * `aspect ×` the vertical one is exactly the condition for body and screen to
 * share an aspect: `(w + 2·a·b) / (h + 2·b) = w / h` when `w = a·h`.
 *
 * The consequence, deliberate: the side bezels are visibly thicker than the top
 * and bottom (20 vs 15 units at 4:3, ~4:3 themselves). That is the price of an
 * exactly-4:3 frame, which was the explicit request. To trade it back for an
 * even bezel at the cost of a ~1.31:1 body, return `{ x: BEZEL, y: BEZEL }`.
 */
function BEZEL_XY(aspect: number): { x: number; y: number } {
  return { x: BEZEL * aspect, y: BEZEL };
}

/**
 * The chin: full-width strip from `CHIN_TOP` to the body's bottom edge, square
 * at the top (it butts against the screen) and rounded at the bottom two corners
 * to match the body. Generated rather than ported, because it is a rectangle
 * whose width is now derived.
 */
function chinPath(bodyW: number): string {
  return [
    `M0 ${CHIN_TOP}`,
    `H${bodyW}`,
    `V${BODY_H - CORNER_R}`,
    `A${CORNER_R} ${CORNER_R} 0 0 1 ${bodyW - CORNER_R} ${BODY_H}`,
    `H${CORNER_R}`,
    `A${CORNER_R} ${CORNER_R} 0 0 1 0 ${BODY_H - CORNER_R}`,
    "Z",
  ].join(" ");
}

/**
 * Which device the mockup draws.
 *
 * `monitor` — the full `OBJECTS.svg` desktop monitor: bezel, chin and stand.
 * Reads correctly on the wide featured card, where the chin is a small fraction
 * of a short, wide body.
 *
 * `bezel` — screen and bezel only, no chin and no stand (2026-08-01, by
 * request: "in small tile the mockup is not good ... need to be 4:3 ratio the
 * mockup frame in small tile"). On the 4:3 grid canvas the monitor's chin is
 * 86 of its 473 units of height, so the body came out at ~1.11:1 — squat, and
 * nothing like the 4:3 screen inside it. Body and cutout cannot *both* take the
 * canvas aspect while a chin exists, since the chin adds height the cutout does
 * not have; dropping it resolves that, and the body then matches the canvas
 * aspect exactly.
 */
export type MockupFrame = "monitor" | "bezel";

export function DeviceMockup({
  zoomedIn,
  frame = "monitor",
  children,
}: {
  zoomedIn: boolean;
  frame?: MockupFrame;
  children: ReactNode;
}) {
  const { timeline } = usePreview();
  const canvasW = timeline.designWidth;
  const canvasH = timeline.designHeight;
  const gradientId = useId();
  const isBezel = frame === "bezel";

  const geometry = useMemo(() => {
    // The cutout takes the canvas's own aspect, so one uniform scale maps the
    // whole canvas into the screen: no distortion, no letterbox, no second
    // authoring size. The body is the cutout plus a bezel on each side; the
    // stand keeps its reference width and is re-centred under it.
    const aspect = canvasW / canvasH;
    const cutoutW = CUTOUT_H * aspect;
    const bezel = isBezel ? BEZEL_XY(aspect) : { x: BEZEL, y: BEZEL };
    const bodyW = cutoutW + bezel.x * 2;
    // The `bezel` frame has no chin and no stand, so its art *is* the body; the
    // `monitor` frame's viewBox runs past the body to the foot of the stand.
    const viewH = isBezel ? CUTOUT_H + bezel.y * 2 : VIEW_H;
    const standDx = (bodyW - REF_BODY_W) / 2;

    let frameH = canvasH * FIT_FRACTION;
    let frameW = frameH * (bodyW / viewH);
    if (frameW > canvasW * MAX_WIDTH_FRACTION) {
      frameW = canvasW * MAX_WIDTH_FRACTION;
      frameH = frameW * (viewH / bodyW);
    }

    const unit = frameH / viewH; // svg unit → canvas px
    const frameLeft = (canvasW - frameW) / 2;
    const frameTop = (canvasH - frameH) / 2;

    const screenLeft = frameLeft + bezel.x * unit;
    const screenTop = frameTop + bezel.y * unit;
    const screenW = cutoutW * unit;
    const screenH = CUTOUT_H * unit;

    return {
      bodyW,
      viewH,
      standDx,
      frameLeft,
      frameTop,
      frameW,
      frameH,
      screenLeft,
      screenTop,
      // screenW / canvasW === screenH / canvasH by construction, so this single
      // factor is the camera's scale in both axes.
      scale: screenW / canvasW,
      topPct: (screenTop / canvasH) * 100,
      rightPct: ((canvasW - (screenLeft + screenW)) / canvasW) * 100,
      bottomPct: ((canvasH - (screenTop + screenH)) / canvasH) * 100,
      leftPct: (screenLeft / canvasW) * 100,
      gradientK: bodyW / REF_BODY_W,
    };
  }, [canvasW, canvasH, isBezel]);

  const restingClip = `inset(${geometry.topPct}% ${geometry.rightPct}% ${geometry.bottomPct}% ${geometry.leftPct}% round ${CLIP_RADIUS}px)`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* VIEWPORT — never transformed. `clip-path` resolves in an element's own
          local coordinate space, *before* its transform is applied, so it cannot
          live on the camera layer: the inset percentages would then be read in
          scaled coordinates and the crop would drift as the camera moves. With
          the cutout now matching the canvas aspect exactly, the content already
          fills the screen edge to edge, so this clip is doing only two things —
          rounding the screen's corners, and guaranteeing nothing can spill past
          the bezel mid-transition. It is no longer the reveal. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          // Above the art — see the `zIndex: 0` note on the <svg> below.
          zIndex: 1,
          clipPath: zoomedIn ? "inset(0% 0% 0% 0%)" : restingClip,
          transition: `clip-path ${MOCKUP_ZOOM_MS}ms ${EASE}`,
          willChange: zoomedIn ? undefined : "clip-path",
        }}
      >
        {/* CAMERA — the dolly. `children` renders at full canvas size always;
            this maps that canvas into the screen rect with one uniform scale
            (origin at the canvas's top-left so `translate` is just the screen's
            own offset), then animates to identity. Compositor-only. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            // Makes the layer opaque, so the screen shows the scene's own initial
            // frame on its own background. The scene's root — the element that
            // paints `--pv-bg` — sits *outside* this component, so without this the
            // monitor's black body would show through the UI's transparent areas
            // now that the art paints behind.
            background: "var(--pv-bg)",
            transformOrigin: "0 0",
            transform: zoomedIn
              ? "none"
              : `translate(${geometry.screenLeft}px, ${geometry.screenTop}px) scale(${geometry.scale})`,
            transition: `transform ${MOCKUP_ZOOM_MS}ms ${EASE}`,
            willChange: zoomedIn ? undefined : "transform",
          }}
        >
          {children}
        </div>
      </div>

      {/* Monitor art. Body and chin are rounded rectangles generated from the
          derived width; the stand is `ref images/OBJECTS.svg`'s path verbatim,
          translated to stay centred under the wider (or narrower) body.

          **Paints below the viewport** (`zIndex: 0` here, `1` there) even though it
          is declared after it — it stays declared here so it sits next to its own
          `<defs>`. The body is an *opaque* rounded `<rect>` spanning the whole
          frame, screen area included, so on top it covered the scene completely:
          on `bezel`, where that rect is the entire art, the `mockup` beat was a
          plain black rectangle (2026-08-01, reported on the grid card). Nothing is
          lost by putting it behind — the content is clipped to the cutout and can
          never spill onto the bezel, chin or stand — and the dolly reads better
          for it: as the clip opens, the growing UI covers the bezel rather than
          sliding underneath it. */}
      <svg
        viewBox={`0 0 ${geometry.bodyW} ${geometry.viewH}`}
        width={geometry.frameW}
        height={geometry.frameH}
        style={{
          position: "absolute",
          left: geometry.frameLeft,
          top: geometry.frameTop,
          zIndex: 0,
          opacity: zoomedIn ? 0 : 1,
          transition: `opacity ${MONITOR_FADE_MS}ms ease`,
          pointerEvents: "none",
        }}
        fill="none"
      >
        {!isBezel && (
          <g transform={`translate(${geometry.standDx} 0)`}>
            <path
              d="M436.802 527.567H434.976L423.923 411.75H286.136L275.082 527.567H273.257L248.087 553.032C242.039 559.157 246.378 569.543 254.978 569.543H455.1C463.7 569.543 468.039 559.157 461.992 553.032L436.822 527.567H436.802Z"
              fill={`url(#${gradientId}-stand)`}
            />
          </g>
        )}
        <rect
          x={0}
          y={0}
          width={geometry.bodyW}
          height={isBezel ? geometry.viewH : BODY_H}
          rx={CORNER_R}
          fill={`url(#${gradientId}-screen)`}
        />
        {!isBezel && (
          <path d={chinPath(geometry.bodyW)} fill={`url(#${gradientId}-chin)`} />
        )}
        <defs>
          {/* Vertical, and referenced from inside the translated <g>, so its
              coordinates need no adjustment. */}
          <linearGradient
            id={`${gradientId}-stand`}
            x1="355.029"
            y1="403.976"
            x2="355.029"
            y2="570.368"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.02" stopColor="#F4F4F4" />
            <stop offset="0.18" stopColor="#B5B5B5" />
            <stop offset="0.29" stopColor="#8E8E8E" />
            <stop offset="0.35" stopColor="#808080" />
            <stop offset="0.37" stopColor="#878787" />
            <stop offset="0.41" stopColor="#9C9C9C" />
            <stop offset="0.45" stopColor="#BFBFBF" />
            <stop offset="0.5" stopColor="#EFEFEF" />
            <stop offset="0.52" stopColor="white" />
            <stop offset="0.61" stopColor="white" />
            <stop offset="0.64" stopColor="#E7E7E7" />
            <stop offset="0.71" stopColor="#A8A8A8" />
            <stop offset="0.77" stopColor="#818181" />
            <stop offset="0.79" stopColor="#737373" />
            <stop offset="0.82" stopColor="#787878" />
            <stop offset="0.86" stopColor="#878787" />
            <stop offset="0.9" stopColor="#A1A1A1" />
            <stop offset="0.94" stopColor="#C5C5C5" />
            <stop offset="0.99" stopColor="#F2F2F2" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          {/* Horizontal — spans the body, so both x coordinates scale with the
              derived width (`gradientK = bodyW / REF_BODY_W`). */}
          <linearGradient
            id={`${gradientId}-screen`}
            x1="0"
            y1="236.68"
            x2={geometry.bodyW}
            y2="236.68"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.03" stopColor="#020202" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-chin`}
            x1={-71.4847 * geometry.gradientK}
            y1="437.627"
            x2={759.339 * geometry.gradientK}
            y2="437.627"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.19" stopColor="#DDDDDD" />
            <stop offset="0.3" stopColor="#CFCFCF" />
            <stop offset="0.47" stopColor="#E5E5E5" />
            <stop offset="0.67" stopColor="white" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
