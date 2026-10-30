import { services, servicesSection } from "@/lib/content";
import { AiTwinBar } from "@/components/AiTwinBar";

// Figma fades the bullet list top to bottom
const fade = ["text-foreground", "text-foreground", "text-muted-foreground/70", "text-muted-foreground/40"];

export function Services() {
  return (
    <section id="services" className="border-t border-hairline">
      <div className="flex flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between md:px-12 md:py-16">
        <h2 className="display">
          {servicesSection.heading[0]}
          <br />
          <span className="text-muted-foreground">{servicesSection.heading[1]}</span>
        </h2>
        <p className="max-w-[420px] text-muted-foreground md:pt-0">{servicesSection.intro}</p>
      </div>

      <div className="grid border-t border-hairline md:grid-cols-2">
        {services.map((s, i) => (
          <div
            key={s.title}
            className={`p-6 md:p-8 ${i % 2 === 0 ? "md:border-r md:border-hairline" : ""} ${i > 0 ? "border-t border-hairline" : ""} ${i === 1 ? "md:border-t-0" : ""}`}
          >
            <h3 className="title text-[28px] md:text-[32px]">{s.title}</h3>
            <p className="mt-4 text-muted-foreground">{s.description}</p>
            <ul className="mt-6 rounded-lg border border-border bg-card px-4 py-2" aria-label={`${s.title} focus areas`}>
              {s.items.map((item, j) => (
                <li key={item} className={`px-1 py-4 ${j > 0 ? "border-t border-border" : ""} ${fade[j]}`}>
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
