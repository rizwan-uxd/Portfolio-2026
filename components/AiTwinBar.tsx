"use client";

import { aiTwin } from "@/lib/content";

function Sparkle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="text-brand">
      <path d="M12 8c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6Z" fill="currentColor" />
      <path d="M21 3c.3 2 .8 2.5 2.8 2.8-2 .3-2.5.8-2.8 2.8-.3-2-.8-2.5-2.8-2.8C20.2 5.5 20.7 5 21 3Z" fill="currentColor" />
      <path d="M22 17c.2 1.4.6 1.8 2 2-1.4.2-1.8.6-2 2-.2-1.4-.6-1.8-2-2 1.4-.2 1.8-.6 2-2Z" fill="currentColor" />
    </svg>
  );
}

// Collapsed state only. Expanding into the chat (Figma node 13:2) and the real
// /api/twin backend are still to do, so submit does nothing for now.
export function AiTwinBar() {
  return (
    <div className="border-t border-hairline px-4 pb-12 pt-16 text-center md:px-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto w-full max-w-[880px] rounded-xl border border-hairline bg-card p-2 shadow-[0_0_48px_rgb(229_255_93/.10),0_12px_24px_rgb(0_0_0/.5)]"
      >
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-1.5">
          <Sparkle />
          <label htmlFor="twin-input" className="sr-only">Ask my AI twin</label>
          <input
            id="twin-input"
            type="text"
            placeholder={aiTwin.placeholder}
            className="h-10 min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex size-10 shrink-0 items-center justify-center rounded-btn bg-brand text-brand-foreground"
          >
            ↑
          </button>
        </div>
      </form>
      <p className="subtitle mx-auto mt-6 max-w-[880px] text-muted-foreground">{aiTwin.tagline}</p>
      <p className="micro mt-6 inline-flex items-center gap-2 text-muted-foreground">
        <span className="size-1.5 rounded-full bg-pos" aria-hidden />
        {aiTwin.status}
      </p>
    </div>
  );
}
