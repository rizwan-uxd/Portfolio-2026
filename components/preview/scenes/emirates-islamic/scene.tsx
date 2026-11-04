"use client";

import type { CSSProperties } from "react";
import { usePreview } from "../../engine/preview-context";
import {
  CAPTION_FONT_REF,
  CAPTION_LINE_HEIGHT,
  CAPTION_PAD_X_REF,
  CAPTION_RADIUS_REF,
  CAPTION_PAD_Y_REF,
  CAPTION_TOP_REF,
  FROM_X,
  FROM_Y,
  MOBILE_CAPTION_REF,
  OFFSET_X,
  OFFSET_Y,
  OUT_DELAY_S,
  OVERLAYS,
  REF_BOX_H,
  REF_BOX_W,
  REST_BLUR_PX,
  REST_SCALE,
  SCALE,
  SETTLE_RISE_PX,
  overlayBoxRef,
} from "./geometry";
import { OVERLAY_BODIES } from "./overlays";
import { emiratesIslamicTokens, fontStack } from "./tokens";

/**
 * Emirates Islamic hover reveal — ported 1:1 from
 * `assets/Project3_artifacts/Emirates Islamic project hover.html` onto this engine's
 * clock, the same way `secure-communication` and `dubainow` were.
 *
 * ## What this scene is
 *
 * Six miniature UI panels fade and drift up over the card's own banner, in an
 * interleaved cascade (panel, phone, panel, phone, panel, phone), settle, then leave on
 * a fast reverse cascade and loop. It annotates the artwork rather than replacing it.
 *
 * ## Two properties this scene depends on, both easy to break
 *
 * **The canvas is transparent.** Like DubaiNow, this scene composes *over* the poster:
 * the website render, the phone mockup and the lavender field are the card's own
 * `banner.png` still showing through underneath, not a reproduction. `tokens.ts` keeps
 * `--pv-bg: transparent` for exactly this reason. Give the scene a background and the
 * thing it is annotating disappears.
 *
 * **Registration is derived, never typed.** The reference's percentages are relative to
 * a *different export of the same artwork* (2400×1976 vs the card's 5120×2880), so they
 * are meaningless here until mapped. `geometry.ts` owns that mapping, measured by image
 * alignment and pinned by `check:engine`. Read its header before touching a coordinate.
 *
 * ## Rules this file is bound by
 *
 * Every visibility flag is `isAtOrAfter`, never `stepId === …` (animations.md §4), so
 * the engine can be dropped at any step and compose a correct frame with no play-
 * through — which is what makes reduced motion (§12) and the loop seam work for free.
 *
 * `outro` is the one non-monotonic beat, and it is still a pure projection of
 * `stepIndex`: `visible = isAtOrAfter(own step) && !isAtOrAfter("outro")`. Seek-to-any-
 * step therefore still equals play-through. Monotonic accumulation is the common shape
 * of a scene, not a constraint of the engine; purity is the constraint.
 *
 * Only `opacity`, `transform` and `filter` animate (§10.4). `filter: blur()` is the one
 * paint property, and it is the reference's own — it is what makes the panels read as
 * resolving into focus rather than merely sliding. Same narrow exception the mockup
 * primitives already take for `clip-path`.
 */
