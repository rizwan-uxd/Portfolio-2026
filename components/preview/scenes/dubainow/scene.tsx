"use client";

import { useMemo, type ReactNode } from "react";
import { usePreview } from "../../engine/preview-context";
import { Cursor } from "../../primitives/cursor";
import type { CursorMove, CursorPoint } from "../../primitives/motion";
import {
  HomeScreen,
  LocationScreen,
  PoliceScreen,
  SuccessModal,
  screenTransition,
} from "./screens";
import { SCREEN } from "./poster";
import { dubainowTokens, fontStack } from "./tokens";

/**
 * DubaiNow mobile flow — ported 1:1 from `ref images/mobile-flow-preview.html`
 * (a hand-timed `setTimeout`/`classList` demo) onto this engine's clock and
 * primitives, the same way `scenes/secure-communication/` was. Same three screens,
 * same success sheet, same sequence, same relative timings (`timeline.ts`); only the
 * orchestration changed.
 *
 * ## Why this scene has no mockup intro, and paints only a phone screen
 *
 * The other featured card (`secure-communication-app`) opens on its own poster and
 * dollies into it (`primitives/poster-mockup.tsx`). That is impossible here, and the
 * reason is measured, not aesthetic.
 *
 * `PosterMockup` squeezes the scene into a region of the poster and grows it to
 * identity — so a push-in exists only if the *final* phone is larger than the
 * poster's phone. Threshold-scanning `dubainow-mobile-app/banner.png` (2400×1976)
 * puts the centre phone's screen at image px x 959→1435, y 473→1497. Under the
 * `object-cover` the card applies (image aspect 1.215 into a 21:9 box: drawn
 * 1120×922.1, offset y −221.1) that lands on canvas rect **x 447.5, y −0.4,
 * 222.1×480.7** — the poster's phone already fills the full height of the card.
 * Anything larger crops the bottom third, which is exactly where the CTA, the tab
 * bar and the success sheet live.
 *
 * (The poster is since drawn at 0.9 about the canvas centre, so the live rect is
 * that measurement scaled — see `./poster.ts`. It only widens the argument above:
 * the phone is smaller now, and a dolly would still have to end larger than it to
 * be a push-in, re-cropping what the scale-down just recovered.)
 *
 * So the scene does the opposite and gains something better for it: it renders
 * *only the inside of that screen rect*, registered on those measured coordinates,
 * over a transparent canvas. The blue field and the four flanking phones are the
 * card's own poster, still showing through underneath — not a reproduction of it,
 * the actual file. Nothing has to match, because nothing was redrawn. Five phones on
 * the poster's field, and the middle one comes alive. The engine's own 180ms
 * poster↔scene crossfade (`CROSSFADE_MS`) is the entire transition.
 *
 * The poster's centre phone shows the *pre-redesign* home screen (donate cell below
 * the hero, a different grid, a "Search" tab); the reference is the redesigned one.
 * The frame registers exactly, the content deliberately does not — the crossfade
 * reads as the redesign settling into the same device.
 *
 * ## Rules this file is bound by
 *
 * Every state flip is `isAtOrAfter`, never `stepId === …` (animations.md §4), so a
 * reduced-motion viewer, a resize or a re-mount composes the full end state — police
 * and location screens in, glow off, CTA released, success sheet up — with no
 * play-through. Colour comes only from `--pv-*` (`./tokens.ts`), and those tokens
 * are deliberately theme-independent: this scene sits inside a photograph, which is
 * not theme-aware either.
 *
 * Two exceptions to the generic rules, both inherited from the brief and both
 * matching precedents `secure-communication` already set: the 8.6s duration
 * (§5 budget is 3.5–4.5s) and the type sizes, which are the reference's 11–21px
 * phone-space values reduced by `SCALE` to ~5–11 canvas px (~6–12 before the poster
 * was scaled to 0.9) — below the 14px legibility floor from the Phase 0 probe. This
 * is a product screenshot read as an object, not prose meant to be read word by word.
 */

/** The reference's own device canvas. Every offset in `./screens.tsx` is in it. */
const PHONE_W = 390;
const PHONE_H = 844;

// The screen rect lives in `./poster.ts` — it is derived from the poster's framing
// (a 0.9 scale about the canvas centre), and the two must move together or the live
// screen stops sitting inside the poster's phone. Change it there, not here.

/**
 * One uniform scale, taken from the width. The poster phone's screen aspect (0.4644)
 * and the reference's (0.4621) differ by 0.5%, so the UI is *never* fitted to the
 * height — a non-uniform scale would stretch it to close a gap of 2.6px.
 *
 * The clip, though, is the measured aperture (`SCREEN.h`), not `PHONE_H * SCALE`.
 * Sizing the box off the reference's aspect let the extra 2.6px paint white over the
 * bottom bezel, which made the border read thinner along the bottom than the sides.
 * The last 0.6% of the reference's 844px canvas is empty padding below the CTA, so
 * clipping it costs nothing visible.
 */
