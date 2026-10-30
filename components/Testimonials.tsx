import { testimonials, testimonialsSection } from "@/lib/content";

function Quote({ text, highlights }: { text: string; highlights: string[] }) {
  const re = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <p className="mt-6 text-muted-foreground">
      {text.split(re).map((part, i) =>
        highlights.includes(part) ? (
          <strong key={i} className="font-medium text-foreground">{part}</strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-hairline">
      <div className="flex flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12 md:py-16">
        <div>
          <p className="micro text-brand">{testimonialsSection.eyebrow}</p>
          <h2 className="display mt-4">
            {testimonialsSection.heading[0]}
            <br />
            <span className="text-muted-foreground">{testimonialsSection.heading[1]}</span>
          </h2>
        </div>
        <p className="max-w-[420px] text-muted-foreground">{testimonialsSection.intro}</p>
      </div>

      <div className="grid items-start gap-6 border-t border-hairline p-6 md:grid-cols-2 lg:grid-cols-3 lg:p-8">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-lg border border-border bg-card p-8">
            <span aria-hidden className="title block leading-none text-brand">“</span>
            <h3 className="title mt-6">{t.headline}</h3>
            <p className="mt-1 text-muted-foreground">{t.sub}</p>
            <blockquote>
              <Quote text={t.quote} highlights={t.highlights} />
            </blockquote>
            <hr className="my-4 border-border" />
            <figcaption className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-sm" aria-hidden>
                {t.name[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block">{t.name}</span>
                <span className="micro block text-muted-foreground">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
