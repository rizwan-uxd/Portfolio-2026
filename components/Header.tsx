"use client";

import { useEffect, useState } from "react";
import { person } from "@/lib/content";

const links = [
  { href: "#works", label: "Works" },
  { href: "#ai-projects", label: "AI projects" },
  { href: "#about", label: "About" },
];

// The R channel is filled by a thick stroke at first; on load the stroke retracts along the letter
// so the R reads as drawn (Figma 3:39, "R — draw reveal"). The floating bar shows the end state only.
function Logo({ draw = false, compact = false }: { draw?: boolean; compact?: boolean }) {
  return (
    <span className={compact ? "logo logo-compact" : "logo"}>
      <img src="/figma/logo-subtract.svg" alt="" className="absolute inset-0 block size-full" />
      {draw && (
        <svg viewBox="0 0 25.3013 29.28" fill="none" aria-hidden className="logo-r logo-draw">
          <path
            d="M4 25.28V4H13.6533C16.6933 4 18.72 5.9 18.72 8.8C18.72 11.52 16.8533 12.6933 14.5067 13.7067C12.3733 14.6667 11.2 15.7867 11.2 17.8133C11.2 20.96 15.68 22.6933 21.0133 23.0933"
            pathLength={1}
            stroke="currentColor"
            strokeWidth={8}
            strokeLinecap="square"
          />
        </svg>
      )}
    </span>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Star-border glow at rest, interactive-hover fill on hover (animations.md).
function GlowButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="glow-btn group relative flex shrink-0 items-center justify-center overflow-clip rounded-full bg-hairline p-px shadow-glow">
      <img src="/figma/glow.svg" alt="" className="glow-br" />
      <img src="/figma/glow.svg" alt="" className="glow-tl" />
      <span className="glow-label relative flex items-center justify-center overflow-clip rounded-full bg-card px-4 py-1 text-foreground">
        <span aria-hidden className="glow-dot" />
        <span className="glow-text">{children}</span>
        <span aria-hidden className="glow-hover">
          {children}
          <Arrow />
        </span>
      </span>
    </a>
  );
}

function MenuButton() {
  // The menu sheet isn't designed yet (components.md). When it is, keep the header visible while it's open.
  return (
    <button type="button" disabled aria-label="Menu" className="flex size-10 shrink-0 flex-col items-center justify-center gap-menu-bar rounded-btn border border-hairline md:hidden">
      <span className="h-0.5 w-4 bg-foreground" />
      <span className="h-0.5 w-4 bg-foreground" />
    </button>
  );
}

function Nav() {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-nav md:flex">
      {links.map((l) => (
        <a key={l.href} href={l.href} className="nav-link p-2">
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export function Header() {
  // Full-bleed header at the top; the floating bar takes over once the hero CTA has scrolled out above.
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const anchor = document.querySelector("[data-nav-reveal-after]");
    if (!anchor) return;
    const io = new IntersectionObserver(([e]) => setFloating(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 md:pt-6">
        <div className="mx-auto flex max-w-header items-center justify-between p-4 md:px-8 md:pb-6 md:pt-2">
          <a href="#top" aria-label={person.name}>
            <Logo draw />
          </a>
          <div className="flex items-center gap-2 md:gap-nav">
            <Nav />
            <GlowButton href={person.linkedin}>Linkedin</GlowButton>
            <MenuButton />
          </div>
        </div>
      </header>

      <div aria-hidden data-shown={floating} className="nav-veil" />
      <div data-shown={floating} inert={!floating} className="nav-float">
        <div className="flex w-full items-center justify-between gap-4 rounded-full border border-hairline bg-card/70 p-2 pl-3 shadow-pill backdrop-blur-md backdrop-saturate-150 md:w-auto md:gap-10 md:pl-4">
          <a href="#top" aria-label={person.name}>
            <Logo compact />
          </a>
          <div className="flex items-center gap-2 md:gap-nav">
            <Nav />
            <GlowButton href={person.linkedin}>Linkedin</GlowButton>
            <MenuButton />
          </div>
        </div>
      </div>
    </>
  );
}
