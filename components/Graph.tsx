"use client";

import { useMemo, useState } from "react";
import {
  categoryMeta, categoryOrder, counts, edges, leafNodes, neighbors, nodeById, nodes, shortestPath, stats,
  type Category, type GraphNode,
} from "@/lib/graph";

const ROOT = nodeById.get("root")!;

type Side = "left" | "right" | "above" | "below";

// Where a label sits relative to its node, mirroring the Figma layout where the
// radial default would collide with a neighbour.
const sideOverride: Record<string, Side> = {
  etihad: "left", "smart-dubai": "above", cursor: "above", claude: "above", react: "above", "react-native": "above",
  "impact-25": "above", "impact-30a": "above", "emirates-islamic": "left", "ai-copilot": "left", hajj: "right",
  dubainow: "right", "secure-comms": "below", "product-ux": "below", aviation: "below",
};

function labelPlacement(n: GraphNode) {
  const dx = n.x - ROOT.x;
  const dy = n.y - ROOT.y;
  const side: Side =
    sideOverride[n.id] ?? (Math.abs(dx) > Math.abs(dy) * 1.2 ? (dx < 0 ? "left" : "right") : dy < 0 ? "above" : "below");
  if (side === "left") return { x: n.x - 14, y: n.y + 3, anchor: "end" as const };
  if (side === "right") return { x: n.x + 14, y: n.y + 3, anchor: "start" as const };
  return { x: n.x, y: n.y + (side === "above" ? -14 : 22), anchor: "middle" as const };
}

