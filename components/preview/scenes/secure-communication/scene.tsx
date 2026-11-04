"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { usePreview } from "../../engine/preview-context";
import { PosterMockup, type PosterScreen } from "../../primitives/poster-mockup";
import { Cursor } from "../../primitives/cursor";
import type { CursorMove, CursorPoint } from "../../primitives/motion";
import { Bubble, CARDS, DetailPanel, ListCard, MESSAGES, SPRINT_DETAIL, STANDUP_DETAIL, fontStack } from "./shared";
import { secureCommunicationTokens } from "./tokens";


/**
 * SecureLink product simulation — ported 1:1 from `ref images/securelink-preview.html`
 * (a hand-timed `setTimeout`/`classList` demo) onto this engine's clock + primitives.
 * Same UI, same 4 nav items, same 3 meeting cards, same 2 detail panels, same 7 chat
 * bubbles, same sequence and same relative timings (`timeline.ts`) — only the
 * orchestration changed, per the explicit brief: this is a product simulation, not a
 * generic preview to be trimmed for legibility or pacing.
 *
 * Canvas is the locked featured-card size (1120×480, 21:9) rather than the
 * reference's own 1000×600 (5:3) stage — columns keep the reference's proportional
 * widths (scaled ×1.12), and vertical rhythm (padding/gaps/type) is tightened to fit
 * the shorter canvas without dropping or resizing any element's content. Every state
 * flip below is `isAtOrAfter`, never `stepId === …` (animations.md §4), so a reduced
 * motion viewer, a resize, or a re-mount composes the full end state — sidebar,
 * selected card, standup detail, all 7 bubbles — with no play-through.
 *
 * Data + `ListCard`/`DetailPanel`/`Bubble` markup live in `./shared` — reused as-is by
 * `scenes/secure-communication-grid/scene.tsx`, the grid-canvas duplicate of this card
 * (2026-08-01). This file owns only what's genuinely specific to the 21:9 canvas: the
 * sidebar, column widths, and cursor coordinates.
 *
 * Briefly wrapped in `primitives/frame-chrome.tsx`'s `BrowserChrome` (2026-08-01),
 * then unwrapped the same day by request — "remove top browser bezels, this is a
 * desktop app". SecureLink is a desktop application, so a traffic-light bar
 * mis-stated what the product is; it also contradicted this card's own poster, which
 * shows the UI filling the monitor with no browser chrome at all. The UI now fills
 * the canvas directly. Cursor coordinates were unaffected — they are relative to the
 * same box the UI is, so both shifted up together.
 *
 * Also wrapped in `primitives/poster-mockup.tsx`'s `PosterMockup` (2026-08-01, by
 * request): the `mockup`/`zoom` steps prepended in `timeline.ts` hold this project's
 * own poster (`content/projects.ts` → `images.banner`, itself a monitor mockup of
 * this UI) as the intro's first frame, then dolly into the poster's screen before
 * the reference's own sequence starts. It replaced `primitives/device-mockup.tsx`
 * here — a *drawn* monitor is a different monitor to the one the resting card is
 * already showing, so the hover began with a visible cut. The grid scene
 * (`scenes/secure-communication-grid/`) keeps `DeviceMockup`, because its poster is the
 * Etihad site, not this UI — no longer true as of 2026-08-11, see that file's header.
 */

const NAV_ITEMS = ["Home", "Meetings", "Calls", "Chats"] as const;

/**
 * The intro's first frame: this card's own poster, so hovering starts on exactly
 * what the card was already showing. Must stay in sync with `content/projects.ts`
 * → `projects[secure-communication-app].images.banner`, which is what
 * `selected-work.tsx` renders as the resting layer.
 */
const POSTER_SRC = "/images/work/secure-communication-app/banner.png";
const POSTER_ASPECT = 3840 / 2160;

/**
 * Where the monitor's screen sits inside that file, as fractions of the image.
 * Threshold-scanned off the PNG, not eyeballed — the bezel is (1,1,1) and the UI
 * inside it starts at (38,38,38), so the inner edges are exact: left 1166, top
 * 273, right 3150, bottom 1439 of 3840×2160. There is no bottom bezel; the UI
 * runs into the chin. Re-measure if the banner is ever re-exported.
 */
const POSTER_SCREEN: PosterScreen = {
  x: 1166 / 3840,
  y: 273 / 2160,
  w: (3150 - 1166) / 3840,
  h: (1439 - 273) / 2160,
};

// Column widths — the reference's 150/270/280/300 (of a 1000px stage) scaled ×1.12
// onto the locked 1120px featured canvas. Kept as the reference's own proportions,
// not re-balanced.
const SIDEBAR_W = 168;
const MIDDLE_W = 302;
const DETAIL_W = 314;

