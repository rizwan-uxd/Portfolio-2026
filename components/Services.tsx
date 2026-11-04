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
              <p className="text-muted-foreground">{s.description}</p>
              <div className="grid rounded-lg border border-hairline bg-card sm:grid-cols-[1.25fr_1fr] lg:h-visual lg:border-border">
                <div className="flex min-w-0 items-center justify-center p-2">
                  <Diagram />
                </div>
                <ul className="service-bullets flex flex-col justify-center gap-3 border-t border-hairline p-4 sm:border-t-0 sm:border-l lg:border-border">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </ServiceBox>
          );
        })}
      </div>
    </section>
  );
}
