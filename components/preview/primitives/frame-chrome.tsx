import type { ReactNode } from "react";

/**
 * Browser-window chrome — traffic lights + an address pill — so a desktop-web scene
 * reads as "a site open in a browser window" rather than raw UI floating in the
 * card (animations.md §1 planned this as `frame-chrome.tsx`, unbuilt until now).
 *
 * Pixels-only, product-agnostic, no clock: this is a pure layout wrapper, not a
 * primitive that reads `usePreview()`. It splits its box into a fixed-height bar and
 * a `flex: 1` content area — the card's own `overflow-hidden rounded-xl` (
 * `project-card.tsx`) already clips the whole art region, so this never adds its own
 * radius or border, only the bar.
 *
 * Colours come from `--pv-*` (animations.md §6) except the three traffic-light
 * dots, which are a fixed real-world OS convention (red/yellow/green), not a
 * product or portfolio colour — themed traffic lights would stop reading as
 * "browser chrome."
 */
const DOT_COLORS = ["#ff5f57", "#febc2e", "#28c840"] as const;

export function BrowserChrome({
  barHeight,
  children,
}: {
  /** Design px. Two scenes call this with different values (34 featured / 22 grid)
   *  so the bar stays proportionate to each canvas rather than sharing one number. */
  barHeight: number;
  children: ReactNode;
}) {
  const dot = Math.round(barHeight * 0.28);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <div
        style={{
          flexShrink: 0,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          gap: Math.round(barHeight * 0.35),
          padding: `0 ${Math.round(barHeight * 0.4)}px`,
          borderBottom: "1px solid var(--pv-border)",
          background: "var(--pv-surface)",
        }}
      >
        <div style={{ display: "flex", gap: Math.round(barHeight * 0.18), flexShrink: 0 }}>
          {DOT_COLORS.map((color) => (
            <span
              key={color}
              style={{
                width: dot,
                height: dot,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: Math.round(barHeight * 0.5),
            borderRadius: 999,
            border: "1px solid var(--pv-border)",
          }}
        />
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
