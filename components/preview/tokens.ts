import type { CSSProperties } from "react";

/**
 * Default `--pv-*` values, applied by the engine on its root (animations.md §6).
 *
 * **Scope note.** The full token contract is fixed and documented in Phase 5. This
 * file is the subset Phase 4's two primitives cannot exist without — a cursor needs a
 * fill colour, a caret needs an accent — shipped now so `primitives/` can obey the
 * rule that makes it reusable: **consume only `--pv-*`, never a portfolio token and
 * never a literal colour.** Phase 5 extends this map; it does not replace it.
 *
 * These are *defaults*. A scene's own `tokens.ts` (Phase 6) overrides them as inline
 * vars on the same root, which is how a bank keeps looking like the bank in both
 * themes without any primitive knowing a product exists.
 *
 * Deliberately not `var(--text-color)` etc.: a preview depicts *another product's*
 * surface sitting on our card, not our own surface. Values track the portfolio theme
 * closely enough to sit correctly, and are plain literals so a scene override is a
 * straight substitution rather than a fight with an inherited chain.
 */
const LIGHT = {
  "--pv-bg": "#ffffff",
  "--pv-surface": "#f1f2f4",
  "--pv-border": "#dfe1e5",
  "--pv-text": "#14121b",
  "--pv-muted": "#6b6b6b",
  "--pv-accent": "#6b47ff",
  "--pv-ok": "#15803d",
} as CSSProperties;

const DARK = {
  "--pv-bg": "#1c1a24",
  "--pv-surface": "#242230",
  "--pv-border": "#343143",
  "--pv-text": "#ffffff",
  "--pv-muted": "#a3a3a3",
  "--pv-accent": "#8466ff",
  "--pv-ok": "#4ade80",
} as CSSProperties;

export function previewTokens(theme: "light" | "dark"): CSSProperties {
  return theme === "dark" ? DARK : LIGHT;
}
