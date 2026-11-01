import type { CSSProperties } from "react";

/**
 * Scene-scoped `--pv-*` overrides for the Hajj hover scene (animations.md §6, spec §3).
 *
 * **Theme-aware, unlike `emirates-islamic/tokens.ts` and `dubainow/tokens.ts`** — and
 * the difference is principled, not inconsistency. Those two paint on top of the card's
 * own banner, which is a PNG and does not follow the site theme, so a dark variant of
 * them would sit on an unchanged light photograph. This scene paints its own canvas
 * *behind* the product, in card-space, so that canvas has to follow the theme or it
 * reads as a light rectangle pasted into a dark page.
 *
 * ## One canvas, one paint (direction changed 2026-08-14)
 *
 * This scene went through two earlier treatments, both abandoned, and the comments they
 * left behind were actively misleading — so, plainly, what it is now:
 *
 * **There is exactly one background: `--pv-canvas`, painted once by the scene root over
 * the whole 1120 × 480 card.** The 16:10 stage box paints nothing. That is not a detail
 * of implementation, it is the whole design: two elements painting "the same" gradient
 * would *not* be seamless, because one `linear-gradient(160deg, …)` resolves differently
 * across a 1120 × 480 box than across a 1040 × 650 one, and the stage edge would stay
 * faintly legible. One paint, and the seam cannot exist.
 *
 * What was removed, and must not come back:
 *   - the warm gutter field (`--pv-field` / `--pv-field-edge`, `#F3EFE8` / `#1E1B18`) —
 *     it made the 16:10 area read as a framed panel inside the card;
 *   - the stage's hairline border, drop shadow and 14px radius (`--pv-field-border`,
 *     `--pv-field-shadow`) — a box inside a box, in both themes;
 *   - `--pv-seam`, the tonal transition that existed only to soften the boundary between
 *     the two. With one continuous canvas there is no boundary left to soften.
 *
 * The colours below are the reference's own stage grey, now spanning the full card. The
 * product screens are untouched in both themes — see the note on `hajjOperationsTokens`.
 */
const LIGHT: CSSProperties = {
  // The whole visual canvas — gutters and 16:10 area alike, one paint. The reference's
  // own stage gradient, verbatim, just spanning 21:9 instead of 16:10.
  //
  // Not `transparent`: this scene replaces the poster rather than composing over it, so
  // the canvas is opaque all the way to the card's edge.
  "--pv-canvas": "linear-gradient(160deg, #C7CDD8 0%, #B9C0CD 100%)",
  // Mid-gradient, flat. No consumer inside this scene — hajj uses none of `primitives/`
  // — but it is the defensive override that stops the engine's default white leaking in,
  // so it has to agree with the canvas rather than fight it.
  "--pv-bg": "#C1C7D3",
  "--pv-accent": "#E8792B",
  "--pv-ok": "#2E9E4F",
} as CSSProperties;

const DARK: CSSProperties = {
  // The dark-theme canvas (approved 2026-08-14). At the reference's `#C7CDD8` this is a
  // bright slab across the whole card — the glowing-framed-video look the continuous
  // treatment exists to kill. Dark cool grey instead: it belongs to the theme, and it
  // *raises* contrast against the light `#E9ECF2` / `#EFF1F6` app frames, not lowers it.
  "--pv-canvas": "linear-gradient(160deg, #3A3E46 0%, #31353C 100%)",
  "--pv-bg": "#353A42",
  "--pv-accent": "#E8792B",
  "--pv-ok": "#2E9E4F",
} as CSSProperties;

/**
 * The product itself stays light in both themes — the two app screens are a light
 * enterprise product and are shown as one, the same call every other scene makes. Only
 * the canvas behind them follows the theme. Nothing in `screens/` reads a theme, and
 * nothing in it should: darkening the product would be inventing a dark mode the client's
 * software does not have.
 */
export function hajjOperationsTokens(theme: "light" | "dark"): CSSProperties {
  return theme === "dark" ? DARK : LIGHT;
}

/**
 * The system stack, not the reference's DM Sans (approved 2026-08-14). Same call
 * Emirates and DubaiNow made: 124KB of woff2 buys nothing at ~7 canvas px.
 */
export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
