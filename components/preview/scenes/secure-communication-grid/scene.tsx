"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { usePreview } from "../../engine/preview-context";
import { DeviceMockup } from "../../primitives/device-mockup";
import { Cursor } from "../../primitives/cursor";
import type { CursorMove, CursorPoint } from "../../primitives/motion";
import {
  Bubble,
  CARDS,
  DetailPanel,
  ListCard,
  MESSAGES,
  SPRINT_DETAIL,
  STANDUP_DETAIL,
  fontStack,
} from "../secure-communication/shared";
import { secureCommunicationTokens } from "../secure-communication/tokens";

/**
 * SecureLink on the 4:3 grid canvas.
 *
 * Built 2026-08-01 as a duplicate onto Etihad Engineering's grid slot; when that
 * project was deleted (2026-08-11) this became SecureLink's own grid scene and the
 * folder was renamed from `etihad-engineering/` to match. The artwork never changed —
 * it was always this product's UI, never Etihad's.
 *
 * ⚠️ **The card's poster underneath it did change.** It is now
 * `secure-communication-app`'s banner (the SecureLink monitor) instead of the Etihad
 * site. `DeviceMockup` below draws an SVG monitor for the intro, which was right while
 * the poster showed something unrelated — but the featured scene abandoned exactly that
 * approach for `PosterMockup` because a drawn monitor over a poster *of a monitor*
 * opens the hover on a visible cut. Expect that cut here now. If the visual pass
 * confirms it, the fix is the same swap the featured card made, which carries its own
 * registration work — not a one-line change.
 *
 * Same product, same brand tokens, same interaction shape as
 * `scenes/secure-communication/scene.tsx`. Reuses that scene's data and markup
 * (`../secure-communication/shared`) rather than forking it; this file owns only what
 * is genuinely different for a 4:3/560px canvas at a ~12-element budget instead of
 * 21:9/1120px at ~20: no sidebar, 2 meeting cards instead of 3, 2 participant rows
 * instead of 3, 4 chat bubbles instead of 7. Every state flip is still
 * `isAtOrAfter`, so the composed end state (standup selected, its detail, all 4
 * bubbles) renders correctly with no play-through under reduced motion.
 *
 * This is a duplicate-and-adapt, not the featured card's 1:1 fidelity port — see
 * `timeline.ts` for what got re-timed and why.
 *
 * Wrapped in `DeviceMockup` (`primitives/`), scaled to this canvas via that
 * primitive's own size-derived math — no grid-specific numbers needed here. The
 * `BrowserChrome` bar both scenes carried was dropped 2026-08-01 by request
 * ("remove top browser bezels, this is a desktop app") — SecureLink is a desktop
 * application, so browser chrome mis-stated what the product is.
 *
 * The one exception is `frame="bezel"` (2026-08-01, by request): the full
 * desktop monitor's chin and stand make a squat ~1.11:1 body on this 4:3 canvas,
 * so the grid card draws screen-and-bezel only, whose body is exactly 4:3. It
 * also frames larger — ~0.81× against the featured card's ~0.57× — because the
 * art no longer spends height on a stand.
 */

// 2 of the reference's 3 cards — "Product road map" never has cursor interaction in
// the original and adds nothing at this element budget.
const GRID_CARDS = CARDS.filter((card) => card.id !== "roadmap");

// MESSAGES[0, 1, 3, 6] — see `timeline.ts` for why this subset.
const GRID_MESSAGES = [MESSAGES[0], MESSAGES[1], MESSAGES[3], MESSAGES[6]];

const LIST_W = 178;
const DETAIL_W = 184;

// Manually authored to match the flex layout below (animations.md's authored-not-
// measured convention — same as the featured scene's cursor coordinates).
const CURSOR_START: CursorPoint = { x: LIST_W - 20, y: 18 };
const CURSOR_TARGET: CursorPoint = { x: LIST_W / 2, y: 154 };

export function SecureCommunicationGridScene() {
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
    <DeviceMockup zoomedIn={isAtOrAfter("zoom")} frame="bezel">
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      {/* LIST — meeting list, no sidebar at this canvas size */}
      <div
        style={{
          width: LIST_W,
          flexShrink: 0,
          borderRight: "1px solid var(--pv-border)",
          padding: "12px 10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--pv-text)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          <span>Meetings</span>
          <span style={{ color: "var(--pv-muted)", fontSize: 10, fontWeight: 600 }}>All</span>
        </div>

        {GRID_CARDS.map((card, index) => (
          <ListCard
            key={card.id}
            card={card}
            selected={cardSelected[card.id]}
            settled={settled}
            last={index === GRID_CARDS.length - 1}
          />
        ))}
      </div>

      {/* DETAIL — crossfading panels, 2 participant rows instead of 3 */}
      <div
        style={{
          width: DETAIL_W,
          flexShrink: 0,
          borderRight: "1px solid var(--pv-border)",
          padding: "12px 10px",
          position: "relative",
        }}
      >
        <DetailPanel
          data={SPRINT_DETAIL}
          visible={!revealed}
          settled={settled}
          maxParticipants={2}
        />
        <DetailPanel
          data={STANDUP_DETAIL}
          visible={revealed}
          settled={settled}
          maxParticipants={2}
        />
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 10px",
            background: "var(--pv-surface-2)",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--pv-avatar)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pv-text)" }}>
              {revealed ? "Daily Standup" : "Sprint Backlog"}
            </div>
            <div style={{ fontSize: 9, color: "var(--pv-text-2)" }}>
              {revealed ? "5 Users" : "3 Users"}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "8px 10px",
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
              fontSize: 10,
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
              fontSize: 9,
              fontWeight: 600,
              color: "var(--pv-text-2)",
              background: "var(--pv-surface-2)",
              padding: "2px 8px",
              borderRadius: 999,
              marginBottom: 8,
              opacity: isAtOrAfter("day-chip") ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          >
            Today
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {GRID_MESSAGES.map((message) => (
              <Bubble
                key={message.step}
                message={message}
                visible={isAtOrAfter(message.step)}
                maxWidth={140}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 10px",
            background: "var(--pv-surface-2)",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "var(--pv-input-bg)",
              borderRadius: 4,
              padding: "5px 8px",
              color: "var(--pv-muted)",
              fontSize: 10,
            }}
          >
            Type here
          </div>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: "var(--pv-accent)",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      <Cursor start={CURSOR_START} moves={cursorMoves} size={12} />
    </div>
    </DeviceMockup>
    </div>
  );
}
