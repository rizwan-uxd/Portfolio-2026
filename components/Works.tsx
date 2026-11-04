import { worksSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";
import { WorksList } from "@/components/WorksList";

export function Works() {
  return (
    <section id="works" className="works-card">
      <span aria-hidden className="works-cap" />
      <span aria-hidden data-nav-reveal-after className="absolute left-1/2 top-0 h-px w-px" />
      <div className="works-heading px-4 pb-8 pt-12 lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={worksSection.heading} />
      </div>
      <WorksList />
    </section>
  );
}
