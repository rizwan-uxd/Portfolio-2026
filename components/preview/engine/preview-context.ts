"use client";

import { createContext, useContext } from "react";
import type { PreviewContextValue } from "./types";

export const PreviewContext = createContext<PreviewContextValue | null>(null);

/**
 * Read the engine from inside a scene or primitive.
 *
 * Throws rather than returning a default: a primitive rendered outside an engine
 * would silently freeze at step 0, which is exactly the kind of bug that survives
 * to production because it looks like a design decision.
 */
export function usePreview(): PreviewContextValue {
  const value = useContext(PreviewContext);
  if (!value) {
    throw new Error("usePreview must be used inside a <PreviewEngine>");
  }
  return value;
}

/**
 * The idiom every scene is written in (animations.md §4). Monotonic: "the toast
 * exists from `success` onward", not "the step is `success`".
 */
export function useIsAtOrAfter(id: string): boolean {
  return usePreview().isAtOrAfter(id);
}
