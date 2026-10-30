import { testimonials, testimonialsSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";

function Quote({ text, highlights }: { text: string; highlights: string[] }) {
  const parts = text.split(new RegExp(`(${highlights.join("|")})`));
  return (
    <p className="text-muted-foreground">
      {parts.map((part, i) => (highlights.includes(part) ? <strong key={i} className="font-medium text-foreground">{part}</strong> : part))}
    </p>
  );
}

// Mobile is a swipe row with static pagination dots; carousel behaviour comes later.
export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-6 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <div className="flex flex-col gap-4">
          <p className="micro text-brand">{testimonialsSection.eyebrow}</p>
          <Heading lines={testimonialsSection.heading} />
        </div>
        <p className="text-muted-foreground lg:w-full lg:max-w-intro">{testimonialsSection.intro}</p>
      </div>
      <div className="no-scrollbar flex items-start gap-3 overflow-x-auto border-t border-hairline px-4 pb-4 pt-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:p-8">
        {testimonials.map((t) => (
          <figure key={t.name} className="flex w-carousel-card shrink-0 flex-col gap-4 rounded-lg border border-border bg-card p-6 lg:w-auto lg:p-8">
            <span aria-hidden className="title text-brand">“</span>
            <div className="flex flex-col gap-1">
              <p className="title">{t.headline}</p>
              <p className="text-muted-foreground">{t.sub}</p>
            </div>
            <blockquote>
              <Quote text={t.quote} highlights={t.highlights} />
            </blockquote>
            <div className="h-px w-full bg-hairline" />
            <figcaption className="flex items-center gap-3">
              <span aria-hidden className="label flex size-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-secondary lg:size-11">
                {t.name.replace("Dr. ", "")[0]}
              </span>
              <span className="flex flex-col gap-1">
                <span>{t.name}</span>
                <span className="micro text-muted-foreground">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div aria-hidden className="flex justify-center gap-2 px-4 pb-8 pt-1 lg:hidden">
        <span className="h-pagination w-pagination-active rounded-full bg-brand" />
        <span className="size-pagination rounded-full bg-hairline" />
        <span className="size-pagination rounded-full bg-hairline" />
      </div>
    </section>
  );
}
