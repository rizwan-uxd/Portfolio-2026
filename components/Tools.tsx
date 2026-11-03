import { toolsSection } from "@/lib/content";
import { ToolLogo } from "@/components/ToolLogos";
import { ToolsReveal } from "@/components/ToolsReveal";

type Step = React.CSSProperties & { "--i": number };

export function Tools() {
  const [lead, muted, tail] = toolsSection.heading;
  return (
    <ToolsReveal>
      <div data-reveal className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12 lg:pt-16">
        <h2 id="tools-title" className="display">
          <span className="tools-head inline-block" style={{ "--i": 0 } as Step}>{lead}</span>{" "}
          <span className="tools-head inline-block whitespace-nowrap text-muted-foreground" style={{ "--i": 1 } as Step}>{muted}</span>{" "}
          <span className="tools-head inline-block lg:block" style={{ "--i": 2 } as Step}>{tail}</span>
        </h2>
        <p className="tools-intro text-muted-foreground lg:w-full lg:max-w-intro">{toolsSection.intro}</p>
      </div>
      <ul data-reveal className="grid grid-cols-4 gap-x-2 gap-y-4 px-4 pb-12 md:grid-cols-8 lg:gap-4 lg:px-12 lg:pb-16">
        {toolsSection.tools.map((name, i) => (
          <li key={name} className="tools-tile flex flex-col items-center gap-2" style={{ "--i": i } as Step}>
            <span className="flex aspect-square w-full items-center justify-center rounded-lg border border-hairline bg-card text-foreground">
              <ToolLogo name={name} />
            </span>
            <span className="micro text-muted-foreground">{name}</span>
          </li>
        ))}
      </ul>
    </ToolsReveal>
  );
}
