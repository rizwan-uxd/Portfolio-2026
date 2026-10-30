import { aiTwin } from "@/lib/content";

// Static layout: sending and the expanded chat come later (the model behind it isn't decided).
export function AiTwinBar() {
  return (
    <div className="flex flex-col items-center gap-4 border-t border-hairline px-4 py-8 lg:gap-6 lg:px-8 lg:py-16">
      <div className="w-full max-w-prompt rounded-xl border border-hairline bg-card p-2 shadow-prompt-sm lg:shadow-prompt">
        <div className="flex items-center gap-2 rounded-btn border border-hairline bg-background py-2 pl-3 pr-2 lg:gap-4 lg:py-4 lg:pl-6 lg:pr-4">
          <img src="/figma/icon-sparkle.svg" alt="" className="block size-7 shrink-0" />
          <p className="min-w-0 flex-1 text-muted-foreground">{aiTwin.placeholder}</p>
          <span aria-hidden className="subtitle flex size-10 shrink-0 items-center justify-center rounded-btn bg-brand text-brand-foreground">↑</span>
        </div>
      </div>
      <p className="subtitle text-center text-muted-foreground">{aiTwin.tagline}</p>
      <div className="flex items-center justify-center gap-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-pos" />
        <p className="micro whitespace-pre-wrap text-muted-foreground">{aiTwin.status}</p>
      </div>
    </div>
  );
}
