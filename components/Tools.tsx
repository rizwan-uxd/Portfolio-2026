import { toolsSection } from "@/lib/content";
import { ToolCoins } from "@/components/ToolCoins";
import { ToolsReveal } from "@/components/ToolsReveal";

type Step = React.CSSProperties & { "--i": number };

export function Tools() {
  const [lead, muted, tail] = toolsSection.heading;
  // Desktop: the heading is two lines (lead and muted, then tail) with the intro below it in two lines (owner, 2026-11-03).
  return (
    <ToolsReveal>
      <div data-reveal className="flex flex-col gap-4 px-4 pb-8 pt-12 lg:gap-6 lg:px-12 lg:pb-4 lg:pt-16">
        <h2 id="tools-title" className="display">
          <span className="tools-head inline-block" style={{ "--i": 0 } as Step}>{lead}</span>{" "}
          <span className="tools-head inline-block whitespace-nowrap text-muted-foreground" style={{ "--i": 1 } as Step}>{muted}</span>{" "}
          <span className="tools-head inline-block lg:block" style={{ "--i": 2 } as Step}>{tail}</span>
        </h2>
        <p className="tools-intro text-muted-foreground lg:max-w-tools-intro">{toolsSection.intro}</p>
      </div>
      <ToolCoins />
    </ToolsReveal>
  );
}
