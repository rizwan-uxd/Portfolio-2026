import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { aiProjectsSection } from "@/lib/content";

// Lime pixel chevron, as in the owner's reference (2026-10-31).
function Chevron({ dim = false }: { dim?: boolean }) {
  return (
    <svg viewBox="0 0 5 5" aria-hidden className={`size-6 shrink-0 text-brand ${dim ? "opacity-30" : ""}`} fill="currentColor" shapeRendering="crispEdges">
      <rect x="1" y="0" width="1" height="1" />
      <rect x="2" y="1" width="1" height="1" />
      <rect x="3" y="2" width="1" height="1" />
      <rect x="2" y="3" width="1" height="1" />
      <rect x="1" y="4" width="1" height="1" />
    </svg>
  );
}

type Project = (typeof aiProjectsSection.projects)[number];
const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

function Card({ project }: { project: Project }) {
  const href = "href" in project ? project.href : undefined;
  const body = (
    <>
      <span className="relative block aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-background">
        <Image src={project.image} alt={project.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className={`object-cover ${href ? "" : "opacity-80"}`} />
      </span>
      <span className="micro text-brand">{project.tag}</span>
      <h3 className="headline">{project.title}</h3>
      <span className="text-muted-foreground">{project.summary}</span>
      <span className="mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-4">
        <span className="flex flex-col gap-1">
          <span className="micro text-muted-foreground">{project.statLabel}</span>
          <CountUp value={project.stat} className="label" />
        </span>
        <Chevron dim={!href} />
      </span>
    </>
  );
  const cls = "flex h-full flex-col gap-4 p-4 lg:p-6";
  return href ? (
    <Link href={href} className={`${cls} transition-colors hover:bg-card`}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function AiProjects() {
  return (
    <section id="ai-projects" className="border-t border-hairline">
      <div data-rise className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:px-12 lg:pb-12 lg:pt-16">
        <h2 className="rise-head display" style={step(0)}>{aiProjectsSection.heading[0]}</h2>
        <p className="rise-head max-w-[var(--case-subtitle-w)] text-muted-foreground" style={step(1)}>{aiProjectsSection.note}</p>
      </div>
      <div data-rise className="grid grid-cols-1 border-t border-hairline lg:grid-cols-2">
        {aiProjectsSection.projects.map((project, i) => (
          <div key={project.title} className="border-hairline not-first:border-t lg:not-first:border-l lg:not-first:border-t-0">
            {/* The Works card reveal, so the two project lists arrive the same way (animations.md) */}
            <div className="rise-work h-full" style={step(i)}>
              <Card project={project} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
