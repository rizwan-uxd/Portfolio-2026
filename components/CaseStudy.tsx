import Image from "next/image";
import Link from "next/link";
import { DottedArrow } from "@/components/DottedArrow";
import { caseStudySection, nextCaseStudies, type Block, type CaseStudy as Study, type Figure, type Section } from "@/lib/case-studies";

const number = (i: number) => String(i + 1).padStart(2, "0");
const fullWidth = "(min-width: 1214px) 1116px, 100vw";

function Picture({ figure, priority }: { figure: Figure; priority?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card" style={figure.aspect ? { aspectRatio: figure.aspect } : undefined}>
      {figure.aspect ? (
        <Image src={figure.src} alt={figure.alt} fill priority={priority} sizes={fullWidth} className="object-cover" />
      ) : (
        <Image src={figure.src} alt={figure.alt} width={figure.w} height={figure.h} priority={priority} sizes={fullWidth} className="block h-auto w-full" />
      )}
    </div>
  );
}

function Phones({ phones, priority }: { phones: Figure[]; priority?: boolean }) {
  return (
    <div className={`grid w-full grid-cols-2 gap-3 lg:gap-4 ${phones.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
      {phones.map((phone) => (
        <div key={phone.src} className="overflow-hidden rounded-lg border border-border bg-card">
          <Image src={phone.src} alt={phone.alt} width={phone.w} height={phone.h} priority={priority} sizes="(min-width: 1024px) 270px, 50vw" className="block h-auto w-full" />
        </div>
      ))}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="micro w-full text-muted-foreground">{children}</p>;
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "text") return <p className={block.muted ? "text-muted-foreground" : undefined}>{block.text}</p>;
  if (block.type === "list") {
    return (
      <ol className="w-full rounded-lg border border-hairline bg-card">
        {block.items.map((item, i) => (
          <li key={item} className="flex items-start gap-3 border-hairline p-4 not-first:border-t lg:items-center lg:gap-4 lg:px-6">
            <span className="micro shrink-0 text-brand">{number(i)}</span>
            <span className="min-w-0 flex-1">{item}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <dl className="flex w-full flex-col gap-4 lg:gap-6">
      {block.items.map((item) => (
        <div key={item.label ?? item.body} className="flex flex-col gap-2 border-hairline not-first:border-t not-first:px-1 not-first:pb-1 not-first:pt-4 lg:first:p-1 lg:not-first:pt-6">
          {item.label && <dt className={`micro ${item.highlight ? "text-brand" : "text-muted-foreground"}`}>{item.label}</dt>}
          <dd className={item.highlight ? undefined : "text-muted-foreground"}>
            {item.body}
            {item.points && (
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 marker:text-brand">
                {item.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            )}
            {item.link && (
              <a href={item.link.href} target="_blank" rel="noreferrer" className="label mt-3 flex w-fit gap-1 text-brand">
                {item.link.label} <span aria-hidden>↗</span>
              </a>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SectionView({ section, index }: { section: Section; index: number }) {
  return (
    <section className="flex flex-col gap-4 border-t border-hairline px-4 py-12 lg:gap-0 lg:p-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-12 lg:px-12 lg:pb-8 lg:pt-16">
        <div className={`flex flex-col gap-4 ${section.body ? "lg:w-[var(--case-rail-w)] lg:shrink-0" : "lg:flex-1"}`}>
          <p className="micro text-muted-foreground"><span className="text-brand">{number(index)}</span> · {section.eyebrow}</p>
          <h2 className="title">{section.title}</h2>
        </div>
        {section.body && (
          <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:gap-6">
            {section.body.map((block, i) => <BlockView key={i} block={block} />)}
          </div>
        )}
      </div>
      {section.steps && (
        <div className="lg:px-12 lg:pb-8 lg:pt-4">
          <ol className={`grid grid-cols-1 overflow-clip rounded-lg border border-hairline ${section.steps.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {section.steps.map((step, i) => (
              <li key={step.label} className="flex flex-col gap-3 border-hairline bg-card px-4 py-6 not-first:border-t lg:gap-4 lg:p-6 lg:not-first:border-l lg:not-first:border-t-0">
                <p className="micro text-muted-foreground"><span className="text-brand">{number(i)}</span>{step.actor && ` · ${step.actor}`}</p>
                <p className="title">{step.label}</p>
                <p className="text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      {section.phones && (
        <div className="lg:px-12 lg:pb-8 lg:pt-4">
          <Phones phones={section.phones} />
        </div>
      )}
      {section.figures?.map((figure) => (
        <figure key={figure.src} className="flex flex-col gap-4 lg:gap-3 lg:px-12 lg:pb-8 lg:pt-4">
          <Picture figure={figure} />
          {figure.caption && <figcaption><Caption>{figure.caption}</Caption></figcaption>}
        </figure>
      ))}
    </section>
  );
}

function MoreWorks({ slug }: { slug: string }) {
  return (
    <section className="flex flex-col gap-4 border-t border-hairline px-4 py-12 lg:gap-8 lg:px-12 lg:py-16">
      <div className="flex flex-col gap-4 lg:gap-3">
        <p className="micro text-brand">{caseStudySection.moreLabel}</p>
        <h2 className="display">{caseStudySection.moreHeading}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {nextCaseStudies(slug).map((study) => (
          <Link key={study.slug} href={`/work/${study.slug}`} className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 pb-4 pt-3 lg:gap-4 lg:px-4 lg:pb-6 lg:pt-4">
            <span className="relative block h-[var(--case-thumb-h-sm)] overflow-hidden rounded-md border border-hairline bg-background lg:h-[var(--case-thumb-h)]">
              <Image src={study.thumbnail} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </span>
            <span className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-2 lg:py-1">
              <span className="subtitle">{study.title.join(" ")}</span>
              <span className="label shrink-0 text-brand">{caseStudySection.readCase} <span aria-hidden>↗</span></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// The Figma template's placeholders have fixed heights. The boards carry small type, so they show whole at their own ratio.
export function CaseStudy({ study }: { study: Study }) {
  return (
    <article>
      <header className="flex flex-col items-start gap-4 px-4 py-8 lg:gap-6 lg:p-12">
        <Link href="/#works" className="label text-muted-foreground"><span aria-hidden>←</span> {caseStudySection.back}</Link>
        <p className="micro text-brand">{study.eyebrow}</p>
        <h1 className="display">
          {study.title[0]} <span className="text-muted-foreground">{study.title[1]}</span>
        </h1>
        <p className="subtitle max-w-[var(--case-subtitle-w)] text-muted-foreground">{study.subtitle}</p>
        {study.tags && (
          <ul className="flex flex-wrap gap-2">
            {study.tags.map((tag) => <li key={tag} className="micro rounded-full border border-hairline px-3 py-1">{tag}</li>)}
          </ul>
        )}
        {study.links && (
          <div className="flex flex-wrap gap-2">
            {study.links.map((link, i) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={`label flex items-center gap-3 rounded-btn py-2 pl-6 pr-2 ${i === 0 ? "bg-brand text-brand-foreground" : "border border-hairline"}`}>
                {link.label} <DottedArrow tone={i === 0 ? "brand" : "outline"} />
              </a>
            ))}
          </div>
        )}
      </header>

      <dl className="border-t border-hairline lg:flex lg:border-b">
        {study.meta.map((item) => (
          <div key={item.label} className="flex items-start gap-4 border-hairline p-4 not-first:border-t lg:flex-1 lg:flex-col lg:gap-2 lg:p-6 lg:not-first:border-l lg:not-first:border-t-0">
            <dt className="micro w-20 shrink-0 text-muted-foreground lg:w-auto">{item.label}</dt>
            <dd className="min-w-0 flex-1">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div aria-hidden data-nav-reveal-after />

      <div className="border-t border-hairline px-4 py-6 lg:border-t-0 lg:p-12">
        {study.hero && <Picture figure={study.hero} priority />}
        {study.heroPhones && <Phones phones={study.heroPhones} priority />}
      </div>

      {study.sections.map((section, i) => <SectionView key={section.eyebrow} section={section} index={i} />)}

      <section className="flex flex-col gap-4 border-t border-hairline px-4 py-12 lg:gap-6 lg:px-12 lg:py-24">
        <p className="micro text-brand">{caseStudySection.conclusion}</p>
        <p className="case-statement">
          {study.conclusion.statement[0]} <span className="text-muted-foreground">{study.conclusion.statement[1]}</span>
        </p>
        {study.conclusion.rest && <p className="max-w-[var(--case-subtitle-w)] text-muted-foreground">{study.conclusion.rest}</p>}
      </section>

      <MoreWorks slug={study.slug} />
    </article>
  );
}
