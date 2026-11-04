import { services, servicesSection } from "@/lib/content";
import { Heading } from "@/components/SectionHeading";
import { ServiceBox } from "@/components/ServiceBox";
import { ServiceAnimation, type ServiceScene } from "@/components/ServiceAnimation";
import { serviceDiagrams } from "@/components/ServiceDiagrams";

const scenes = ["growth", "research", "interaction", "conversational", "prototyping", "tokenOps"] as const satisfies readonly ServiceScene[];

export function Services() {
  return (
    <section id="services" className="border-t border-hairline">
      {/* Stacked like AI projects: a five-line intro beside the heading pushed the heading down (owner, 2026-11-03) */}
      <div data-rise className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:px-12 lg:pb-12 lg:pt-16">
        <Heading lines={servicesSection.heading} />
        <p className="rise-head max-w-[var(--case-subtitle-w)] text-muted-foreground lg:max-w-[var(--services-intro-w)]" style={{ "--i": 2 } as React.CSSProperties}>{servicesSection.intro}</p>
      </div>
      <div className="grid lg:grid-cols-2">
        {services.map((s, i) => {
          const Diagram = serviceDiagrams[i];
          return (
            // Each box reveals as it enters; the right box of a row follows the left (animations.md). The hairlines stay put.
            <ServiceBox key={s.title} className={`flex flex-col gap-4 border-t border-hairline px-4 py-6 lg:p-8 ${i % 2 === 0 ? "lg:border-r" : "lg:[--rise-at:90ms]"}`}>
              <h3 className="rise-card title" style={{ "--i": 0 } as React.CSSProperties}>{s.title}</h3>
              <p className="rise-card text-muted-foreground lg:min-h-[3lh]" style={{ "--i": 1 } as React.CSSProperties}>{s.description}</p>
              <div className="rise-card flex items-center justify-center lg:h-visual" style={{ "--i": 2 } as React.CSSProperties}>
                <ServiceAnimation scene={scenes[i]} title={s.title}><Diagram /></ServiceAnimation>
              </div>
            </ServiceBox>
          );
        })}
      </div>
    </section>
  );
}
