import type { Metadata } from "next";
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
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollTop } from "@/components/ScrollTop";
import { person, socialPreview } from "@/lib/content";
import { previewImage } from "@/lib/site";

// Home title and description from the owner's local copy, 2026-11-04.
const role = "Senior UX/Product Designer";
const title = `${person.name} | ${role} in Dubai`;
const description = `Dubai-based ${role.toLowerCase()} with 15+ years designing banking, government and enterprise platforms.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: socialPreview.siteName, title, description, locale: "en_US", images: [previewImage] },
  twitter: { card: "summary_large_image", title, description, images: [previewImage] },
};

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
      <ScrollTop />
      <ScrollReveal />
    </>
  );
}
