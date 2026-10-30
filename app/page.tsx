import { Header } from "@/components/Header";
import { Frame } from "@/components/Frame";
import { hero, person } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="pt-16">
        <Frame>
          <section className="flex min-h-[540px] flex-col items-center justify-center px-4 py-16 text-center md:px-12">
            <p className="micro mb-6 text-muted-foreground">{person.role} · {person.location}</p>
            <h1 className="display max-w-[24ch]">
              {hero.headline[0]}
              <br />
              <span className="muted">{hero.headline[1]}</span>
            </h1>
          </section>
        </Frame>
      </main>
    </>
  );
}
