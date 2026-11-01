"use client";

import { useRef, type CSSProperties } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { usePreview } from "../../engine/preview-context";
import { usePreviewFrame } from "../../engine/use-preview-frame";
import { DUR, SETTLED_R, hajjFrame } from "./frame";
import {
  CANVAS_H,
  CANVAS_W,
  FRAME_H_REF,
  FRAME_UI_SCALE,
  FRAME_W_REF,
  // NB: `GUTTER` is deliberately not imported — the stage box is centred by the flex
  // container, so the gutters are a consequence of the geometry rather than a value
  // anything here sets. Nothing is drawn at that boundary any more, which is the point;
  // `check:engine` is what guarantees the frames still land where they always did.
  RAIL_H_REF,
  RAIL_LEFT_REF,
  RAIL_TOP_REF,
  RAIL_W_REF,
  S,
  SLOT_REF,
  STAGE_REF_H,
  STAGE_REF_W,
} from "./geometry";
import { DataEntryScreen } from "./screens/data-entry";
import { DashboardScreen } from "./screens/dashboard";
import { fontStack, hajjOperationsTokens } from "./tokens";

/**
 * Hajj Operations Platform — card hover scene. A 1:1 port of
 * `ref images/Hajj project project tile on hover animation.html` (unpacked for reading
 * at `ref images/hajj-tile-hover.unpacked.html`) onto this engine's clock, the same way
 * `secure-communication`, `dubainow` and `emirates-islamic` were.
 *
 * Spec: `docs/superpowers/specs/2026-08-14-hajj-card-hover-scene-design.md`.
 *
 * ## What this scene is
 *
 * A rail of two app frames — a project-manager data-entry platform and a live executive
 * dashboard — inside a stage that zooms. Zoom into frame A, approve a project, a sync
 * pulse travels; zoom out, the rail rotates to frame B; the dashboard zooms in and
 * builds itself; zoom out and loop. 9.0s.
 *
 * ## Three properties this file depends on, all easy to break
 *
 * **It is time-driven, not step-driven.** Every other scene here is a projection of
 * `stepIndex` via `isAtOrAfter`. This one is a projection of continuous time, because
 * its reference is: `frame.ts` is one pure function of `t` returning ~46 interpolated
 * values. The timeline's steps exist for the engine's benefit, not the scene's.
 *
 * **Nothing here calls `setState` per frame.** The single `usePreviewFrame` subscriber
 * writes ~46 CSS custom properties and four `textContent` values straight to the DOM
 * (animations.md §4). React renders about seven times per loop, all of them driven by
 * step changes it makes on its own. A `setState` in that callback hands back the entire
 * performance model in one line.
 *
 * **The clip is the card, not the stage** (changed 2026-08-14 — this reverses the
 * original instruction, which is why it is spelled out). The reference clips its rail at
 * its stage's 1040px, and this port did too until the presentation became a single
 * continuous canvas. At that point the clip stopped being invisible: it cuts real
 * content — frame B is guillotined at canvas x 944 through the gallery beats — and a cut
 * against a matching background *is* a visible 16:10 boundary. So the scene root clips
 * and the stage box does not. The full reasoning, the measurements, and what becomes
 * visible as a result are in `geometry.ts`; read that before restoring `overflow: hidden`
 * on the stage.
 *
 * ## Two things this scene deliberately does not have
 *
 * **No mockup intro** — no `PosterMockup`, no `DeviceMockup`. The reference opens by
 * zooming into frame A, and that zoom *is* the intro; a dolly in front of it would be
 * two intros. DubaiNow set this precedent. Do not "restore" one for consistency with
 * the other featured card.
 *
 * **No blurred bleed of the stage into the gutters.** Explicitly declined by the user
 * (2026-08-14): there is no gutter treatment of any kind, blurred or otherwise. The
 * gutters are not a surface — they are the same canvas as the middle.
 *
 * ## The presentation: one continuous canvas (direction set 2026-08-14)
 *
 * The card is one 21:9 neutral canvas, painted once by the root, with product screens
 * moving across it. There is no 16:10 panel: no radius, no border, no shadow, no warm
 * field, no seam, no clip at the stage edge. Every one of those existed at some point in
 * this file's history and every one produced a visible box-inside-a-box; the log of what
 * was tried is in `geometry.ts` so it does not get rediscovered.
 *
 * **Exactly one element paints a background — the root, `var(--pv-canvas)`.** The stage
 * box below is transparent, and that is load-bearing rather than tidy: giving both
 * elements "the same" gradient would still show the edge, because one
 * `linear-gradient(160deg, …)` resolves differently across 1120 × 480 than across
 * 1040 × 650. One paint, no seam, by construction.
 *
 * The animation itself is unchanged — same `S`, same 768 × 480 stage box, same rail
 * coordinates, same `frame(t)`. What changed is only how much of it the card lets you
 * see.
 */
