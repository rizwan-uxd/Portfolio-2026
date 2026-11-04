import { worksSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";
import { WorksShowcase } from "@/components/WorksShowcase";

export function Works() {
  return (
    <section id="works" className="works-card">
      <span aria-hidden data-nav-reveal-after className="absolute left-1/2 top-0 h-px w-px" />
      <div className="works-heading px-4 pb-8 pt-10 lg:px-12 lg:pb-12 lg:pt-12">
        <Heading lines={worksSection.heading} />
      </div>
      <WorksShowcase />
    </section>
  );
}
