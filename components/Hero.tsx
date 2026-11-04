import { hero, person } from "@/lib/content";
import { HeroIntro } from "@/components/HeroIntro";
import { DottedArrow } from "@/components/DottedArrow";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content flex flex-col items-center gap-6 px-4 text-center md:px-8">
        <HeroIntro />
        <h1 className="display display-hero w-full max-w-hero-headline">
          {hero.headline[0]}
          <span className="text-muted-foreground md:text-foreground">{hero.headline[1]}</span>
          <span className="text-muted-foreground">{hero.headline[2]}</span>
        </h1>
        <p className="w-full max-w-hero-subline text-muted-foreground">{hero.subline}</p>
        <a href={person.calendly} className="label label-cta flex w-full items-center justify-center gap-3 rounded-btn bg-brand py-2 pl-6 pr-2 text-brand-foreground md:w-auto">
          {hero.cta} <DottedArrow direction="right" />
        </a>
      </div>
      <div className="hero-band" />
    </section>
  );
}