export function HajjOperationsScene() {
  const { getElapsed, reducedMotion } = usePreview();
  const { theme } = useTheme();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnLabelRef = useRef<HTMLSpanElement | null>(null);
  const hrsRef = useRef<HTMLSpanElement | null>(null);
  const minRef = useRef<HTMLSpanElement | null>(null);
  const secRef = useRef<HTMLSpanElement | null>(null);

  usePreviewFrame(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion pins an explicit settled time rather than freezing the clock
    // wherever it happens to be (animations.md §12's Phase-4 correction, spec §11):
    // this scene interpolates within every step, so a frozen clock composes a
    // half-faded ripple and a partly-built dashboard as if they were a resting state.
    const r = reducedMotion
      ? SETTLED_R
      : (getElapsed() / 1000) % DUR;

    const f = hajjFrame(r, reducedMotion);
    const set = (name: string, value: string | number) =>
      root.style.setProperty(name, String(value));

    set("--hj-zoom", f.zoom);
    set("--hj-railX", `${f.railX}px`);
    set("--hj-deScale", f.deScale);
    set("--hj-deBright", f.deBright);
    set("--hj-deBlur", `${f.deBlur}px`);
    set("--hj-deOpacity", f.deOpacity);
    set("--hj-dbScale", f.dbScale);
    set("--hj-dbBright", f.dbBright);
    set("--hj-dbBlur", `${f.dbBlur}px`);
    set("--hj-dbOpacity", f.dbOpacity);
    set("--hj-dbShift", `${f.dbShift}px`);
    set("--hj-titleAOpacity", f.titleAOpacity);
    set("--hj-titleBOpacity", f.titleBOpacity);
    set("--hj-syncX", `${f.syncX}px`);
    set("--hj-syncW", `${f.syncW}px`);
    set("--hj-syncOpacity", f.syncOpacity);
    set("--hj-cursorX", `${f.cursorX}px`);
    set("--hj-cursorY", `${f.cursorY}px`);
    set("--hj-cursorOpacity", f.cursorOpacity);
    set("--hj-clickOpacity", f.clickOpacity);
    set("--hj-clickScale", f.clickScale);
    set("--hj-btnBg", f.btnBg);
    set("--hj-btnShadow", f.btnShadow);
    set("--hj-btnScale", f.btnScale);
    set("--hj-checkOpacity", f.checkOpacity);
    set("--hj-checkW", f.checkW);
    set("--hj-checkGap", f.checkGap);
    set("--hj-flashOpacity", f.flashOpacity);
    set("--hj-flashScale", f.flashScale);
    set("--hj-mapScale", f.mapScale);
    set("--hj-mapX", `${f.mapX}px`);
    set("--hj-mapY", `${f.mapY}px`);
    set("--hj-revealW", `${f.revealW}px`);
    set("--hj-mwFillOpacity", f.mwFillOpacity);
    set("--hj-markerOpacity", f.markerOpacity);
    set("--hj-mcBar", `${f.mcBar}px`);
    set("--hj-umBar", `${f.umBar}px`);
    set("--hj-dLow", f.dLow);
    set("--hj-dOpt", f.dOpt);
    set("--hj-dRisk", f.dRisk);
    set("--hj-dOver", f.dOver);
    set("--hj-dLabelOpacity", f.dLabelOpacity);
    set("--hj-safDash", f.safDash);
    set("--hj-safTextOpacity", f.safTextOpacity);
    set("--hj-alertOpacity", f.alertOpacity);
    set("--hj-alertHighlight", f.alertHighlight);

    // The four values a custom property cannot carry.
    if (btnLabelRef.current) btnLabelRef.current.textContent = f.btnLabel;
    if (hrsRef.current) hrsRef.current.textContent = f.timerHrs;
    if (minRef.current) minRef.current.textContent = f.timerMin;
    if (secRef.current) secRef.current.textContent = f.timerSec;
  });

  return (
    <div
      ref={rootRef}
      style={{
        ...hajjOperationsTokens(theme),
        position: "absolute",
        inset: 0,
        width: CANVAS_W,
        height: CANVAS_H,
        fontFamily: fontStack,
        // The one and only background in this scene, spanning the whole 21:9 card —
        // gutters and 16:10 area alike. See this file's header for why it is painted
        // here and nowhere else.
        background: "var(--pv-canvas)",
        // The clip. It lives here rather than on the stage box so that frames leave at
        // the card's own edge instead of being cut at an invisible line 176px inside it
        // (`geometry.ts`). The card is `overflow-hidden` too, so this is belt and braces
        // — but the scene should not depend on its container to contain it.
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as CSSProperties}
    >
      {/*
        The stage box: the reference's 1040 × 650, placed by one uniform scale. Authored
        at the reference's own numbers inside a box that is scaled, so every radius, blur
        and offset inside keeps the proportion it was designed at and the port can be
        diffed against the source line by line.

        **It paints nothing and clips nothing.** What it still does, and why it cannot be
        flattened away: it is the coordinate space every rail number below is authored in,
        and its centre is the zoom origin — which is also the canvas centre, which is what
        puts the focused frame dead centre at full zoom (canvas ~208–912), and letterboxed
        by `FOCUS_INSET` above and below without any offset of its own.

        No radius, no border, no shadow, no background, no `overflow: hidden`. Each of
        those has been here at some point and each produced a visible 16:10 panel;
        `geometry.ts` records what was tried so it is not rediscovered.
      */}
      <div
        style={{
          position: "relative",
          width: STAGE_REF_W,
          height: STAGE_REF_H,
          flex: "none",
          transform: `scale(${S})`,
        }}
      >
        {/* zoom layer — reference line 77 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 50%",
            transform: "scale(var(--hj-zoom, 1))",
          }}
        >
          {/* rail — reference line 78 */}
          <div
            style={{
              position: "absolute",
              left: RAIL_LEFT_REF,
              top: RAIL_TOP_REF,
              width: RAIL_W_REF,
              height: RAIL_H_REF,
              transform: "translateX(var(--hj-railX, 0px))",
            }}
          >
            {/* FRAME A · DATA ENTRY PLATFORM — reference line 81 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: FRAME_W_REF,
                height: FRAME_H_REF,
                borderRadius: 12,
                overflow: "hidden",
                background: "#E9ECF2",
                boxShadow: "0 26px 60px rgba(16,24,40,0.30)",
                transformOrigin: "50% 50%",
                transform: "scale(var(--hj-deScale, 1))",
                filter: "brightness(var(--hj-deBright, 1)) blur(var(--hj-deBlur, 0px))",
                opacity: "var(--hj-deOpacity, 1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1440,
                  height: 900,
                  transform: `scale(${FRAME_UI_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <DataEntryScreen btnLabelRef={btnLabelRef} />
              </div>

              {/* zoomed-out gallery title for the data-entry frame — reference line 243.
                  Note the asymmetry with frame B's, which is a sibling in the rail
                  rather than a child of its frame; that is the reference's own shape and
                  it is kept so the two can be diffed against it. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(12,16,24,0.46)",
                  pointerEvents: "none",
                  opacity: "var(--hj-titleAOpacity, 1)",
                }}
              >
                <div style={{ fontSize: 31, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.005em" }}>
                  Data entry platform
                </div>
              </div>
            </div>

            {/* FRAME B · CEO DASHBOARD — reference line 250 */}
            <div
              style={{
                position: "absolute",
                left: SLOT_REF,
                top: 0,
                width: FRAME_W_REF,
                height: FRAME_H_REF,
                borderRadius: 12,
                overflow: "hidden",
                background: "#EFF1F6",
                boxShadow: "0 26px 60px rgba(16,24,40,0.30)",
                transformOrigin: "50% 50%",
                transform:
                  "translateX(var(--hj-dbShift, 0px)) scale(var(--hj-dbScale, 1))",
                filter: "brightness(var(--hj-dbBright, 1)) blur(var(--hj-dbBlur, 0px))",
                opacity: "var(--hj-dbOpacity, 1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1440,
                  height: 900,
                  transform: `scale(${FRAME_UI_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <DashboardScreen hrsRef={hrsRef} minRef={minRef} secRef={secRef} />
              </div>
            </div>

            {/* zoomed-out gallery title for the dashboard frame — reference line 559 */}
            <div
              style={{
                position: "absolute",
                left: SLOT_REF,
                top: 0,
                width: FRAME_W_REF,
                height: FRAME_H_REF,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(12,16,24,0.46)",
                pointerEvents: "none",
                transformOrigin: "50% 50%",
                transform:
                  "translateX(var(--hj-dbShift, 0px)) scale(var(--hj-dbScale, 1))",
                opacity: "var(--hj-titleBOpacity, 0)",
              }}
            >
              <div style={{ fontSize: 31, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.005em" }}>
                CEO live dashboard
              </div>
            </div>

            {/* data-sync pulse, drawn between the two platforms — reference line 564.
                Deliberate exception to the transform/opacity/filter-only constraint:
                this animates `width` (via --hj-syncW), which is a paint/layout
                property. Kept because it is the reference's own technique, and it runs
                on a 2px-tall absolutely-positioned bar, so its layout cost cannot escape
                or cascade beyond this one element — being out of flow is what contains
                it, not the clip, which is now on the scene root. Do not rewrite it as a
                transform. */}
            <div
              style={{
                position: "absolute",
                top: 438,
                left: "var(--hj-syncX, 650px)",
                width: "var(--hj-syncW, 160px)",
                height: 2,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg, rgba(232,121,43,0) 0%, #E8792B 45%, rgba(232,121,43,0) 100%)",
                opacity: "var(--hj-syncOpacity, 0)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
