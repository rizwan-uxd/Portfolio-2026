"use client";

import { useState } from "react";
import { works, worksSection } from "@/lib/content";

type View = "screens" | "case";

export function Works() {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>("screens");
  const [showAll, setShowAll] = useState(false);
  const work = works[active];
  const screens = showAll ? [1, 2, 3, 4] : [1, 2];

  return (
    <section id="works" className="border-t border-hairline">
      <div className="flex flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12 md:py-16">
        <h2 className="display">
          {worksSection.heading[0]}
          <br />
          <span className="text-muted-foreground">{worksSection.heading[1]}</span>
        </h2>
        <div className="max-w-[400px]">
          <p className="text-muted-foreground">{worksSection.intro}</p>
          <button
            type="button"
            onClick={() => setView("case")}
            className="label mt-6 inline-flex h-10 items-center rounded-btn bg-brand px-6 text-brand-foreground"
          >
            {worksSection.cta}
          </button>
        </div>
      </div>

      <div className="grid border-t border-hairline lg:grid-cols-[395px_1fr]">
        <div role="tablist" aria-label="Projects" className="lg:border-r lg:border-hairline">
          {works.map((w, i) => {
            const isActive = i === active;
            return (
              <div key={w.slug} className={i > 0 ? "border-t border-hairline" : ""}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`block w-full px-6 py-4 text-left md:px-8 ${isActive ? "pt-8" : ""}`}
                >
                  <span className={`title block ${isActive ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}`}>
                    {w.title}
                  </span>
                </button>
                {isActive && (
                  <div className="px-6 pb-8 md:px-8">
                    {w.chip && (
                      <span className="micro inline-block rounded-sm bg-brand px-2 py-1 text-brand-foreground">{w.chip}</span>
                    )}
                    {(w.client || w.year) && (
                      <p className="label mt-4 font-normal text-muted-foreground">
                        {[w.client, w.year].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    {w.summary ? (
                      <p className="mt-4 text-muted-foreground">{w.summary}</p>
                    ) : (
                      <p className="mt-4 text-muted-foreground">
                        <span className="subtitle text-foreground">{w.metric}</span> {w.metricLabel}
                      </p>
                    )}
                    <div role="group" aria-label="View" className="mt-6 grid grid-cols-2 rounded-md border border-hairline p-[5px] text-xs uppercase">
                      {(["screens", "case"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={view === v}
                          onClick={() => setView(v)}
                          className={`h-8 rounded-sm uppercase ${view === v ? "bg-brand text-brand-foreground" : "text-foreground"}`}
                        >
                          {v === "screens" ? "Final screens" : "Case study"}
                        </button>
                      ))}
                    </div>
                    <a href={`/work/${w.slug}`} className="label mt-6 inline-block underline underline-offset-4">
                      Read the full case study ↗
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div key={`${work.slug}-${view}`} className="works-panel border-t border-hairline p-6 md:p-8 lg:border-t-0">
          <h3 className="title text-[28px] md:text-[32px]">{work.title}</h3>
          {view === "screens" ? (
            <>
              <div className="mt-6 space-y-6">
                {screens.map((n) => (
                  <div key={n} className="flex h-[260px] items-center justify-center rounded-lg border border-border bg-card md:h-[440px]">
                    <span className="micro text-muted-foreground">Screen 0{n} — drop final design here</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="label mt-6 inline-flex h-[42px] items-center rounded-btn border border-hairline px-6"
              >
                {showAll ? "Show fewer screens ↑" : "Show the other screens ↓"}
              </button>
            </>
          ) : (
            <div className="mt-6 flex h-[260px] items-center justify-center rounded-lg border border-border bg-card md:h-[440px]">
              <span className="micro text-muted-foreground">Case study — coming soon</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
