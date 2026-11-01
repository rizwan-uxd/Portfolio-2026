"use client";

import Image from "next/image";
import { useMemo, type ReactNode } from "react";
import { MOCKUP_ZOOM_MS } from "../constants";
import { usePreview } from "../engine/preview-context";

/**
 * Poster-matched mockup intro + camera dolly (2026-08-01, by request: "on hover
 * the initial start frame mockup should have the initial state as the static
 * image").
 *
 * The problem this solves: the card's *resting* layer is the project's poster
 * (`content/projects.ts` → `images.banner`), and for `secure-communication-app`
 * that poster is already a monitor mockup — the SecureLink UI on a screen, on a
 * pink backdrop. Hovering used to swap that for a *drawn* SVG monitor
 * (`device-mockup.tsx`), which is a different monitor, at a different size, on a
 * different background. The intro therefore began with a visible cut.
 *
 * Here the intro's first frame *is* the poster: the same file, `object-cover` in
 * the same box, so it lands pixel-identical on top of the resting layer and the
 * hover reads as "nothing happened yet". Then the camera pushes into the
 * poster's own screen.
 *
 * Two layers move in exact registration, which is what makes it read as one
 * camera rather than a crossfade:
 *
 * - the **poster** starts at identity (full bleed) and ends scaled up about the
 *   screen rect's centre — the world rushing past the lens;
 * - the **scene** (`children`, always authored at full canvas size) starts
 *   scaled *into* that same screen rect and ends at identity.
 *
 * Their transforms are exact inverses (`scale(s)` about the same point vs
 * `scale(1/s)`), so the live UI sits precisely where the poster's screenshot of
 * it sits, and stays there for the whole move. The scene fades up over the first
 * part of the dolly; the poster stays fully opaque underneath until the very end
 * (it is covered by then) and is dropped instantly, never faded — fading it
 * mid-move would reveal the untransformed resting poster beneath the engine.
 *
 * `s` is a *cover* fit, not a contain fit: the scene fills the screen rect and
 * overflows on the long axis, cropped by the viewport's `clip-path`. That is
 * deliberate and it is what the poster itself shows — the banner's own
 * screenshot is cropped by the monitor's chin. Contain would letterbox against a
 * photo that has no letterbox, which is a visible seam at frame one. This is the
 * one place the "never start tighter than exact fit" rule from the
 * `device-mockup` spec does not apply: the start frame is not judged on
 * legibility here, it is judged on matching the poster exactly.
 *
 * §10.4 ("transform/opacity only"): the dolly is a compositor-only `transform`
 * and the fade is `opacity`. The `clip-path` transition is the same narrow,
 * already-documented exception `device-mockup.tsx` carries — it opens the screen
 * rect out to the full canvas so nothing spills past the bezel mid-move.
 * `will-change` is applied only while `!zoomedIn`.
 *
 * Reduced motion / settled: a frozen clock lands at or after `zoom`, so
 * `zoomedIn` is true — scene at identity and opacity 1, clip full-canvas, poster
 * gone. The settled frame is the plain scene, with no play-through.
 */

/** Corner rounding for the screen cutout. The poster's screen is square-cornered;
 *  this only softens the clip's own edge, so it stays small. */
const CLIP_RADIUS = 8;

/** How much of the dolly the scene takes to fade up. It has to finish well before
 *  the move does — a crossfade still resolving while the camera is landing reads
 *  as a dissolve, and the point of the registration above is that it should not. */
const SCENE_FADE_FRACTION = 0.55;

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * The poster's screen area, as fractions of the *image*, not of the canvas.
 *
 * Measured off the file rather than eyeballed: the bezel is pure black (1,1,1)
 * and the UI inside it starts at (38,38,38), so the inner edges are an exact
 * threshold scan. For `secure-communication-app/banner.png` (3840×2160) that
 * gives left 1166, top 273, right 3150, bottom 1439 — note the screen has no
 * bottom bezel, the UI runs straight into the chin.
 */
