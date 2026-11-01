"use client";

import { useLayoutEffect, useRef } from "react";
import { usePreview } from "./preview-context";
import type { FrameSubscriber } from "./types";

/**
 * Run `callback` on every frame the engine commits — the sanctioned way for a
 * primitive to drive a continuous effect (animations.md §3, §10.3).
 *
 * **Write to the DOM from inside it. Never `setState`.** The engine's whole design is
 * ~6 renders per play cycle instead of ~240; a primitive calling `setState` here would
 * hand that back in a single line. Take a ref, set `style.transform` or `textContent`,
 * and React never learns the frame happened.
 *
 * The callback is held in a ref, so an inline arrow function does not resubscribe on
 * every render — subscription is tied to the engine's lifetime, not the component's
 * render count.
 *
 * A **layout** effect, matching `use-scaled-frame`: subscribing fires the callback
 * immediately, and it must land before the browser paints. Deferring it to a passive
 * effect would show one frame of an unpositioned cursor or empty text field — the same
 * class of flash the scaler's layout effect exists to prevent.
 */
export function usePreviewFrame(callback: FrameSubscriber): void {
  const { subscribeFrame } = usePreview();
  const callbackRef = useRef(callback);

  // Refreshed in a commit phase, not during render: writing a ref while rendering is
  // a tearing hazard under concurrent rendering, and the React compiler rejects it.
  // Declared before the subscription below so the ref is current by the time a
  // resubscribe fires in the same commit.
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useLayoutEffect(
    () => subscribeFrame((frame) => callbackRef.current(frame)),
    [subscribeFrame],
  );
}
