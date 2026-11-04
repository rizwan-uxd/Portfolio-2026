/**
 * Live product previews — global switches and shared timings.
 * See `animations.md` (locked architecture) and `docs/preview-engine-plan.md`.
 */

/**
 * The kill switch for the entire preview feature, for every phase from 1 onward.
 *
 * When `false`, `ProjectPreview` early-returns the bare poster and no preview code
 * path runs — the homepage is pixel-identical to its pre-preview state. This is the
 * rollback for any preview regression: flip this one constant, ship, investigate
 * afterwards. Nothing else should ever need to be reverted in a hurry.
 */
export const PREVIEWS_ENABLED = true;

/**
 * Hover intent, in ms, before a preview is considered wanted (animations.md §8).
 * A mouse crossing the work grid touches three cards in under 100ms; without this
 * delay that gesture costs three mounts (and, from Phase 8, three dynamic imports)
 * for an interaction the user never made.
 */
export const HOVER_INTENT_MS = 80;

/**
 * Poster ↔ scene crossfade, in ms (animations.md §8). Matches the existing
 * `--duration-hover: 180ms` token so the preview swap and the card's own hover
 * transitions resolve on the same beat.
 */
export const CROSSFADE_MS = 180;

/**
 * Camera dolly duration for the monitor-mockup intro, in ms
 * (`primitives/device-mockup.tsx`, animations.md §"DeviceMockup").
 *
 * Lives here rather than in the component because two things have to agree on
 * it: the CSS `transition` that moves the camera, and the `zoom` step in every
 * timeline that uses the mockup. `scripts/preview-engine-check.ts` asserts the
 * agreement — that is the whole reason this is a shared constant and not a
 * literal in the component.
 */
export const MOCKUP_ZOOM_MS = 650;
