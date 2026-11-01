"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WorkPreview } from "@/components/WorkPreview";
import { works, worksSection, type Work } from "@/lib/content";
import { DottedArrow } from "@/components/DottedArrow";
import { WorkIcon } from "@/components/WorkIcons";
import { workHighlights } from "@/lib/works-highlights";

// Layout follows poulo.site/#work (owner, 2026-11-01): a headline per project, a media card and a story card side by
// side, then a row of four squares. Styling, copy and images are ours. No filters (owner, 2026-11-01).

function MediaCard({ work }: { work: Work }) {
  return (
    <div className="works-fig works-media flex flex-col overflow-hidden rounded-xl border border-hairline">
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <WorkPreview work={work} />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 pb-4 lg:px-8 lg:pb-6">
        <p className="label text-muted-foreground">{work.client}</p>
        {work.year && <p className="label shrink-0 text-muted-foreground">{work.year}</p>}
      </div>
    </div>
  );
}

function StoryCard({ work }: { work: Work }) {
  return (
    <div className="works-fig flex flex-col gap-6 rounded-xl border border-hairline bg-card p-2 pb-6 lg:p-3 lg:pb-8">
      <div className="flex flex-1 items-center rounded-lg bg-background p-6 lg:p-8">
        <p>{work.summary}</p>
      </div>
      <dl className="flex flex-col gap-4 px-4 lg:px-5">
        {work.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="micro text-muted-foreground">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/work/${work.slug}`} className="label mx-4 inline-flex items-center gap-3 self-start rounded-btn bg-brand py-2 pl-6 pr-2 text-brand-foreground lg:mx-5">
        {/* the dotted arrow replaces the ↗ glyph here */}
        {worksSection.readCase.replace(/\s*↗$/, "")}
        <DottedArrow />
      </Link>
    </div>
  );
}

function Squares({ work }: { work: Work }) {
  const square = "works-fig works-square flex flex-col gap-3 rounded-xl border border-hairline bg-card p-6";
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className={square}>
        <WorkIcon name="trending-up" />
        <p className="subtitle mt-auto pt-6">{worksSection.metricLabel}</p>
        <div className="flex flex-col gap-1">
          <p className="display works-metric text-brand">{work.metric}</p>
          <p className="text-muted-foreground">{work.metricLabel}</p>
        </div>
      </div>
      {(workHighlights[work.slug] ?? []).map((item) => (
        <div key={item.label} className={square}>
          <WorkIcon name={item.icon} />
          <p className="subtitle mt-auto pt-6">{item.label}</p>
          <p className="text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function WorksList() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Each card fades up once as it reaches the screen (the existing .works-fig reveal).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.setAttribute("data-ready", "");
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-in", "");
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll(".works-fig").forEach((fig) => reveal.observe(fig));
    return () => reveal.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="works-list works-ix border-t border-hairline">
      {works.map((work) => (
        <article key={work.slug} className="flex flex-col gap-3 border-b border-hairline px-4 py-12 last:border-b-0 lg:px-12 lg:py-20">
          <header className="mb-5 flex flex-col gap-3 lg:mb-9">
            <h3 className="display">{work.title}</h3>
            <p className="micro text-brand">{work.chip}</p>
          </header>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[var(--works-media-col)_1fr]">
            <MediaCard work={work} />
            <StoryCard work={work} />
          </div>
          <Squares work={work} />
        </article>
      ))}
    </div>
  );
}
