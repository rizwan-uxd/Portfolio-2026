import { services, servicesSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";
import { ServiceBox } from "@/components/ServiceBox";
import { serviceDiagrams } from "@/components/ServiceDiagrams";

export function Services() {
  return (
    <section id="services" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={servicesSection.heading} />
        <p className="text-muted-foreground lg:w-full lg:max-w-intro">{servicesSection.intro}</p>
      </div>
      <div className="grid lg:grid-cols-2">
        {services.map((s, i) => {
          const Diagram = serviceDiagrams[i];
          return (
            <ServiceBox key={s.title} className={`flex flex-col gap-4 border-t border-hairline px-4 py-6 lg:p-8 ${i % 2 === 0 ? "lg:border-r" : ""}`}>
              <h3 className="title">{s.title}</h3>
              <p className="text-muted-foreground lg:min-h-[3lh]">{s.description}</p>
              <div className="flex items-center justify-center lg:h-visual">
                <Diagram />
              </div>
            </ServiceBox>
          );
        })}
      </div>
    </section>
  );
}