export type PosterScreen = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function PosterMockup({
  zoomedIn,
  src,
  imageAspect,
  screen,
  children,
}: {
  zoomedIn: boolean;
  /** Must be the *same* file the card renders as its poster, or frame one cuts. */
  src: string;
  /** Natural width / natural height. Drives the `object-cover` maths below. */
  imageAspect: number;
  screen: PosterScreen;
  children: ReactNode;
}) {
  const { timeline } = usePreview();
  const canvasW = timeline.designWidth;
  const canvasH = timeline.designHeight;

  const geometry = useMemo(() => {
    // Reproduce `object-cover` for this canvas, because the screen rect is
    // measured in image space and the card only ever shows a crop of it. The
    // resting poster is covered into the same box, so the two agree by
    // construction — including when the canvas aspect changes.
    const canvasAspect = canvasW / canvasH;
    const drawnW = imageAspect < canvasAspect ? canvasW : canvasH * imageAspect;
    const drawnH = imageAspect < canvasAspect ? canvasW / imageAspect : canvasH;
    const offsetX = (canvasW - drawnW) / 2;
    const offsetY = (canvasH - drawnH) / 2;

    const left = offsetX + screen.x * drawnW;
    const top = offsetY + screen.y * drawnH;
    const width = screen.w * drawnW;
    const height = screen.h * drawnH;

    // Cover, not contain — see the header. The larger of the two ratios is the
    // one that fills; the other axis overflows and is clipped.
    const scale = Math.max(width / canvasW, height / canvasH);

    // Both transforms are about the element's centre, so the offset is just the
    // screen rect's centre measured from the canvas's centre.
    const dx = left + width / 2 - canvasW / 2;
    const dy = top + height / 2 - canvasH / 2;

    return {
      scale,
      dx,
      dy,
      clip: `inset(${(top / canvasH) * 100}% ${((canvasW - (left + width)) / canvasW) * 100}% ${((canvasH - (top + height)) / canvasH) * 100}% ${(left / canvasW) * 100}% round ${CLIP_RADIUS}px)`,
    };
  }, [canvasW, canvasH, imageAspect, screen]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* POSTER — the start frame. Identity until the camera moves, so it lands
          exactly on top of the card's own resting poster. It scales up about the
          screen rect's centre by `1/scale`: the exact inverse of what the scene
          below does, which is why the two stay registered. Held at full opacity
          for the whole move (by then the scene covers it) and dropped in one
          step at the end — a fade here would uncover the resting poster, which
          is not moving, and the double image is instantly obvious. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          transform: zoomedIn
            ? `scale(${1 / geometry.scale}) translate(${-geometry.dx}px, ${-geometry.dy}px)`
            : "none",
          opacity: zoomedIn ? 0 : 1,
          transition: `transform ${MOCKUP_ZOOM_MS}ms ${EASE}, opacity 0ms linear ${MOCKUP_ZOOM_MS}ms`,
          willChange: zoomedIn ? undefined : "transform",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          // Never the LCP candidate: the card's own poster layer beneath is, and
          // it is the same file, so this resolves from cache with no new request.
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* VIEWPORT — never transformed. `clip-path` resolves in an element's own
          local coordinate space, *before* its transform is applied, so it cannot
          live on the camera layer: the inset percentages would be read in scaled
          coordinates and the crop would drift as the camera moves. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: zoomedIn ? "inset(0% 0% 0% 0%)" : geometry.clip,
          transition: `clip-path ${MOCKUP_ZOOM_MS}ms ${EASE}`,
          willChange: zoomedIn ? undefined : "clip-path",
        }}
      >
        {/* CAMERA — the dolly. `children` renders at full canvas size always;
            this maps that canvas onto the poster's screen rect, then animates to
            identity. `--pv-bg` makes the layer opaque: the element that paints
            the scene's background sits outside this component, so without it the
            poster's own screenshot would show through the live UI while both are
            on screen. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--pv-bg)",
            transformOrigin: "50% 50%",
            transform: zoomedIn
              ? "none"
              : `translate(${geometry.dx}px, ${geometry.dy}px) scale(${geometry.scale})`,
            opacity: zoomedIn ? 1 : 0,
            transition: `transform ${MOCKUP_ZOOM_MS}ms ${EASE}, opacity ${Math.round(MOCKUP_ZOOM_MS * SCENE_FADE_FRACTION)}ms ease-out`,
            willChange: zoomedIn ? undefined : "transform, opacity",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
