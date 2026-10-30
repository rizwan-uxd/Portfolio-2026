import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Brands } from "@/components/Brands";
import { Works } from "@/components/Works";
import { Services } from "@/components/Services";
import { Graph } from "@/components/Graph";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Frame } from "@/components/Frame";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="pt-header-offset-sm md:pt-header-offset">
        <Frame>
          <Hero />
          <Works />
          <Brands />
          <Services />
          <Graph />
          <Testimonials />
          <Contact />
        </Frame>
      </main>
    </>
  );
}