export function Graph() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<Category>>(new Set());
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("katim");
  const [to, setTo] = useState("ai-copilot");
  const [path, setPath] = useState<string[]>([]);

  const active = useMemo(() => {
    if (path.length) return new Set(path);
    if (selected) return new Set([selected, ...neighbors(selected)]);
    const q = query.trim().toLowerCase();
    if (q) return new Set(leafNodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id));
    return null;
  }, [path, selected, query]);

  const activeEdges = useMemo(() => {
    if (path.length) return new Set(path.slice(1).flatMap((id, i) => [`${path[i]}|${id}`, `${id}|${path[i]}`]));
    if (selected) return new Set(edges.filter((e) => e.a === selected || e.b === selected).map((e) => `${e.a}|${e.b}`));
    return null;
  }, [path, selected]);

  const isHiddenNode = (n: GraphNode) => hidden.has(n.category) && n.kind !== "root";
  const dim = (n: GraphNode) => isHiddenNode(n) || (active !== null && !active.has(n.id));

  const sel = selected ? nodeById.get(selected) : null;
  const selNeighbors = sel ? neighbors(sel.id).map((id) => nodeById.get(id)!).filter((n) => n.kind === "leaf") : [];

  const reset = () => {
    setSelected(null); setHidden(new Set()); setQuery(""); setPath([]);
  };
  const toggleCategory = (c: Category) =>
    setHidden((h) => {
      const next = new Set(h);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  const select = (id: string) => { setPath([]); setSelected((s) => (s === id ? null : id)); };

  const selectCls = "h-10 w-full min-w-0 rounded-lg border border-border bg-card px-4 text-foreground md:w-[220px]";

  return (
    <section id="graph" className="border-t border-hairline">
      <div className="flex flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12 md:py-16">
        <div>
          <p className="micro text-brand">Click any node to see how it connects</p>
          <h2 className="display mt-4">
            Career
            <br />
            <span className="text-muted-foreground">knowledge graph</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeline view and the guided tour are not designed yet */}
          <div role="group" aria-label="View" className="grid grid-cols-2 rounded-md border border-hairline p-[5px] text-xs uppercase">
            <button type="button" aria-pressed="true" className="h-8 rounded-sm bg-brand px-4 text-brand-foreground">Graph</button>
            <button type="button" disabled title="Coming soon" className="h-8 rounded-sm px-4 opacity-50">Timeline</button>
          </div>
          <button type="button" disabled title="Coming soon" className="label inline-flex h-10 items-center rounded-btn bg-brand px-6 text-brand-foreground opacity-50">
            Take the tour →
          </button>
          <button type="button" onClick={reset} className="label inline-flex h-[42px] items-center rounded-btn border border-hairline px-6">
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4 border-t border-hairline px-6 py-4 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); setPath([]); }}
            placeholder="Search… e.g. KATIM, Claude"
            aria-label="Search the graph"
            className="h-10 w-full rounded-lg border border-border bg-card px-4 placeholder:text-muted-foreground md:w-[280px]"
          />
          {categoryOrder.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={!hidden.has(c)}
              onClick={() => toggleCategory(c)}
              className={`label inline-flex h-[34px] items-center gap-2 rounded-md border border-border bg-card px-3 ${hidden.has(c) ? "opacity-40" : ""}`}
            >
              <span className="size-2 rounded-full" style={{ background: categoryMeta[c].color }} aria-hidden />
              {categoryMeta[c].label}
              <span className="micro text-muted-foreground">{counts[c]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="micro text-muted-foreground">Trace a path from</span>
          <select aria-label="Trace from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectCls}>
            {leafNodes.map((n) => <option key={n.id} value={n.id}>{n.id.startsWith("impact") ? `${n.label} (${nodeById.get(n.id)!.category})` : n.label}</option>)}
          </select>
          <span className="micro text-muted-foreground">to</span>
          <select aria-label="Trace to" value={to} onChange={(e) => setTo(e.target.value)} className={selectCls}>
            {leafNodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
          <button
            type="button"
            onClick={() => { setSelected(null); setPath(shortestPath(from, to)); }}
            className="label inline-flex h-[42px] items-center rounded-btn border border-brand px-6 text-brand"
          >
            Trace
          </button>
        </div>
      </div>

      <div className="grid border-t border-hairline lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 p-2 sm:p-4">
          <svg viewBox="0 0 872 600" className="h-auto w-full" role="group" aria-label="Career knowledge graph">
            {edges.map((e) => {
              const a = nodeById.get(e.a)!;
              const b = nodeById.get(e.b)!;
              const key = `${e.a}|${e.b}`;
              const on = activeEdges ? activeEdges.has(key) : true;
              const off = isHiddenNode(a) || isHiddenNode(b) || !on || (active !== null && !activeEdges && !(active.has(e.a) && active.has(e.b)));
              return (
                <line
                  key={key}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={activeEdges?.has(key) ? "var(--brand)" : "var(--muted-foreground)"}
                  strokeOpacity={off ? 0.06 : e.cross ? 0.45 : 0.6}
                  strokeWidth={activeEdges?.has(key) ? 1.5 : 1}
                  strokeDasharray={e.cross ? "4 4" : undefined}
                />
              );
            })}
            {nodes.map((n) => {
              const color = n.kind === "root" ? "var(--foreground)" : categoryMeta[n.category].color;
              const r = n.kind === "root" ? 32 : n.kind === "hub" ? 20 : 7;
              const lab = labelPlacement(n);
              const isActive = active?.has(n.id) ?? false;
              return (
                <g
                  key={n.id}
                  opacity={dim(n) ? 0.15 : 1}
                  role={n.kind === "leaf" ? "button" : undefined}
                  tabIndex={n.kind === "leaf" ? 0 : undefined}
                  aria-label={n.kind === "leaf" ? `${n.label}, ${categoryMeta[n.category].label}` : undefined}
                  aria-pressed={n.kind === "leaf" ? selected === n.id : undefined}
                  onClick={n.kind === "leaf" ? () => select(n.id) : undefined}
                  onKeyDown={n.kind === "leaf" ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(n.id); } } : undefined}
                  className={n.kind === "leaf" ? "cursor-pointer outline-none [&:focus-visible>circle]:stroke-foreground" : ""}
                >
                  <circle cx={n.x} cy={n.y} r={r} fill={color} stroke={n.id === selected ? "var(--foreground)" : "none"} strokeWidth={2} />
                  {n.kind === "root" && <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize="22" fill="#181818" fontWeight="500">R</text>}
                  {n.kind === "hub" && <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fill="#111" fontFamily="var(--font-mono)">{n.label}</text>}
                  {n.kind === "root" && (
                    <text x={n.x} y={n.y + 50} textAnchor="middle" fontSize="9" letterSpacing="1.6" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">{n.label}</text>
                  )}
                  {n.kind === "leaf" && (
                    <text
                      x={lab.x} y={lab.y} textAnchor={lab.anchor} fontSize="9" letterSpacing="1.6"
                      fill="var(--muted-foreground)" fontFamily="var(--font-mono)"
                      stroke="var(--background)" strokeWidth="3" paintOrder="stroke"
                      className={`leaf-label ${isActive ? "is-active" : ""}`}
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="border-t border-hairline p-6 lg:border-l lg:border-t-0 lg:p-8" aria-live="polite">
          <p className="subtitle">{stats}</p>
          {sel && sel.kind === "leaf" ? (
            <div className="mt-4">
              <p className="micro" style={{ color: categoryMeta[sel.category].color }}>{categoryMeta[sel.category].label}</p>
              <p className="title mt-2 text-[24px]">{sel.label}</p>
              <p className="mt-4 text-muted-foreground">Connects to:</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {selNeighbors.map((n) => (
                  <li key={n.id}>
                    <button type="button" onClick={() => select(n.id)} className="micro rounded-md border border-border px-2 py-1">
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              Click any node to see what it is, what it delivered, and everything it connects to. Try Hajj platform or AI Banking Copilot.
            </p>
          )}
          <dl className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
            {categoryOrder.map((c) => (
              <div key={c} className="flex gap-1">
                <dt className="sr-only">{categoryMeta[c].label}</dt>
                <dd>{counts[c]} {categoryMeta[c].label}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <p className="micro border-t border-hairline px-6 py-4 text-center text-muted-foreground">
        Click a node for details · dashed lines are cross-links
      </p>
    </section>
  );
}
