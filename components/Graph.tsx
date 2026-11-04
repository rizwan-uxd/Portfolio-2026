"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { cv, graphSection, worksSection } from "@/lib/content";
import { categoryIds, graphLinks, graphNodes, graphStats, leafCount, neighbours, nodeById, shortestPath, type GraphNode } from "@/lib/graph";
import { GraphSelect, type SelectOption } from "@/components/GraphSelect";
import { GraphSphere, type SphereHandle, type SphereView } from "@/components/GraphSphere";
import { DottedArrow } from "@/components/DottedArrow";
import { Heading } from "@/components/SectionHeading";

const catLabel = (cat: string) => graphSection.categories.find((c) => c.id === cat)?.label ?? "";
const dot = (cat: string) => <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: "var(--muted-foreground)" }} />;
// The trace dropdowns list every node under its category, in the order of the filter chips
const traceOptions: SelectOption[] = graphSection.categories.flatMap((c) =>
  graphNodes.filter((n) => n.kind === "leaf" && n.cat === c.id).sort((a, b) => a.title.localeCompare(b.title)).map((n) => ({ id: n.id, label: n.title, group: c.label })),
);

const allCount = categoryIds.reduce((total, c) => total + leafCount(c), 0);

// A filter pill. Selected shows a check and a brand outline; the slot is the same size either way, so nothing shifts.
function Pill({ on, label, count, onClick }: { on: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-btn border pl-3 pr-3 transition-colors ${on ? "border-brand bg-secondary text-foreground" : "border-hairline text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
    >
      <span aria-hidden className="flex size-3.5 items-center justify-center">
        {on ? (
          <svg viewBox="0 0 14 14" className="size-3.5 text-brand"><path d="m2.5 7.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          <span className="size-2 rounded-full bg-muted-foreground" />
        )}
      </span>
      <span className="label">{label}</span>
      <span className="micro text-muted-foreground">{count}</span>
    </button>
  );
}

function NodeChip({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  const n = nodeById.get(id)!;
  return (
    <button type="button" onClick={() => onSelect(id)} className="flex items-center gap-2 rounded-btn border border-hairline px-2 py-1 text-left text-sm">
      {dot(n.cat)}
      {n.label}
    </button>
  );
}

function Panel({ node, onSelect, children }: { node: GraphNode | null; onSelect: (id: string) => void; children?: ReactNode }) {
  if (!node) {
    const [before, a, between, b, after] = graphSection.intro;
    return (
      <>
        <p className="subtitle">{graphStats}</p>
        <p className="text-muted-foreground">
          {before}
          <button type="button" className="text-foreground underline underline-offset-4" onClick={() => onSelect("hajj-platform")}>{a}</button>
          {between}
          <button type="button" className="text-foreground underline underline-offset-4" onClick={() => onSelect("ai-copilot")}>{b}</button>
          {after}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
          {graphSection.categories.map((c) => (
            <p key={c.id}><span className="text-foreground">{leafCount(c.id)}</span> {c.label}</p>
          ))}
        </div>
        {children}
      </>
    );
  }
  const links = neighbours(node.id);
  return (
    <>
      <span className="micro flex w-fit items-center gap-2 rounded-full border border-hairline px-3 py-1">
        {dot(node.cat)}
        {node.cat === "root" ? graphSection.rootTag : catLabel(node.cat)}
      </span>
      <p className="subtitle">{node.title}</p>
      {node.when && <p className="micro text-muted-foreground">{node.when}</p>}
      {node.detail && <p className="text-muted-foreground">{node.detail}</p>}
      {node.points && node.points.length > 0 && (
        <ul className="flex list-disc flex-col gap-2 pl-4 text-muted-foreground">
          {node.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}
      {node.href && <a href={node.href} className="label w-fit text-brand">{worksSection.readCase}</a>}
      <p className="micro text-muted-foreground">{links.length} {links.length === 1 ? "connection" : "connections"}</p>
      <div className="flex flex-wrap gap-2">
        {links.map((id) => <NodeChip key={id} id={id} onSelect={onSelect} />)}
      </div>
      {children}
    </>
  );
}

// Dates in the CV read "Feb 2025", or a year and "Present".
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const toYear = (text: string) => {
  const t = text.trim().toLowerCase();
  if (t === "present") {
    const d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  }
  const [month, year] = t.split(" ");
  return Number(year) + MONTHS.indexOf(month.slice(0, 3)) / 12;
};

function Timeline({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const rows = cv.experience.map((e) => {
    const [from, to] = e.dates.split(" - ").map(toYear);
    return { id: e.id, label: nodeById.get(e.id)!.label, role: e.role, dates: e.dates, from, to };
  });
  const start = Math.floor(Math.min(...rows.map((r) => r.from)));
  const end = Math.ceil(Math.max(...rows.map((r) => r.to)));
  const pos = (year: number) => ((year - start) / (end - start)) * 100;
  const ticks = Array.from({ length: Math.floor((end - start) / 4) + 1 }, (_, i) => start + i * 4);
  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:p-8">
      <div className="relative ml-0 h-4 lg:ml-[var(--graph-timeline-label)]">
        {ticks.map((y) => <span key={y} className="micro absolute -translate-x-1/2 text-muted-foreground first:translate-x-0" style={{ left: `${pos(y)}%` }}>{y}</span>)}
      </div>
      {rows.map((r) => {
        const projects = neighbours(r.id).filter((id) => nodeById.get(id)!.cat === "projects");
        return (
          <div key={r.id} className="flex flex-col gap-2 border-t border-hairline pt-4 lg:flex-row lg:items-start lg:gap-0">
            <button type="button" onClick={() => onSelect(r.id)} className="flex flex-col gap-1 text-left lg:w-[var(--graph-timeline-label)] lg:shrink-0 lg:pr-4">
              <span className={selected === r.id ? "subtitle text-brand" : "subtitle"}>{r.label}</span>
              <span className="text-sm text-muted-foreground">{r.role}</span>
              <span className="micro text-muted-foreground">{r.dates}</span>
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <button type="button" aria-label={`${r.label}, ${r.dates}`} onClick={() => onSelect(r.id)} className="relative block h-3 w-full rounded-full bg-secondary">
                <span className="absolute inset-y-0 rounded-full" style={{ left: `${pos(r.from)}%`, width: `${Math.max(pos(r.to) - pos(r.from), 1)}%`, background: selected === r.id ? "var(--brand)" : "var(--muted-foreground)" }} />
              </button>
              {projects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {projects.map((id) => <NodeChip key={id} id={id} onSelect={onSelect} />)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Graph() {
  const sphere = useRef<SphereHandle>(null);
  const [mode, setMode] = useState<"graph" | "timeline">("graph");
  const [filters, setFilters] = useState<Set<string>>(() => new Set()); // selected categories; none selected shows all
  const hidden = useMemo(() => (filters.size ? new Set<string>(categoryIds.filter((c) => !filters.has(c))) : new Set<string>()), [filters]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState(graphSection.traceFrom);
  const [to, setTo] = useState(graphSection.traceTo);
  const [path, setPath] = useState<string[] | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [hot, setHot] = useState(0); // highlighted search result

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return graphNodes.filter((n) => `${n.label} ${n.title}`.toLowerCase().includes(q));
  }, [query]);

  const view = useMemo<SphereView>(() => ({
    hidden,
    selected,
    path,
    matches: results ? new Set(results.map((n) => n.id)) : null,
  }), [hidden, selected, path, results]);

  const select = useCallback((id: string | null) => {
    setSelected(id);
    setPath(null);
    setQuery("");
    setTourStep(null);
    // Opening a node in a category that is filtered out adds that category to the filter
    if (id) {
      const cat = nodeById.get(id)!.cat;
      setFilters((f) => (f.size && cat !== "root" && !f.has(cat) ? new Set([...f, cat]) : f));
    }
  }, []);

  const showPath = (ids: string[]) => {
    setFilters(new Set());
    setPath(ids);
    setSelected(ids[ids.length - 1]);
    setQuery("");
  };

  const trace = () => {
    const found = shortestPath(from, to);
    if (found) showPath(found);
    setTourStep(null);
  };

  const toggle = (cat: string) => {
    const next = new Set(filters);
    if (!next.delete(cat)) next.add(cat);
    const applied = next.size === categoryIds.length ? new Set<string>() : next; // every category selected is the same as none
    setFilters(applied);
    setPath(null);
    const open = selected ? nodeById.get(selected)!.cat : null;
    if (open && open !== "root" && applied.size && !applied.has(open)) setSelected(null);
  };

  const goToStep = (i: number) => {
    const step = graphSection.tour[i];
    setMode("graph");
    setFilters(new Set());
    setQuery("");
    setTourStep(i);
    if (step.path) {
      const found = shortestPath(step.path[0], step.path[1]);
      if (found) showPath(found);
    } else {
      setPath(null);
      setSelected(step.node);
    }
  };

  const reset = () => {
    setMode("graph");
    setFilters(new Set());
    setSelected(null);
    setQuery("");
    setPath(null);
    setTourStep(null);
    setFrom(graphSection.traceFrom);
    setTo(graphSection.traceTo);
    sphere.current?.reset();
  };

  const node = selected ? nodeById.get(selected) ?? null : null;
  const step = tourStep === null ? null : graphSection.tour[tourStep];
  const toggleClass = (on: boolean) => `label flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-center lg:px-4 ${on ? "bg-secondary text-foreground" : "text-muted-foreground"}`;

  return (
    // One reveal group: heading lines, then the controls, then the stage (animations.md, section reveals)
    <section id="graph" data-rise className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={graphSection.heading} />
        <div className="rise-head flex flex-col gap-3 lg:flex-row lg:items-center" style={{ "--i": 2 } as React.CSSProperties}>
          <div role="group" aria-label={graphSection.viewLabel} className="flex h-12 rounded-btn border border-hairline p-1">
            <button type="button" aria-pressed={mode === "graph"} onClick={() => setMode("graph")} className={toggleClass(mode === "graph")}>Graph</button>
            <button type="button" aria-pressed={mode === "timeline"} onClick={() => { setMode("timeline"); setTourStep(null); }} className={toggleClass(mode === "timeline")}>Timeline</button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => goToStep(0)} className="label label-cta flex h-12 flex-1 items-center justify-center gap-3 rounded-btn bg-brand pl-6 pr-2 text-brand-foreground lg:flex-none">Take the tour <DottedArrow direction="right" /></button>
            <button type="button" onClick={reset} className="label h-12 flex-1 rounded-btn border border-hairline px-6 lg:flex-none">Reset</button>
          </div>
        </div>
      </div>

      {mode === "graph" && (
        <div className="rise-fade flex flex-col gap-4 border-t border-hairline px-4 py-4 lg:px-8" style={{ "--rise-at": "240ms" } as React.CSSProperties}>
          {/* Search is the primary control: full width, first, and the tallest */}
          <div className="relative">
            <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground">
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              aria-label={graphSection.searchLabel}
              placeholder={graphSection.searchPlaceholder}
              onChange={(e) => { setQuery(e.target.value); setHot(0); setPath(null); setSelected(null); setTourStep(null); }}
              onKeyDown={(e) => {
                const shown = Math.min(results?.length ?? 0, 8);
                if (e.key === "ArrowDown" && shown) { e.preventDefault(); setHot((h) => Math.min(shown - 1, h + 1)); }
                if (e.key === "ArrowUp" && shown) { e.preventDefault(); setHot((h) => Math.max(0, h - 1)); }
                if (e.key === "Enter" && results?.[hot]) select(results[hot].id);
                if (e.key === "Escape") setQuery("");
              }}
              className="h-12 w-full rounded-btn border border-input bg-background pl-11 pr-12 text-foreground placeholder:text-muted-foreground/60 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-btn text-muted-foreground hover:bg-secondary hover:text-foreground">✕</button>
            )}
            {results && (
              <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-btn border border-hairline bg-popover py-1 shadow-lg">
                {results.length === 0 && <li className="px-4 py-2 text-muted-foreground">{graphSection.noMatches}</li>}
                {results.slice(0, 8).map((n, i) => (
                  <li key={n.id}>
                    <button type="button" onClick={() => select(n.id)} onPointerEnter={() => setHot(i)} className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left ${i === hot ? "bg-secondary" : ""}`}>
                      <span className="truncate">{n.title}</span>
                      <span className="micro shrink-0 text-muted-foreground">{n.cat === "root" ? graphSection.rootTag : catLabel(n.cat)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Filters: a selected pill gets a check and a brand outline. None selected means everything shows. */}
          <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <Pill on={filters.size === 0} label="All" count={allCount} onClick={() => setFilters(new Set())} />
            {graphSection.categories.map((c) => (
              <Pill key={c.id} on={filters.has(c.id)} label={c.label} count={leafCount(c.id)} onClick={() => toggle(c.id)} />
            ))}
            {filters.size > 0 && (
              <button type="button" onClick={() => setFilters(new Set())} className="label h-10 shrink-0 rounded-btn px-3 text-muted-foreground hover:text-foreground">Clear {filters.size}</button>
            )}
          </div>
          <form className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-3" onSubmit={(e) => { e.preventDefault(); trace(); }}>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
              <span className="label text-muted-foreground">Trace a path from</span>
              <GraphSelect label="Trace from" value={from} onChange={setFrom} options={traceOptions} className="w-full lg:w-graph-select" />
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
              <span className="label text-muted-foreground">to</span>
              <GraphSelect label="Trace to" value={to} onChange={setTo} options={traceOptions} className="w-full lg:w-graph-select" />
            </div>
            <button type="submit" className="label h-10 rounded-btn border border-brand px-6 text-brand">Trace</button>
          </form>
          {path && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1" aria-live="polite">
              {path.map((id, i) => (
                <span key={id} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-muted-foreground">→</span>}
                  <button type="button" onClick={() => select(id)} className="text-brand">{nodeById.get(id)!.label}</button>
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      <div className="rise-fade grid grid-cols-1 border-t border-hairline lg:grid-cols-[1fr_var(--graph-panel-w)]" style={{ "--rise-at": "360ms" } as React.CSSProperties}>
        <div className="min-w-0">
          {mode === "timeline" && <Timeline selected={selected} onSelect={select} />}
          <div className={`relative aspect-square max-h-[var(--graph-stage-h)] w-full lg:aspect-auto lg:h-[var(--graph-stage-h)] ${mode === "graph" ? "" : "hidden"}`}>
            <GraphSphere ref={sphere} view={view} onSelect={select} />
            <div data-stage-ui className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-btn border border-hairline bg-background">
              <button type="button" aria-label="Zoom in" onClick={() => sphere.current?.zoomBy(1.25)} className="size-8 text-muted-foreground">+</button>
              <button type="button" aria-label="Zoom out" onClick={() => sphere.current?.zoomBy(0.8)} className="size-8 border-t border-hairline text-muted-foreground">−</button>
            </div>
            {step && tourStep !== null && (
              <div data-stage-ui aria-live="polite" className="absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-lg border border-hairline bg-card p-4 lg:inset-x-auto lg:left-4 lg:w-[var(--graph-tour-w)]">
                <div className="flex items-center justify-between">
                  <span className="micro text-brand">{tourStep + 1} / {graphSection.tour.length}</span>
                  <button type="button" aria-label="Close tour" onClick={() => setTourStep(null)} className="text-muted-foreground">✕</button>
                </div>
                <p className="subtitle">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.body}</p>
                <button
                  type="button"
                  onClick={() => (tourStep + 1 < graphSection.tour.length ? goToStep(tourStep + 1) : setTourStep(null))}
                  className={`label flex w-fit items-center gap-2 rounded-btn bg-brand py-1.5 text-brand-foreground ${tourStep + 1 < graphSection.tour.length ? "pl-4 pr-1.5" : "px-4"}`}
                >
                  {tourStep + 1 < graphSection.tour.length ? <>Next <DottedArrow direction="right" size="sm" /></> : "Done"}
                </button>
              </div>
            )}
          </div>
        </div>
        <aside className="flex flex-col gap-4 border-t border-hairline p-4 lg:max-h-[var(--graph-stage-h)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-8">
          <Panel node={node} onSelect={select} />
        </aside>
      </div>
      <div className="border-t border-hairline px-4 py-4 text-center lg:px-8">
        <p className="micro text-muted-foreground">{graphSection.hint}</p>
      </div>
    </section>
  );
}
