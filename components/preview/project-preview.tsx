"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";
import { PREVIEWS_ENABLED } from "./constants";
import { PreviewEngine } from "./engine/preview-engine";
import { SecureCommunicationGridScene } from "./scenes/secure-communication-grid/scene";
import { secureCommunicationGridTimeline } from "./scenes/secure-communication-grid/timeline";
import { SecureCommunicationScene } from "./scenes/secure-communication/scene";
import { secureCommunicationTimeline } from "./scenes/secure-communication/timeline";
import { DubainowScene } from "./scenes/dubainow/scene";
import { dubainowTimeline } from "./scenes/dubainow/timeline";
import { DubainowPosterLayer } from "./scenes/dubainow/poster-layer";
import { EmiratesIslamicScene } from "./scenes/emirates-islamic/scene";
import { emiratesIslamicTimeline } from "./scenes/emirates-islamic/timeline";
import { HajjOperationsScene } from "./scenes/hajj-operations/scene";
import { hajjOperationsTimeline } from "./scenes/hajj-operations/timeline";

// Ahead of the Phase 8 registry (animations.md §1): real scenes, keyed by
// `slug:variant`.
//
// **Keyed by variant, not by slug alone (2026-08-11).** A scene is authored against one
// fixed canvas — 1120px for the 21:9 featured card, 560px for the 4:3 grid card — so
// which card a project sits in decides which scene is correct, and a slug on its own
// cannot answer that. `secure-communication-app` is what forced the change: it owns
// **two** scenes, the featured 21:9 port of `ref images/securelink-preview.html` and
// the 4:3 grid adaptation of the same UI in `scenes/secure-communication-grid/`. Under
// slug-only keying, moving that card from the featured row to the grid played a 1120px
// scene inside a 560px box.
//
// `dubainow-mobile-app` is the second featured card's 1:1 port of
// `ref images/mobile-flow-preview.html`; `emirates-islamic-digital-ux` is the grid
// card's 1:1 port of `assets/Project3_artifacts/Emirates Islamic project hover.html`.
//
// The grid scene lived at `scenes/etihad-engineering/` until the Etihad project was
// deleted (2026-08-11). It was never Etihad artwork — always the SecureLink UI on the
// smaller canvas — so it was renamed to what it is rather than deleted with the project.
//
// A slug with no entry for its variant falls back to the grey-box fixture below, which
// is still the right answer for a project with no scene.
const REAL_SCENES: Record<
  string,
  { timeline: typeof secureCommunicationTimeline; scene: ReactNode }
> = {
  "secure-communication-app:featured": {
    timeline: secureCommunicationTimeline,
    scene: <SecureCommunicationScene />,
  },
  "secure-communication-app:grid": {
    timeline: secureCommunicationGridTimeline,
    scene: <SecureCommunicationGridScene />,
  },
  "dubainow-mobile-app:featured": {
    timeline: dubainowTimeline,
    scene: <DubainowScene />,
  },
  "emirates-islamic-digital-ux:grid": {
    timeline: emiratesIslamicTimeline,
    scene: <EmiratesIslamicScene />,
  },
  // The first featured card. Deliberately has no `POSTER_LAYERS` entry: unlike
  // DubaiNow and Emirates, this scene *replaces* the poster rather than composing
  // over it, so the plain `<Image>` below and the engine's standard crossfade are
  // the whole swap.
  "hajj-operations-platform:featured": {
    timeline: hajjOperationsTimeline,
    scene: <HajjOperationsScene />,
  },
};

/**
 * Per-slug poster layers. Only DubaiNow has one, and it is not a style override — it is
 * a different *component*, because its poster is animated: the banner's four outer phones
 * slide into the centre phone on hover until it occludes them. All of the geometry, the
 * measurements it rests on and the reason five copies of one image is the right shape for
 * it live in `scenes/dubainow/poster.ts` and `scenes/dubainow/poster-layer.tsx`. Read
 * those before changing anything here.
 *
 * A slug with a layer here also takes its `playing` from that layer's cue rather than
 * straight from the card, so the scene starts as the merge completes instead of during
 * it. That is the only coupling; every other slug is untouched.
 *
 * This applies on the `PREVIEWS_ENABLED = false` path too — the framing is a decision
 * about the card's poster, not about previews, so the card must not change appearance
 * when the kill switch flips. On that path the layer is handed `playing={false}`, so it
 * renders the five bands at rest: a partition of the same image at the same size and
 * position, i.e. pixel-identical to the single `<Image>` it replaces. Still zero preview
 * DOM, no engine, no listeners, no rAF.
 */