export function EmiratesIslamicScene() {
  const { isAtOrAfter, reducedMotion } = usePreview();

  const leaving = isAtOrAfter("outro");
  const settled = isAtOrAfter("settle") && !leaving;

  return (
    <div
      style={{
        ...emiratesIslamicTokens,
        position: "absolute",
        inset: 0,
        fontFamily: fontStack,
        // The banner is the background. See the header.
        background: "transparent",
      }}
    >
      {/*
        The reference's own layout box, placed with ONE uniform transform (geometry.ts).
        Everything inside is authored in the reference's coordinates, so its px radii,
        blur radii, translate offsets and `cqw` units all keep the proportions they were
        designed at.

        `containerType: "size"` is what makes `cqw` resolve against this box rather than
        the viewport — the reference sets it on its own card for the same reason, so the
        panels' internal type scales with the composition instead of being frozen.
      */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: REF_BOX_W,
          height: REF_BOX_H,
          containerType: "size",
          transformOrigin: "top left",
          transform: `translate(${OFFSET_X}px, ${OFFSET_Y}px) scale(${SCALE})`,
        }}
      >
        {OVERLAYS.map((overlay, i) => {
          const Body = OVERLAY_BODIES[i];
          const box = overlayBoxRef(overlay);
          const on = isAtOrAfter(overlay.id) && !leaving;

          // The reference's `t{n}` / `o{n}` / `b{n}` values, one for one.
          const transform = on
            ? `translate3d(0px, ${settled ? SETTLE_RISE_PX : 0}px, 0) scale(1)`
            : `translate3d(${FROM_X[i]}px, ${FROM_Y[i]}px, 0) scale(${REST_SCALE})`;

          // Entrance delay is 0: the step boundary *is* the reference's `inD` (see
          // timeline.ts). The exit keeps its own near-zero delay, which is what makes
          // the group leave in a fast near-reverse cascade off a single step.
          const delay = on ? 0 : OUT_DELAY_S[i];
          const transition = reducedMotion
            ? "none"
            : [
                `opacity 850ms cubic-bezier(.16,1,.3,1) ${delay}s`,
                `transform 1250ms cubic-bezier(.16,1,.3,1) ${delay}s`,
                `filter 850ms cubic-bezier(.16,1,.3,1) ${delay}s`,
              ].join(", ");

          const shared: CSSProperties = {
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
            opacity: on ? 1 : 0,
            transform,
            transition,
            pointerEvents: "none",
          };

          return (
            <div key={overlay.id} style={{ display: "contents" }}>
              {/* The panel itself. Carries the blur; the reference blurs the surface
                  but never the caption, so the label stays crisp as it arrives. */}
              <div
                style={{
                  ...shared,
                  borderRadius: overlay.phone ? 10 : 12,
                  background: "var(--pv-surface)",
                  overflow: "hidden",
                  boxShadow: overlay.phone
                    ? "0 20px 44px -18px rgba(58,20,72,.45), 0 2px 4px rgba(58,20,72,.10)"
                    : "0 26px 60px -20px rgba(58,20,72,.45), 0 2px 5px rgba(58,20,72,.10)",
                  outline: "1px solid rgba(255,255,255,.75)",
                  filter: `blur(${on ? 0 : REST_BLUR_PX}px)`,
                }}
              >
                <Body />
              </div>

              {/* The caption chip rides the same opacity/transform but no blur, in its
                  own layer above the panel — the reference's second element per row.

                  Anchored by its RIGHT edge, not its left. Every captioned panel sits
                  against the canvas's right edge, so the reference's left anchor sends
                  the longest label 36 canvas px off-frame where `contain: strict`
                  clips it. See the OVERLAYS block in geometry.ts for the measurement. */}
              {overlay.caption && (
                <div style={{ ...shared, height: box.height, overflow: "visible" }}>
                  <Chip style={{ position: "absolute", right: 0, top: CAPTION_TOP_REF }}>
                    {overlay.caption}
                  </Chip>
                </div>
              )}
            </div>
          );
        })}

        {/* The mobile caption belongs to the phone group: it takes phone A's step, its
            offsets and its exit delay, so it arrives and leaves with the cascade. */}
        <MobileCaption
          on={isAtOrAfter("phone-atm") && !leaving}
          settled={settled}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}

/**
 * The annotation chip. Scaled by `CAPTION_BOOST` relative to everything else — the one
 * deliberate infidelity in the port, argued in `geometry.ts`. At the reference's own
 * 11px these labels land at 5.2 canvas px, which is below legible; the panels' internal
 * micro-type is *meant* to read as texture, but these are prose.
 *
 * `lineHeight` is explicit because `CAPTION_TOP_REF` is computed from the chip's height
 * — an inherited line-height would make that offset wrong by an unpredictable amount
 * and quietly reintroduce the overlap with the panel above.
 */
function Chip({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        padding: `${CAPTION_PAD_Y_REF}px ${CAPTION_PAD_X_REF}px`,
        borderRadius: CAPTION_RADIUS_REF,
        background: "var(--pv-chip-bg)",
        boxShadow: "0 8px 20px -10px rgba(58,20,72,.45)",
        fontSize: CAPTION_FONT_REF,
        lineHeight: CAPTION_LINE_HEIGHT,
        fontWeight: 600,
        letterSpacing: ".09em",
        textTransform: "uppercase",
        color: "var(--pv-accent)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MobileCaption({
  on,
  settled,
  reducedMotion,
}: {
  on: boolean;
  settled: boolean;
  reducedMotion: boolean;
}) {
  const delay = on ? 0 : OUT_DELAY_S[3];
  return (
    <Chip
      style={{
        position: "absolute",
        left: MOBILE_CAPTION_REF.x,
        top: MOBILE_CAPTION_REF.y,
        opacity: on ? 1 : 0,
        transform: on
          ? `translate3d(0px, ${settled ? SETTLE_RISE_PX : 0}px, 0) scale(1)`
          : `translate3d(${FROM_X[3]}px, ${FROM_Y[3]}px, 0) scale(${REST_SCALE})`,
        transition: reducedMotion
          ? "none"
          : `opacity 850ms cubic-bezier(.16,1,.3,1) ${delay}s, transform 1250ms cubic-bezier(.16,1,.3,1) ${delay}s`,
        pointerEvents: "none",
      }}
    >
      Same capabilities on mobile
    </Chip>
  );
}
