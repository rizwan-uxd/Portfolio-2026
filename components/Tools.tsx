import { toolsSection } from "@/lib/content";
import { ToolLogo } from "@/components/ToolLogos";

export function Tools() {
  const [lead, muted, tail] = toolsSection.heading;
  return (
    <section id="tools" aria-labelledby="tools-title" className="border-t border-hairline">
      <div className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <h2 id="tools-title" className="display">
          {lead} <span className="whitespace-nowrap text-muted-foreground">{muted}</span> <span className="lg:block">{tail}</span>
        </h2>
        <p className="text-muted-foreground lg:w-full lg:max-w-intro">{toolsSection.intro}</p>
      </div>
      <ul className="grid grid-cols-5 gap-x-2 gap-y-4 px-4 md:grid-cols-10 pb-12 lg:grid-cols-10 lg:gap-4 lg:px-12 lg:pb-16">
        {toolsSection.tools.map((name) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <span className="flex aspect-square w-full items-center justify-center rounded-lg border border-hairline bg-card text-foreground">
              <ToolLogo name={name} />
            </span>
            <span className="micro text-muted-foreground">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
