import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Brands } from "@/components/Brands";
import { Works } from "@/components/Works";
import { AiProjects } from "@/components/AiProjects";
import { Tools } from "@/components/Tools";
import { Services } from "@/components/Services";
import { Graph } from "@/components/Graph";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Frame } from "@/components/Frame";
import { HeroHorizon } from "@/components/HeroHorizon";
import { HeroStage } from "@/components/HeroStage";
import { AiTwinBar } from "@/components/AiTwinBar";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="pt-header-offset-sm md:pt-header-offset">
        <Frame>
          <HeroStage>
            <Hero />
            <div className="hero-horizon-anchor">
              <HeroHorizon />
            </div>
            <Works />
          </HeroStage>
          <div aria-hidden data-twin-reveal-after />
          <Brands />
          <AiProjects />
          <Tools />
          <Services />
          <Graph />
          <Testimonials />
          <Contact />
        </Frame>
      </main>
      <AiTwinBar />
    </>
  );
}
