import { hero, person } from "@/lib/content";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 py-12 text-center md:px-8 md:py-24">
      <p className="micro text-muted-foreground">{hero.eyebrow}</p>
      <h1 className="display w-full max-w-hero-headline">
        {hero.headline[0]}
        <span className="text-muted-foreground md:text-foreground">{hero.headline[1]}</span>
        <span className="text-muted-foreground">{hero.headline[2]}</span>
      </h1>
      <p className="w-full max-w-hero-subline text-muted-foreground">{hero.subline}</p>
      <a href={person.calendly} data-nav-reveal-after className="label flex w-full items-center justify-center rounded-btn bg-brand px-6 py-4 text-brand-foreground md:w-auto md:py-3">
        {hero.cta} →
      </a>
    </section>
  );
}
