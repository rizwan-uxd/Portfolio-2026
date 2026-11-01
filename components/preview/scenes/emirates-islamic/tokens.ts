import type { CSSProperties } from "react";

/**
 * Scene-scoped `--pv-*` overrides for the Emirates Islamic hover reveal
 * (animations.md §6).
 *
 * **Deliberately not theme-aware**, for the same reason `scenes/dubainow/tokens.ts`
 * is not: this scene paints floating panels *on top of the card's own poster*, which
 * is a PNG and does not change with the site theme. A dark-mode variant of these
 * panels would sit on an unchanged light photograph and read as a rendering fault.
 * Emirates Islamic is a light-UI product and is shown as one in both themes.
 *
 * `--pv-bg` is **transparent and must stay so** — the banner underneath is the scene's
 * background. Giving this scene a background hides the artwork it is annotating, which
 * is the whole composition.
 */
export const emiratesIslamicTokens: CSSProperties = {
  "--pv-bg": "transparent",
  "--pv-surface": "#ffffff",
  "--pv-accent": "#5b2a72",
  "--pv-text": "#4a4450",
  "--pv-muted": "#8f8996",
  "--pv-border": "#ece9ee",
  // The caption chips: near-opaque white so they stay readable over both the purple
  // hero band and the pale lower half of the banner.
  "--pv-chip-bg": "rgba(255, 255, 255, 0.94)",
} as CSSProperties;

/** The reference's own stack. */
export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif';
