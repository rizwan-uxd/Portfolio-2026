import { Header } from "@/components/Header";
import { Brands } from "@/components/Brands";
import { Works } from "@/components/Works";
import { Services } from "@/components/Services";
import { Graph } from "@/components/Graph";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Frame } from "@/components/Frame";
import { hero, person } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="pt-16 md:pt-20">
        <Frame>
          <section className="flex min-h-[540px] flex-col items-center justify-center px-4 py-16 text-center md:px-12">
            <p className="micro mb-6 text-muted-foreground">{hero.eyebrow}</p>
            <h1 className="display max-w-[800px]">
              {hero.headline[0]}
              <span className="text-muted-foreground">{hero.headline[1]}</span>
            </h1>
            <p className="mt-8 max-w-[560px] text-muted-foreground">{hero.subline}</p>
            <a
              href={person.calendly}
              className="label mt-8 inline-flex h-10 items-center rounded-btn bg-brand px-6 text-brand-foreground"
            >
              {hero.cta} →
            </a>
          </section>
          <Brands />
          <Works />
          <Services />
          <Graph />
          <Testimonials />
          <Contact />
        </Frame>
      </main>
    </>
  );
}
