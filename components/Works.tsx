import { works, worksSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";

const cta = "label items-center justify-center rounded-btn bg-brand px-6 text-brand-foreground";
const screenLabel = (n: number) => worksSection.screenLabel.replace("%n", String(n));

function Toggle() {
  return (
    <div className="flex w-full rounded-btn border border-hairline p-1">
      <span className="label flex-1 rounded-btn bg-secondary px-3 py-2 text-center text-foreground lg:rounded-[var(--radius-sm)] lg:bg-brand lg:text-brand-foreground">Final screens</span>
      <span className="label flex-1 px-3 py-2 text-center text-muted-foreground">Case study</span>
    </div>
  );
}

// Static layout: the first project is shown open. Switching and case-study links come with the behaviour pass.
export function Works() {
  const [active, ...rest] = works;
  return (
    <section id="works" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={worksSection.heading} />
        <div className="flex flex-col items-start gap-6 lg:w-full lg:max-w-works-intro">
          <p className="text-muted-foreground">{worksSection.intro}</p>
          <span className={`${cta} hidden py-3 lg:inline-flex`}>{worksSection.cta}</span>
        </div>
      </div>

      <div className="border-t border-hairline lg:grid lg:grid-cols-[var(--works-rail-w)_1fr]">
        <div className="lg:border-r lg:border-hairline">
          <div className="flex flex-col gap-4 bg-card px-4 py-6 lg:bg-transparent lg:p-8">
            <div className="flex items-start justify-between gap-3">
              <h3 className="title flex-1">{active.title}</h3>
              <span aria-hidden className="subtitle text-muted-foreground lg:hidden">−</span>
            </div>
            <span className="micro self-start rounded-full border border-hairline px-2 py-1 text-brand lg:rounded-[var(--radius-sm)] lg:border-0 lg:bg-brand lg:text-brand-foreground">{active.chip}</span>
            <p className="label whitespace-pre-wrap text-muted-foreground">{`${active.client}  •  ${active.year}`}</p>
            <p className="text-muted-foreground">{active.summary}</p>
            <Toggle />
            <span className="label hidden underline lg:block">{worksSection.readCase}</span>
            <div className="flex h-work-screen-sm items-center justify-center rounded-lg border border-hairline bg-background lg:hidden">
              <span className="micro text-center text-muted-foreground">{screenLabel(1)}</span>
            </div>
            <div className="flex h-work-screen-sm items-center justify-center rounded-lg border border-hairline bg-background lg:hidden">
              <span className="micro text-center text-muted-foreground">{screenLabel(2)}</span>
            </div>
            <span className="label rounded-btn border border-hairline px-4 py-3 text-center lg:hidden">{worksSection.showMore}</span>
            <span className="label text-brand lg:hidden">{worksSection.readCase}</span>
          </div>
          {rest.map((w) => (
            <div key={w.slug} className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-6 lg:px-8 lg:py-4">
              <p className="title flex-1 lg:text-muted-foreground">{w.title}</p>
              <span aria-hidden className="subtitle text-muted-foreground lg:hidden">+</span>
            </div>
          ))}
        </div>

        <div className="hidden flex-col items-start gap-6 p-8 lg:flex">
          <h3 className="title">{active.title}</h3>
          {[1, 2].map((n) => (
            <div key={n} className="flex h-work-screen w-full items-center justify-center rounded-lg border border-border bg-card">
              <span className="micro text-muted-foreground">{screenLabel(n)}</span>
            </div>
          ))}
          <span className="label rounded-btn border border-hairline px-6 py-3">{worksSection.showMore}</span>
        </div>
      </div>

      <div className="flex border-t border-hairline px-4 pb-8 pt-6 lg:hidden">
        <span className={`${cta} flex flex-1 py-4`}>{worksSection.cta}</span>
      </div>
    </section>
  );
}
