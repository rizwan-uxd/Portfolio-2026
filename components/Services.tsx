import { services, servicesSection } from "@/lib/content";
import { AiTwinBar } from "@/components/AiTwinBar";
import { Heading } from "@/components/SectionHeading";

const fade = ["", "", "lg:opacity-55", "lg:opacity-30"]; // desktop list fades out, mobile doesn't

export function Services() {
  return (
    <section id="services" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={servicesSection.heading} />
        <p className="text-muted-foreground lg:w-full lg:max-w-intro">{servicesSection.intro}</p>
      </div>
      <div className="grid lg:grid-cols-2">
        {services.map((s, i) => (
          <div key={s.title} className={`flex flex-col gap-4 border-t border-hairline px-4 py-6 lg:p-8 ${i % 2 === 0 ? "lg:border-r" : ""}`}>
            <h3 className="title">{s.title}</h3>
            <p className="text-muted-foreground">{s.description}</p>
            <ul className="rounded-lg border border-hairline bg-card lg:h-visual lg:overflow-clip lg:border-border lg:px-4 lg:py-2">
              {s.items.map((item, j) => (
                <li key={item} className={`border-hairline px-4 py-3 not-first:border-t lg:px-0 lg:py-4 lg:not-first:border-t-0 lg:not-last:border-b ${fade[j]}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <AiTwinBar />
    </section>
  );
}
