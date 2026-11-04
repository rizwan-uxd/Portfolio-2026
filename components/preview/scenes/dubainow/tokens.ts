import type { CSSProperties } from "react";

/**
 * Scene-scoped `--pv-*` overrides for the DubaiNow mobile flow (animations.md §6).
 * Ported 1:1 from `ref images/mobile-flow-preview.html`'s `:root`, plus the literals
 * that file inlines rather than tokenising (navbar/tab-bar/sheet translucency, the
 * modal scrim, the two off-palette greys in the success sheet).
 *
 * **Deliberately not theme-aware, unlike every other scene's tokens.** This scene
 * paints only the *inside of one phone screen*, registered pixel-exactly over the
 * centre phone of the card's own poster (`scene.tsx` → `SCREEN`). The poster is a
 * PNG: it does not change with the site theme, so a scene that did would drift out
 * of the frame it is sitting in — a dark iOS UI inside a photographed light phone.
 * DubaiNow is a light-UI product and is shown as one in both themes, the same way
 * the SecureLink scene keeps its dark product palette in both.
 */
export const dubainowTokens: CSSProperties = {
  // Reference `:root`.
  "--pv-accent": "#007aff",
  "--pv-text": "#1e1e1e",
  "--pv-text-2": "#2e2e2e",
  "--pv-muted": "#b3b3b3",
  "--pv-surface": "#f2f2f7",
  "--pv-surface-2": "#f7f7fc",

  // The phone screen itself. Opaque on purpose — this is what hides the poster's
  // screenshot of the *old* home screen underneath.
  "--pv-bg": "#ffffff",
  "--pv-border": "rgba(0, 0, 0, 0.12)",

  // iOS chrome. Translucent in the reference; kept translucent rather than flattened
  // because each one sits over a different backdrop (white, the services bitmap, the
  // map) and a flat approximation would be visibly wrong on at least one of them.
  "--pv-navbar": "rgba(248, 248, 248, 0.92)",
  "--pv-tabbar": "rgba(249, 249, 249, 0.94)",
  "--pv-tab-inactive": "#bebec0",
  "--pv-sheet": "rgba(248, 248, 248, 0.98)",
  "--pv-scrim": "rgba(0, 0, 0, 0.75)",

  // Home screen.
  "--pv-search-glyph": "#757575",
  "--pv-chip-bg": "rgba(116, 116, 128, 0.08)",

  // Report Accident: the tile plate and its notification badge, drawn rather than
  // fetched — both were single-`<circle>` SVG exports in the reference.
  "--pv-tile-plate": "#ffffff",
  "--pv-badge-disc": "#ababab",
  "--pv-tile-glow": "rgba(0, 122, 255, 0.5)",
  "--pv-tile-halo": "rgba(0, 122, 255, 0.35)",

  // Success sheet — #111/#333 in the reference, a shade off `--pv-text`/`--pv-text-2`
  // rather than equal to them. Kept exact.
  "--pv-sheet-title": "#111111",
  "--pv-sheet-desc": "#333333",

  // Stepper minus control.
  "--pv-stepper-dim": "rgba(0, 0, 0, 0.3)",
} as CSSProperties;

/** The reference's own stack. iOS UI, so the system face is the correct one. */
export const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Arial, sans-serif';
