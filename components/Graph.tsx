import { graphSection } from "@/lib/content";
import { crossEdges, graphNodes, structureEdges, type GraphNode } from "@/lib/graph";
import { Heading } from "@/components/SectionHeading";

const catColor = (cat: string) => (cat === "root" ? "var(--foreground)" : `var(--graph-${cat})`);
const leaves = graphNodes.filter((n) => n.r === 7);
const nodeById = new Map<string, GraphNode>(graphNodes.map((n) => [n.id, n]));
const count = (cat: string) => leaves.filter((n) => n.cat === cat).length;
const stats = `${leaves.length} nodes · ${structureEdges.length + crossEdges.length} connections.`;

function Canvas({ className = "" }: { className?: string }) {
  const edge = ([a, b]: [string, string], dashed: boolean) => {
    const pa = nodeById.get(a)!;
    const pb = nodeById.get(b)!;
    return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="var(--muted-foreground)" strokeDasharray={dashed ? "4 6" : undefined} />;
  };
  return (
    <svg viewBox="0 0 872 600" role="img" aria-label={`Career knowledge graph: ${stats}`} className={`block h-auto w-full ${className}`}>
      {structureEdges.map((e) => edge(e, false))}
      {crossEdges.map((e) => edge(e, true))}
      {graphNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={catColor(n.cat)} />
          {n.abbr && (
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fill="var(--brand-foreground)" fontFamily="var(--font-heading)" fontSize={n.cat === "root" ? "var(--text-subtitle)" : "var(--text-label)"} fontWeight={500}>
              {n.abbr}
            </text>
          )}
          {n.lx !== undefined && n.ly !== undefined && (
            <text x={n.lx} y={n.ly} fill={n.cat === "root" ? "var(--foreground)" : "var(--muted-foreground)"} fontFamily="var(--font-mono)" fontSize="var(--text-micro)" letterSpacing="0.18em" stroke="var(--background)" strokeWidth={3} style={{ paintOrder: "stroke" }}>
              {n.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const field = "rounded-btn border border-input bg-background px-4 py-2";
const dot = (id: string) => <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: catColor(id) }} />;

// Static layout: search, filters, trace and node details come with the behaviour pass.
export function Graph() {
  const { categories } = graphSection;
  return (
    <section id="graph" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-6 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <div className="flex flex-col gap-4">
          <p className="micro text-brand lg:hidden">{graphSection.eyebrowMobile}</p>
          <p className="micro hidden text-brand lg:block">{graphSection.eyebrow}</p>
          <Heading lines={graphSection.heading} />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex rounded-btn border border-hairline p-1">
            <span className="label flex-1 rounded-btn bg-secondary px-3 py-2 text-center lg:rounded-[var(--radius-sm)] lg:bg-brand lg:px-4 lg:text-brand-foreground">Graph</span>
            <span className="label flex-1 px-3 py-2 text-center text-muted-foreground lg:px-4">Timeline</span>
          </div>
          <span className="label hidden rounded-btn bg-brand px-6 py-3 text-brand-foreground lg:block">Take the tour →</span>
          <span className="label hidden rounded-btn border border-hairline px-6 py-3 lg:block">Reset</span>
        </div>
      </div>

      {/* Mobile: chips, category list, overview thumbnail */}
      <div className="lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4 pt-2">
          {categories.map((c) => (
            <span key={c.id} className="flex shrink-0 items-center gap-2 rounded-full border border-hairline px-3 py-2">
              {dot(c.id)}
              <span className="micro">{c.label}</span>
            </span>
          ))}
        </div>
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 border-t border-hairline p-4">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: catColor(c.id) }} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="subtitle">{c.label}</p>
              <p className="micro text-muted-foreground">{c.preview}</p>
            </div>
            <span className="label text-muted-foreground">{count(c.id)}</span>
          </div>
        ))}
        <div className="flex flex-col gap-3 border-t border-hairline p-4">
          <div className="overflow-clip rounded-lg border border-hairline bg-background">
            <Canvas />
          </div>
          <span className="label rounded-btn border border-brand px-6 py-4 text-center text-brand">{graphSection.openGraph}</span>
          <p className="label text-center text-muted-foreground">{stats}</p>
        </div>
      </div>

      {/* Desktop: toolbar, canvas + info panel, hint */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-4 border-t border-hairline px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`${field} w-graph-search text-muted-foreground`}>{graphSection.searchPlaceholder}</p>
            {categories.map((c) => (
              <span key={c.id} className="flex items-center gap-2 rounded-btn border border-hairline px-3 py-2">
                {dot(c.id)}
                <span className="label">{c.label}</span>
                <span className="micro text-muted-foreground">{count(c.id)}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="micro text-muted-foreground">Trace a path from</span>
            <p className={`${field} flex w-graph-select justify-between`}>{graphSection.traceFrom}<span aria-hidden className="text-muted-foreground">↓</span></p>
            <span className="micro text-muted-foreground">to</span>
            <p className={`${field} flex w-graph-select justify-between`}>{graphSection.traceTo}<span aria-hidden className="text-muted-foreground">↓</span></p>
            <span className="label rounded-btn border border-brand px-6 py-3 text-brand">Trace</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_var(--graph-panel-w)] border-t border-hairline">
          <Canvas />
          <div className="flex flex-col gap-4 border-l border-hairline p-8">
            <p className="subtitle">{stats}</p>
            <p className="text-muted-foreground">{graphSection.intro}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              {categories.map((c) => (
                <p key={c.id}><span className="text-foreground">{count(c.id)}</span> {c.label}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-hairline px-8 py-4 text-center">
          <p className="micro text-muted-foreground">{graphSection.hint}</p>
        </div>
      </div>
    </section>
  );
}
