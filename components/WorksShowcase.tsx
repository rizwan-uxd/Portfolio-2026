"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { liveSite, works, worksSection, type Work, type WorkScreen } from "@/lib/content";

type View = "final" | "case";

function Toggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  const option = (value: View, label: string) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      aria-pressed={view === value}
      className={`label flex-1 cursor-pointer rounded-btn px-3 py-2 text-center lg:rounded-[var(--radius-sm)] ${view === value ? "bg-secondary text-foreground lg:bg-brand lg:text-brand-foreground" : "text-muted-foreground"}`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex w-full rounded-btn border border-hairline p-1">
      {option("final", "Final screens")}
      {option("case", "Case study")}
    </div>
  );
}

const CaseLink = ({ work }: { work: Work }) => (
  <a href={`${liveSite}/work/${work.slug}`} target="_blank" rel="noreferrer" className="label self-start underline">
    {worksSection.readCase}
  </a>
);

function Details({ work, view, onView }: { work: Work; view: View; onView: (view: View) => void }) {
  const meta = [work.client, work.year].filter(Boolean).join("  •  ");
  return (
    <>
      <span className="micro self-start rounded-full border border-hairline px-2 py-1 text-brand lg:rounded-[var(--radius-sm)] lg:border-0 lg:bg-brand lg:text-brand-foreground">{work.chip}</span>
      {meta && <p className="label whitespace-pre-wrap text-muted-foreground">{meta}</p>}
      <p className="text-muted-foreground">{work.summary}</p>
      <Toggle view={view} onChange={onView} />
      <CaseLink work={work} />
    </>
  );
}

function Screens({ screens }: { screens: WorkScreen[] }) {
  const landscape = screens.filter((s) => s.w >= s.h);
  const portrait = screens.filter((s) => s.w < s.h);
  const figure = (s: WorkScreen) => (
    <div key={s.src} className="works-fig overflow-hidden rounded-lg border border-border bg-card">
      <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 1024px) 760px, 100vw" className="block h-auto w-full" />
    </div>
  );
  return (
    <>
      {landscape.map(figure)}
      {portrait.length > 0 && <div className="works-phones">{portrait.map(figure)}</div>}
    </>
  );
}

function CaseSummary({ work }: { work: Work }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <p className="micro text-muted-foreground">{[worksSection.caseLabel, work.year].filter(Boolean).join(" · ")}</p>
      {work.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <dl className="grid grid-cols-1 gap-6 border-t border-hairline pt-6 lg:grid-cols-2">
        {[...(work.client ? [{ label: "Client", value: work.client }] : []), ...work.facts].map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="micro text-muted-foreground">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-1 border-t border-hairline pt-6">
        <p className="title text-brand">{work.metric}</p>
        <p className="micro text-muted-foreground">{work.metricLabel}</p>
      </div>
      <CaseLink work={work} />
    </div>
  );
}

// Scroll drives everything (animations.md): the project whose screens have reached the middle of the screen
// is active. On desktop its row opens in the pinned list; on mobile its name lights up in the pinned bar.
export function WorksShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [views, setViews] = useState<Record<string, View>>({});
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const group = (i: number) => rootRef.current?.querySelectorAll<HTMLElement>(".works-group")[i];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const flow = root.querySelector<HTMLElement>(".works-flow")!;
    const groups = [...root.querySelectorAll<HTMLElement>(".works-group")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = innerHeight / 2;
      let current = 0;
      groups.forEach((item, i) => {
        if (item.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
      const box = flow.getBoundingClientRect();
      root.style.setProperty("--works-p", String(Math.min(Math.max((line - box.top) / box.height, 0), 1)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.setAttribute("data-ready", ""); // screens only start hidden once something can reveal them
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const sizes = new ResizeObserver(schedule);
    sizes.observe(flow);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      sizes.disconnect();
    };
  }, []);

  // Runs again when screens appear through the toggle or "Show the other screens".
  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-in", "");
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    rootRef.current?.querySelectorAll(".works-fig:not([data-in])").forEach((fig) => reveal.observe(fig));
    return () => reveal.disconnect();
  }, [views, opened]);

  useEffect(() => {
    const bar = barRef.current;
    const tab = bar?.children[active] as HTMLElement | undefined;
    if (!bar || !tab || !bar.offsetParent) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const jump = (i: number) => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    group(i)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  // Flipping a project changes its height, so keep its top in view if it had already scrolled past.
  const setView = (work: Work, i: number, view: View) => {
    setViews((current) => ({ ...current, [work.slug]: view }));
    requestAnimationFrame(() => {
      const item = group(i);
      if (item && item.getBoundingClientRect().top < 0) item.scrollIntoView({ block: "start" });
    });
  };

  return (
    <div ref={rootRef} className="works-list works-ix border-t border-hairline lg:grid lg:grid-cols-[var(--works-rail-w)_1fr]">
      <aside className="works-rail hidden lg:block">
        <ol>
          {works.map((work, i) => (
            <li key={work.slug} data-on={i === active || undefined} className="border-b border-hairline">
              <button type="button" onClick={() => jump(i)} aria-current={i === active || undefined} className="works-rail-title title w-full cursor-pointer px-8 py-4 text-left">
                {work.title}
              </button>
              <div className="works-more">
                <div className="flex min-h-0 flex-col gap-4 overflow-hidden px-8">
                  <Details work={work} view={views[work.slug] ?? "final"} onView={(view) => setView(work, i, view)} />
                  <span className="h-2 shrink-0" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </aside>

      <div ref={barRef} className="works-bar">
        {works.map((work, i) => (
          <button key={work.slug} type="button" onClick={() => jump(i)} aria-current={i === active || undefined} className="label">
            {work.title}
          </button>
        ))}
      </div>

      <div className="works-flow">
        <i aria-hidden className="works-rule hidden lg:block" />
        {works.map((work, i) => {
          const view = views[work.slug] ?? "final";
          const shown = opened[work.slug] ? work.screens : work.screens.slice(0, work.initialScreens);
          const hidden = work.screens.length - shown.length;
          return (
            <article key={work.slug} className="works-group flex flex-col items-start gap-6 border-b border-hairline px-4 py-8 last:border-b-0 lg:p-8">
              <h3 className="title">{work.title}</h3>
              <div className="flex w-full flex-col gap-4 lg:hidden">
                <Details work={work} view={view} onView={(next) => setView(work, i, next)} />
              </div>
              {view === "case" ? (
                <CaseSummary work={work} />
              ) : (
                <>
                  <Screens screens={shown} />
                  {hidden > 0 && (
                    <button type="button" onClick={() => setOpened((current) => ({ ...current, [work.slug]: true }))} className="label w-full cursor-pointer rounded-btn border border-hairline px-6 py-3 text-center">
                      {worksSection.showMore.replace("%n", String(hidden))}
                    </button>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
