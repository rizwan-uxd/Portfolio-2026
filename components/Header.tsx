import { person } from "@/lib/content";

const links = [
  { href: "#works", label: "Works" },
  { href: "#ai-projects", label: "AI projects" },
  { href: "#about", label: "About" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 bg-background/80 backdrop-blur md:h-20">
      <div className="mx-auto flex h-full max-w-[1214px] items-center justify-between px-4 md:px-8">
        <a href="#top" aria-label={person.name} className="label tracking-tight">
          {person.name}
        </a>
        <div className="flex items-center gap-8">
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={person.linkedin}
            className="inline-flex h-9 items-center rounded-full border border-hairline px-4 text-sm text-foreground shadow-[0_0_20px_rgb(229_255_93/.12)]"
          >
            Linkedin
          </a>
        </div>
      </div>
    </header>
  );
}
