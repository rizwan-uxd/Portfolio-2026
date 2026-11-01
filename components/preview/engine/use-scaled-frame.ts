"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

type ScaledFrameOptions = {
  /** The fixed pixel width the scene is authored at (animations.md §7). */
  designWidth: number;
  /** Element whose width drives the scale, and which carries `--pv-scale`. */
  rootRef: RefObject<HTMLElement | null>;
};

/**
 * Uniform scaling of a fixed-width authoring canvas (animations.md §7).
 *
 * **Why scale rather than responsive CSS.** Micro-UI at card size has to keep its
 * *proportions*. A 13px label that reflows to 16px on mobile destroys the illusion of
 * a real screenshot-scale product. Uniform scaling preserves the composition exactly,
 * keeps text crisp (it is DOM, not raster) and reduces four responsive layouts to zero.
 *
 * **Why a CSS variable and not React state.** A window drag fires `ResizeObserver`
 * continuously. Routing that through `setState` would re-render every mounted scene on
 * every frame of the drag — the exact cost the whole engine is built to avoid. Writing
 * `--pv-scale` straight to the DOM means a resize re-renders *nothing*; the transform
 * that consumes it is pure CSS.
 *
 * Returns a live imperative reader for the rare scene that needs the number in JS.
 */
export function useScaledFrame({ designWidth, rootRef }: ScaledFrameOptions) {
  const scaleRef = useRef(1);

  // Layout effect, not effect: the scale must be written before the browser paints,
  // or the first frame shows the scene at 1× and then snaps. That flash is the CLS
  // this phase exists to prevent.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = (width: number) => {
      if (width <= 0) return;
      const scale = width / designWidth;
      scaleRef.current = scale;
      root.style.setProperty("--pv-scale", scale.toFixed(5));
    };

    apply(root.clientWidth);

    const observer = new ResizeObserver((entries) => {
      apply(entries[0].contentRect.width);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [designWidth, rootRef]);

  return useCallback(() => scaleRef.current, []);
}