type PosterLayerProps = {
  playing: boolean;
  onSceneCue: (cued: boolean) => void;
  poster: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

// `Partial` is load-bearing, not decorative: almost every slug has no layer here, so the
// lookup genuinely returns `undefined`. Typed as a bare `Record` it would come back as an
// always-defined function, and `posterLayerFor ? …` would be a type error rather than the
// presence check it is.
const POSTER_LAYERS: Partial<
  Record<string, (props: PosterLayerProps) => ReactNode>
> = {
  "dubainow-mobile-app": (props) => <DubainowPosterLayer {...props} />,
};

/**
 * The only public entry point of the preview system (animations.md §1).
 *
 * Owns the poster ↔ scene composition, and from Phase 8 the lazy import and the
 * registry lookup. It contains no animation logic and no product UI.
 *
 * Phase 2 scope: the engine is real — clock, FSM, step derivation, reduced motion —
 * but every card still gets the same grey-box test fixture. Phase 6 replaces that
 * with per-slug scenes.
 */
type ProjectPreviewProps = {
  /** Card-derived: pointer intent or keyboard focus. The whole input. */
  playing: boolean;
  /** Scene identity. Drives the Phase 8 registry lookup; unused until then. */
  slug: string;
  /**
   * Which card shape this preview sits in. Scenes are authored at one of two fixed
   * canvases (animations.md §7) — 1120px for the 21:9 featured card, 560px for the
   * 4:3 grid card — so the preview has to know which one it is being asked for. The
   * *section* knows, because it chose the card; the card itself still knows nothing.
   */
  variant: "featured" | "grid";
  poster: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function ProjectPreview({
  playing,
  slug,
  variant,
  poster,
  alt,
  sizes,
  priority,
}: ProjectPreviewProps) {
  // Only consumed by slugs with a poster layer that animates; `setCued` is a stable
  // identity, which the layer's timer effect depends on.
  const [cued, setCued] = useState(false);
  const onSceneCue = useCallback((next: boolean) => setCued(next), []);

  const posterLayerFor = POSTER_LAYERS[slug];

  const posterImage = (
    <Image
      src={poster}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
    />
  );

  const posterLayer = posterLayerFor
    ? posterLayerFor({
        // On the kill-switch path there is no hover behaviour at all, so the layer is
        // pinned at rest and never starts a timer.
        playing: PREVIEWS_ENABLED ? playing : false,
        onSceneCue,
        poster,
        alt,
        sizes,
        priority,
      })
    : posterImage;

  // Kill switch: no engine, no listeners, no extra layer, no rAF. Identical output
  // to the pre-preview homepage.
  if (!PREVIEWS_ENABLED) return posterLayer;

  // Ahead of the Phase 8 slug→scene registry: a lookup by slug for the two projects
  // with a real scene so far. Every other slug still gets the grey-box fixture until
  // its own scene lands. Collapse this into `registry.ts` once Phase 8 is actually
  // built — this is not meant to be the permanent mechanism (animations.md).
  const real = REAL_SCENES[`${slug}:${variant}`];
  if (!real) return posterLayer; // no scene for this slug and card shape: the poster alone (the grey-box fixture isn't ported)
  const { timeline, scene } = real;

  // A slug whose poster animates starts its scene on the layer's cue, not on hover —
  // the scene has to arrive as the merge lands, not during it. `playing &&` keeps the
  // stop instantaneous: on mouse leave the engine must begin exiting in the same commit
  // as the snap-back, not a frame later when the layer's effect clears the cue.
  const scenePlaying = posterLayerFor ? playing && cued : playing;

  return (
    <div className="relative h-full w-full" data-preview-slug={slug}>
      {/* Always rendered, always the resting layer. The live layer is purely
          additive, so LCP is unchanged by construction (animations.md §10.8). */}
      {posterLayer}

      {/* The scene is the only layer that fades; the poster sits beneath it the
          whole time. One animated layer, not two — and it is the engine root
          because the phase driving it (pause, resume-inside-fade, reset) is FSM
          knowledge that lives there. */}
      <PreviewEngine timeline={timeline} playing={scenePlaying}>
        {scene}
      </PreviewEngine>

      {/* The story is not lost for assistive tech (animations.md §11): screen
          reader users get the content of the animation as prose. */}
      <span className="sr-only">Preview: {timeline.description}</span>
    </div>
  );
}