// Manually authored to match the flex layout below (same technique as
// `scenes/grey-box/scene.tsx`'s `layout` — these are authored coordinates, not
// measured ones, and only exist to give the synthetic cursor a plausible target).
const CURSOR_START: CursorPoint = { x: SIDEBAR_W + MIDDLE_W - 30, y: 30 };
const CURSOR_TARGET: CursorPoint = {
  x: SIDEBAR_W + MIDDLE_W / 2,
  y: 196,
};

export function SecureCommunicationScene() {
  const { isAtOrAfter } = usePreview();
  const { theme } = useTheme();

  const tokens = useMemo(() => secureCommunicationTokens(theme), [theme]);

  const cursorMoves = useMemo<CursorMove[]>(
    () => [{ step: "approach", x: CURSOR_TARGET.x, y: CURSOR_TARGET.y, arrive: 0.85, clickAt: 0.99 }],
    [],
  );

  const standupSelected = isAtOrAfter("select");
  const revealed = isAtOrAfter("reveal");

  const cardSelected: Record<string, boolean> = {
    sprint: !standupSelected,
    standup: standupSelected,
    roadmap: false,
  };

  const settled = "background-color 350ms ease, opacity 300ms ease, transform 300ms ease";

  return (
    <div
      style={{
        ...tokens,
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--pv-bg)",
        color: "var(--pv-text)",
        fontFamily: fontStack,
        overflow: "hidden",
      }}
    >
    <PosterMockup
      zoomedIn={isAtOrAfter("zoom")}
      src={POSTER_SRC}
      imageAspect={POSTER_ASPECT}
      screen={POSTER_SCREEN}
    >
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: SIDEBAR_W,
          flexShrink: 0,
          borderRight: "1px solid var(--pv-border)",
          padding: "14px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 16px 16px 16px",
            color: "var(--pv-text-2)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              background: "var(--pv-accent)",
            }}
          />
          SecureLine
        </div>
        {NAV_ITEMS.map((item) => {
          const active = item === "Home";
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 16px",
                margin: "0 8px 3px 8px",
                borderRadius: 6,
                color: active ? "var(--pv-accent)" : "var(--pv-muted)",
                background: active ? "var(--pv-nav-active-bg)" : "transparent",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: "currentColor",
                  opacity: 0.6,
                }}
              />
              {item}
            </div>
          );
        })}
      </div>

      {/* MIDDLE — meeting list */}
      <div
        style={{
          width: MIDDLE_W,
          flexShrink: 0,
          borderRight: "1px solid var(--pv-border)",
          padding: "16px 14px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--pv-text)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          <span>Meetings (3)</span>
          <span style={{ color: "var(--pv-muted)", fontSize: 11, fontWeight: 600 }}>
            View All
          </span>
        </div>

        {CARDS.map((card, index) => (
          <ListCard
            key={card.id}
            card={card}
            selected={cardSelected[card.id]}
            settled={settled}
            last={index === CARDS.length - 1}
          />
        ))}
      </div>

      {/* DETAIL — crossfading panels */}
      <div
        style={{
          width: DETAIL_W,
          flexShrink: 0,
          borderRight: "1px solid var(--pv-border)",
          padding: "16px 14px",
          position: "relative",
        }}
      >
        <DetailPanel data={SPRINT_DETAIL} visible={!revealed} settled={settled} />
        <DetailPanel data={STANDUP_DETAIL} visible={revealed} settled={settled} />
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "11px 14px",
            background: "var(--pv-surface-2)",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--pv-avatar)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--pv-text)" }}>
              {revealed ? "Daily Standup" : "Sprint Backlog Meeting"}
            </div>
            <div style={{ fontSize: 10, color: "var(--pv-text-2)" }}>
              {revealed ? "5 Users" : "3 Users"}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "10px 14px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pv-muted)",
              fontSize: 11,
              opacity: revealed ? 0 : 1,
              transition: "opacity 300ms ease",
              pointerEvents: "none",
            }}
          >
            No messages yet
          </div>

          <div
            style={{
              alignSelf: "center",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--pv-text-2)",
              background: "var(--pv-surface-2)",
              padding: "3px 10px",
              borderRadius: 999,
              marginBottom: 10,
              opacity: isAtOrAfter("day-chip") ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          >
            Today
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MESSAGES.map((message) => (
              <Bubble
                key={message.step}
                message={message}
                visible={isAtOrAfter(message.step)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 14px",
            background: "var(--pv-surface-2)",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "var(--pv-input-bg)",
              borderRadius: 4,
              padding: "7px 9px",
              color: "var(--pv-muted)",
              fontSize: 11,
            }}
          >
            Type here
          </div>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: "var(--pv-accent)",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      <Cursor start={CURSOR_START} moves={cursorMoves} size={14} />
    </div>
    </PosterMockup>
    </div>
  );
}
