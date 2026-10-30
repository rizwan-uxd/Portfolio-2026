"use client";

import { useEffect, useState } from "react";
import { person } from "@/lib/content";

const HIDE_AFTER = 80; // px scrolled before the header may hide
const IDLE_MS = 150; // scroll pause that brings it back

const links = [
  { href: "#works", label: "Works" },
  { href: "#ai-projects", label: "AI projects" },
  { href: "#about", label: "About" },
];

function Logo() {
  return (
    <span className="logo">
      <img src="/figma/logo-subtract.svg" alt="" className="absolute inset-0 block size-full" />
      <img src="/figma/logo-r-stroke.svg" alt="" className="logo-r block" />
    </span>
  );
}

function GlowButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="relative flex shrink-0 items-center justify-center overflow-clip rounded-full bg-hairline p-px shadow-glow">
      <img src="/figma/glow.svg" alt="" className="glow-br" />
      <img src="/figma/glow.svg" alt="" className="glow-tl" />
      <span className="glow-label relative flex items-center justify-center overflow-clip rounded-full bg-card px-4 py-1 text-foreground">
        {children}
      </span>
    </a>
  );
}

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      setHidden(y > HIDE_AFTER && y > lastY);
      lastY = y;
      clearTimeout(idle);
      idle = setTimeout(() => setHidden(false), IDLE_MS);
    };
    setScrolled(lastY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      data-hidden={hidden && !keyboardFocus}
      data-scrolled={scrolled}
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}
      className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent data-[scrolled=true]:border-hairline data-[scrolled=true]:bg-background/80 data-[scrolled=true]:backdrop-blur md:pt-6"
    >
      <div className="mx-auto flex max-w-header items-center justify-between p-4 md:px-8 md:pb-6 md:pt-2">
        <a href="#top" aria-label={person.name}>
          <Logo />
        </a>
        <div className="flex items-center gap-2 md:gap-nav">
          <nav aria-label="Primary" className="hidden items-center gap-nav md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link p-2">
                {l.label}
              </a>
            ))}
          </nav>
          <GlowButton href={person.linkedin}>Linkedin</GlowButton>
          {/* The menu sheet isn't designed yet (components.md). When it is, keep the header visible while it's open. */}
          <button type="button" disabled aria-label="Menu" className="flex size-10 shrink-0 flex-col items-center justify-center gap-menu-bar rounded-btn border border-hairline md:hidden">
            <span className="h-0.5 w-4 bg-foreground" />
            <span className="h-0.5 w-4 bg-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
