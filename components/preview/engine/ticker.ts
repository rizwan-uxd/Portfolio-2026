/**
 * One shared rAF loop for every active engine (animations.md §5, §10.6).
 *
 * Even though the coordinator (Phase 8) allows only one preview to play at a time,
 * a single ticker guarantees no rAF-loop leak from a fast mouse sweep across the
 * grid, and it lets the whole system stop on `document.hidden` in exactly one place
 * rather than four.
 */

type TickHandler = (deltaMs: number) => void;

const subscribers = new Set<TickHandler>();

let frameId: number | null = null;
let lastTimestamp = 0;

/**
 * A frame delta larger than this is treated as a stall, not as elapsed animation
 * time. Without the clamp, returning to a backgrounded tab (or a long main-thread
 * block) would hand the clock one enormous delta and jump the scene several steps
 * forward in a single frame — the "time jump" the Phase 2 manual test looks for.
 */
const MAX_FRAME_DELTA_MS = 64;

function frame(timestamp: number) {
  const delta = lastTimestamp === 0 ? 0 : timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  const clamped = delta > MAX_FRAME_DELTA_MS ? MAX_FRAME_DELTA_MS : delta;
  // Iterate a copy: a handler may unsubscribe itself on the frame it completes.
  for (const handler of Array.from(subscribers)) handler(clamped);

  frameId = subscribers.size > 0 ? requestAnimationFrame(frame) : null;
}

function start() {
  if (frameId !== null || subscribers.size === 0) return;
  if (typeof document !== "undefined" && document.hidden) return;
  // Reset so the first delta after a start is 0, never "time since page load".
  lastTimestamp = 0;
  frameId = requestAnimationFrame(frame);
}

function stop() {
  if (frameId === null) return;
  cancelAnimationFrame(frameId);
  frameId = null;
  lastTimestamp = 0;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
}

/**
 * Subscribe to the shared clock. Returns an unsubscribe function; the loop starts
 * on the first subscriber and stops at zero, so an idle page runs no rAF at all.
 */
export function subscribeToTicker(handler: TickHandler): () => void {
  subscribers.add(handler);
  start();

  return () => {
    subscribers.delete(handler);
    if (subscribers.size === 0) stop();
  };
}

/** Test/debug hook — number of live subscribers. */
export function tickerSubscriberCount(): number {
  return subscribers.size;
}
