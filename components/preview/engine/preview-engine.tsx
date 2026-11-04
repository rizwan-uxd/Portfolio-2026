"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/theme/theme-provider";
import { CROSSFADE_MS } from "../constants";
import { previewTokens } from "../tokens";
import { PreviewContext } from "./preview-context";
import { isSceneVisible } from "./playback-machine";
import { usePreviewClock } from "./use-preview-clock";
import { useScaledFrame } from "./use-scaled-frame";
import type { PreviewContextValue, Timeline } from "./types";

type PreviewEngineProps = {
  timeline: Timeline;
  playing: boolean;
  children: ReactNode;
};

/**
 * The engine shell (animations.md §3). Owns the clock, the FSM, step derivation,
 * reduced motion and the theme attribute. It knows no product concept and renders
 * no UI beyond its own root — the scene is `children`.
 *
 * Responsive scaling and the aspect box (§7) land in Phase 3; until then the root
 * fills the art slot the card already sizes.
 */
export function PreviewEngine(props: PreviewEngineProps) {
  // Framer's hook is already a live `matchMedia` subscription, so toggling the OS
  // preference updates without a reload, as §12 requires.
  const reducedMotion = useReducedMotion() === true;

  // Remount on preference change. The motion and reduced-motion paths are different
  // enough — one runs a clock, one renders a fixed composed frame — that unwinding
  // from one to the other by hand is all edge cases. A remount gives a clean start
  // in both directions for the cost of one key.
  return (
    <EngineCore
      key={reducedMotion ? "reduced" : "motion"}
      reducedMotion={reducedMotion}
      {...props}
    />
  );
}

function EngineCore({
  timeline,
  playing,
  children,
  reducedMotion,
}: PreviewEngineProps & { reducedMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { phase, stepIndex, getElapsed, getStepProgress, subscribeFrame } =
    usePreviewClock({
      timeline,
      playing,
      reducedMotion,
      rootRef,
    });

  const getScale = useScaledFrame({
    designWidth: timeline.designWidth,
    rootRef,
  });

  const value = useMemo<PreviewContextValue>(
    () => ({
      phase,
      stepIndex,
      stepId: timeline.steps[stepIndex].id,
      // Snapshots, correct as of this render — which happens on step change, so
      // both read ~0 mid-step. Live values come from getStepProgress() or the
      // --pv-step-progress CSS variable. See types.ts.
      stepProgress: 0,
      elapsed: timeline.offsets[stepIndex],
      getElapsed,
      getStepProgress,
      subscribeFrame,
      isAtOrAfter: (id: string) => {
        const target = timeline.indexOf(id);
        return target !== -1 && stepIndex >= target;
      },
      reducedMotion,
      // Mount-time snapshot. The live value is the --pv-scale CSS variable, so a
      // window resize re-renders nothing. See types.ts.
      scale: getScale(),
      getScale,
      timeline,
    }),
    [
      phase,
      stepIndex,
      timeline,
      reducedMotion,
      getElapsed,
      getStepProgress,
      subscribeFrame,
      getScale,
    ],
  );

  return (
    <div
      ref={rootRef}
      // Decoration inside a link: exposing a fake form to a screen reader would be
      // actively misleading (animations.md §11). The story is not lost — the
      // timeline's `description` is rendered as visually-hidden prose by
      // ProjectPreview.
      aria-hidden="true"
      data-preview-theme={theme}
      data-preview-phase={phase}
      data-preview-step={value.stepId}
      className="absolute inset-0"
      style={{
        // The --pv-* contract (animations.md §6). Defaults live on the engine root so
        // every primitive has a colour to consume without knowing a product exists;
        // from Phase 6 a scene's own tokens.ts overrides them on this same element.
        ...previewTokens(theme),
        pointerEvents: "none",
        opacity: isSceneVisible(phase) ? 1 : 0,
        // §12: the crossfade is replaced by an instant swap under reduced motion.
        // `timeline.exit === "instant"` opts a scene out the same way for the same
        // reason — a scene composed over its poster has nothing to cross-fade *to*,
        // so the fade reads as the overlays lagging rather than as a transition.
        transition:
          reducedMotion || timeline.exit === "instant"
            ? "none"
            : `opacity ${CROSSFADE_MS}ms ease-out`,
        // §10.7 — a scene can never invalidate layout outside its own box.
        contain: "strict",
        // §10.5 — only while it can actually move. A permanent will-change on four
        // cards is a memory tax that costs more than it saves.
        willChange:
          phase === "playing" || phase === "exiting" ? "opacity" : undefined,
      }}
    >
      {/* The authoring canvas: exactly designWidth × designHeight, scaled uniformly
          from its top-left corner. Scenes are written against these fixed pixel
          numbers and never think about breakpoints (animations.md §7).

          No `will-change: transform` here on purpose — the transform changes only on
          resize, never per frame. Promoting it to its own layer would rasterise the
          text once and scale the bitmap, which is exactly how scaled DOM text goes
          blurry. */}
      <div
        style={{
          width: timeline.designWidth,
          height: timeline.designHeight,
          transformOrigin: "top left",
          transform: "scale(var(--pv-scale, 1))",
        }}
      >
        <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
      </div>
    </div>
  );
}
