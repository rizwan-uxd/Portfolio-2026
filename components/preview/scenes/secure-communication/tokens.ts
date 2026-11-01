import type { CSSProperties } from "react";

/**
 * Scene-scoped `--pv-*` overrides for the SecureLink product sketch (animations.md
 * §6). Ported 1:1 from `ref images/securelink-preview.html`'s `:root` palette — this
 * is a real product's dark chat UI, not the portfolio's own surface, so it keeps its
 * own colours in both themes rather than inheriting `preview/tokens.ts`'s defaults.
 *
 * The reference has no light mode of its own (it's a single dark mock). LIGHT below
 * is an authored equivalent that keeps the same semantic relationships (raised
 * surface lighter than page bg, L3 a shade off L2, brand orange unchanged as a
 * product-identity colour) rather than a literal inversion.
 */
const DARK = {
  "--pv-bg": "#1a1a1a",
  "--pv-surface": "#262626",
  "--pv-surface-2": "#333333",
  "--pv-border": "#4d4d4d",
  "--pv-text": "#ffffff",
  "--pv-text-2": "#e5e5e5",
  "--pv-muted": "#b2b2b2",
  "--pv-accent": "#ed6e51",
  "--pv-accent-name": "#ff9174",
  "--pv-ok": "#33ad5c",
  "--pv-ok-bg": "#003d14",
  "--pv-upcoming": "#5c77ff",
  "--pv-upcoming-bg": "#1a2450",
  "--pv-selected": "#4d4d4d",
  "--pv-nav-active-bg": "#3e2923",
  "--pv-input-bg": "#404040",
  "--pv-avatar": "#5c5c5c",
  "--pv-bubble-in": "#333333",
  "--pv-bubble-out": "#262626",
} as CSSProperties;

const LIGHT = {
  "--pv-bg": "#f2f1ef",
  "--pv-surface": "#ffffff",
  "--pv-surface-2": "#ececec",
  "--pv-border": "#e2e2e2",
  "--pv-text": "#18181a",
  "--pv-text-2": "#4a4a4a",
  "--pv-muted": "#767676",
  "--pv-accent": "#ed6e51",
  "--pv-accent-name": "#c6553d",
  "--pv-ok": "#0f7a34",
  "--pv-ok-bg": "#d7f5df",
  "--pv-upcoming": "#3350cc",
  "--pv-upcoming-bg": "#dde3ff",
  "--pv-selected": "#e2e2e2",
  "--pv-nav-active-bg": "#ffe3da",
  "--pv-input-bg": "#eef0f2",
  "--pv-avatar": "#d0d0d0",
  "--pv-bubble-in": "#ececec",
  "--pv-bubble-out": "#ffffff",
} as CSSProperties;

export function secureCommunicationTokens(theme: "light" | "dark"): CSSProperties {
  return theme === "dark" ? DARK : LIGHT;
}
