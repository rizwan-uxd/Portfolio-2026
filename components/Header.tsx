import { person } from "@/lib/content";

const links = [
  { href: "#works", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#graph", label: "Graph" },
  { href: "#testimonials", label: "Clients" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1214px] items-center justify-between px-4 md:px-8">
        <a href="#top" className="label tracking-tight">{person.name}</a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="label text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={person.calendly}
          className="label inline-flex h-9 items-center rounded-btn bg-brand px-4 text-brand-foreground shadow-[0_0_24px_rgb(229_255_93/.25)] md:h-10"
        >
          Let&apos;s connect
        </a>
      </div>
    </header>
  );
}
