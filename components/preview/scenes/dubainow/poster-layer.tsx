"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { CROSSFADE_MS } from "../../constants";
import {
  BANDS,
  COLLAPSE_EASE,
  COLLAPSE_MS,
  POSTER_ASPECT,
  POSTER_BLEED,
  POSTER_SCALE,
} from "./poster";

/**
 * DubaiNow's poster, drawn as five independently transformable bands so the four
 * surrounding phones can slide into the centre one and be occluded by it. The geometry,
 * and the reasoning for why five copies of one image is the right shape for this, are in
 * `./poster.ts` — read that first.
 *
 * This component owns exactly two things: the collapse, and the cue that tells the card
 * when to start the scene. It knows nothing about the engine, the timeline or the scene,
 * which is why it can also serve the `PREVIEWS_ENABLED = false` path unchanged.
 *
 * **The cue fires one crossfade *before* the phones land, not at settle.** The engine
 * needs `CROSSFADE_MS` to bring the scene to full opacity; starting that at settle would
 * leave a visible 180ms gap between the merge completing and the phone coming alive,
 * which is exactly the pause the brief rules out. Firing at `COLLAPSE_MS - CROSSFADE_MS`
 * makes the two land in the same frame. Both constants are imported, never duplicated,
 * so the offset follows either one if it changes.
 *
 * **Mouse leave snaps, it does not reverse.** `transition` and `transform` are both
 * driven off the same `collapse` boolean, so React writes `transition: none` and the
 * rest transform in one commit and the browser has no transition to run. That also
 * handles an interrupted collapse — a hover-out mid-flight snaps rather than reversing
 * from wherever it had got to, which is the requested behaviour.
 */
type DubainowPosterLayerProps = {
  /** The card's hover intent. The whole input. */
  playing: boolean;
  /** Called with `true` one crossfade before the phones land, `false` on leave. */
  onSceneCue: (cued: boolean) => void;
  poster: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function DubainowPosterLayer({
  playing,
  onSceneCue,
  poster,
  alt,
  sizes,
  priority,
}: DubainowPosterLayerProps) {
  const reducedMotion = useReducedMotion() === true;
  const collapse = playing && !reducedMotion;

  useEffect(() => {
    if (!playing) {
      onSceneCue(false);
      return;
    }
    // §12: a reduced-motion viewer gets no collapse, so there is nothing to wait for —
    // the scene composes its settled end state immediately. Gating it behind a timer
    // here would delay a frame that is supposed to be instantaneous.
    if (reducedMotion) {
      onSceneCue(true);
      return;
    }
    const id = window.setTimeout(() => onSceneCue(true), COLLAPSE_MS - CROSSFADE_MS);
    return () => window.clearTimeout(id);
  }, [playing, reducedMotion, onSceneCue]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: POSTER_BLEED }}
    >
      {/* The drawn poster box — the banner's natural aspect at POSTER_SCALE of the card
          width, centred, overflowing vertically so the card does the cropping. Identical
          to the framing this layer replaces; see `./poster.ts`. Every band is inset:0 on
          this box, so a band's percentage travel is a percentage of the box. */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${POSTER_SCALE * 100}%`, aspectRatio: POSTER_ASPECT }}
      >
        {BANDS.map((band, i) => (
          <div
            key={band.phone.left}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: band.z,
              clipPath: band.clipInset,
              // `clip-path` is applied in the element's own box and the transform moves
              // the result, so clipping to a band and translating it moves that band —
              // which is the entire mechanism.
              transform: collapse ? `translate3d(${band.travelPct}%, 0, 0)` : "none",
              transition: collapse
                ? `transform ${COLLAPSE_MS}ms ${COLLAPSE_EASE}`
                : "none",
              // §10.5 — only while it can actually move.
              willChange: collapse ? "transform" : undefined,
            }}
          >
            {/* One `src` across five elements: the browser fetches it once. The alt text
                and the LCP preload go on the centre band only — five identical preloads
                would describe one resource five times. */}
            <Image
              src={poster}
              alt={i === 2 ? alt : ""}
              fill
              className="object-cover"
              sizes={sizes}
              priority={i === 2 ? priority : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