const SCALE = SCREEN.w / PHONE_W;
const SCREEN_H = SCREEN.h;

/**
 * The phone's 44px corner, in canvas px, plus 4 canvas px by request (2026-08-09):
 * the derived value (~22.5px) reads visibly tighter than the poster phone's own bezel
 * corner around it, so the live screen looked squarer than the frame holding it.
 */
const RADIUS = 44 * SCALE + 4;

// Cursor targets, in phone space — the reference's own coordinates, unaltered.
const CURSOR_START: CursorPoint = { x: 150, y: 760 };
const TILE_POLICE: CursorPoint = { x: 239, y: 555 };
const TILE_REPORT: CursorPoint = { x: 337, y: 254 };
const CTA_REPORT: CursorPoint = { x: 195, y: 633 };

/**
 * One screen layer. Off-screen right until its step arrives, then parked at rest —
 * the reference never animates a screen *out*, it stacks the next one on top, so
 * `current` is monotonic and `isAtOrAfter` maps onto it exactly.
 */
function Screen({
  current,
  motion,
  z,
  children,
}: {
  current: boolean;
  motion: boolean;
  z: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--pv-bg)",
        transform: current ? "translateX(0)" : "translateX(100%)",
        opacity: current ? 1 : 0,
        zIndex: current ? z : 0,
        transition: screenTransition(motion),
      }}
    >
      {children}
    </div>
  );
}

export function DubainowScene() {
  const { isAtOrAfter, reducedMotion } = usePreview();
  const motion = !reducedMotion;

  const cursorMoves = useMemo<CursorMove[]>(
    () => [
      // Each leg is one step of travel ending in a click, matching the reference's
      // 500ms move → ping. `arrive` short of 1 leaves a dwell before the press, so
      // the gesture reads as deliberate rather than as a machine hitting a point.
      { step: "approach-police", ...TILE_POLICE, arrive: 0.86, clickAt: 0.98 },
      { step: "approach-report", ...TILE_REPORT, arrive: 0.86, clickAt: 0.98 },
      { step: "approach-cta", ...CTA_REPORT, arrive: 0.86, clickAt: 0.98 },
    ],
    [],
  );

  const onPolice = isAtOrAfter("to-police");
  const onLocation = isAtOrAfter("report-tap");
  const glow = isAtOrAfter("report-tap") && !isAtOrAfter("location-rest");
  const pressed = isAtOrAfter("press-cta") && !isAtOrAfter("cta-release");
  const succeeded = isAtOrAfter("success");

  // The reference hides the pointer between beats because its CSS-transition cursor
  // would otherwise be seen teleporting to the next target. `Cursor` travels
  // ballistically, so it stays visible for the whole journey and only fades at the
  // ends — fewer discontinuities, not more.
  const cursorVisible = isAtOrAfter("approach-police") && !succeeded;

  return (
    <div
      style={{
        ...dubainowTokens,
        position: "relative",
        width: "100%",
        height: "100%",
        // Transparent on purpose: the card's poster layer beneath supplies the blue
        // field and the four flanking phones. See the header.
        fontFamily: fontStack,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: SCREEN.x,
          top: SCREEN.y,
          width: SCREEN.w,
          height: SCREEN_H,
          borderRadius: RADIUS,
          overflow: "hidden",
          background: "var(--pv-bg)",
          color: "var(--pv-text)",
        }}
      >
        {/* Phone space. One transform maps the reference's 390×844 canvas onto the
            measured screen rect, so every offset in `./screens.tsx` — and every
            cursor coordinate above — is the reference's own number. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PHONE_W,
            height: PHONE_H,
            transformOrigin: "top left",
            transform: `scale(${SCALE})`,
          }}
        >
          <Screen current motion={motion} z={1}>
            <HomeScreen />
          </Screen>
          <Screen current={onPolice} motion={motion} z={2}>
            <PoliceScreen glow={glow} motion={motion} />
          </Screen>
          <Screen current={onLocation} motion={motion} z={3}>
            <LocationScreen pressed={pressed} motion={motion} />
          </Screen>

          <SuccessModal shown={succeeded} motion={motion} />

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 99,
              opacity: cursorVisible ? 1 : 0,
              transition: motion ? "opacity 250ms ease" : "none",
            }}
          >
            {/* 26px to match the reference's pointer, in phone space — the default
                22 is sized for a full-canvas scene, and this one is scaled to 0.57. */}
            <Cursor start={CURSOR_START} moves={cursorMoves} size={26} />
          </div>
        </div>
      </div>
    </div>
  );
}
