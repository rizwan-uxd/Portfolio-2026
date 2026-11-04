"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Showcase } from "@/lib/case-studies";

// Rotating key screens (owner, 2026-11-04): tabs over one card, the screen on the left and its description on the right,
// laid out after the live site's AI Banking Copilot workflows. Tabs advance on their own while the card is in view; hovering
// or focusing pauses them, choosing a tab stops them, and reduced motion never starts them. Dark / Light swaps the theme.

const DWELL = 6000; // ms per screen

export function ScreenShowcase({ items }: { items: Showcase[] }) {
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState(0); // 0..1 through the active screen's dwell
  const progressRef = useRef(0);
  const [stopped, setStopped] = useState(false); // a tab was chosen, or reduced motion is on
  const [held, setHeld] = useState(false); // hover or focus inside
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setStopped(true);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !stopped && !held && inView;
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let p = progressRef.current;
    const tick = (now: number) => {
      p += (now - last) / DWELL;
      last = now;
      if (p >= 1) {
        p = 0;
        setActive((a) => (a + 1) % items.length);
      }
      progressRef.current = p;
      setProgress(p);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, items.length]);

  const choose = (i: number) => {
    setActive(i);
    progressRef.current = 0;
    setProgress(0);
    setStopped(true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + items.length) % items.length;
    choose(i);
    tabs.current[i]?.focus();
  };
  const item = items[active];

  return (
    <div
      ref={root}
      className="flex w-full flex-col gap-4 lg:gap-6"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
    >
      <div role="tablist" aria-label="Key screens" onKeyDown={onKey} className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
        {items.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`showcase-tab-${i}`}
            aria-selected={i === active}
            aria-controls="showcase-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => choose(i)}
            className={`micro relative shrink-0 overflow-hidden rounded-full border px-4 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:px-5 ${i === active ? "border-brand text-foreground" : "border-hairline text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
            {i === active && !stopped && (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} />
            )}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="showcase-panel"
        aria-labelledby={`showcase-tab-${active}`}
        className="flex flex-col gap-8 rounded-lg border border-hairline bg-card p-4 lg:grid lg:grid-cols-[var(--case-showcase-phone-w)_minmax(0,1fr)] lg:gap-16 lg:p-12"
      >
        <div className="mx-auto flex w-full max-w-[var(--case-showcase-phone-w-sm)] flex-col lg:max-w-[var(--case-showcase-phone-w)] items-center gap-6">
          <ThemeSwitch theme={theme} onChange={setTheme} />
          <div className="relative w-full overflow-hidden rounded-[var(--case-proto-radius)] border border-border bg-background" style={{ aspectRatio: `${item.dark.w} / ${item.dark.h}` }}>
            {items.map((screen, i) =>
              (["dark", "light"] as const).map((t) => {
                const figure = screen[t];
                const shown = i === active && t === theme;
                return (
                  <Image
                    key={figure.src}
                    src={figure.src}
                    alt={shown ? figure.alt : ""}
                    aria-hidden={!shown}
                    fill
                    sizes="(min-width: 1024px) 320px, 80vw"
                    className={`object-cover motion-safe:transition-opacity motion-safe:duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
                  />
                );
              }),
            )}
          </div>
        </div>

        {/* The counter sits level with the theme switch, so the text starts level with the top of the screen (owner, 2026-11-04). */}
        <div className="flex flex-col gap-6">
          <p className="micro hidden h-[var(--theme-switch-h)] items-center justify-end text-muted-foreground lg:flex">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p>
          <p className="subtitle">{item.lead}</p>
          <ul className="flex list-disc flex-col gap-3 pl-5 text-muted-foreground marker:text-brand">
            {item.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// After 21st.dev's Cinematic Theme Switcher (owner, 2026-11-04), in this site's colours: a recessed track with a sun and a
// moon at its ends, and a lime knob that springs across with a little overshoot while its icon turns into the other one.
function ThemeSwitch({ theme, onChange }: { theme: "dark" | "light"; onChange: (t: "dark" | "light") => void }) {
  const light = theme === "light";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      onClick={() => onChange(light ? "dark" : "light")}
      className="relative flex h-[var(--theme-switch-h)] w-[var(--theme-switch-w)] shrink-0 items-center rounded-full border border-hairline bg-background p-[var(--theme-switch-pad)] shadow-[var(--theme-switch-inset)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span aria-hidden className="absolute inset-0 flex items-center justify-between px-[var(--theme-switch-icon-inset)] text-muted-foreground">
        <MoonIcon />
        <SunIcon />
      </span>
      <span
        aria-hidden
        className="relative z-10 flex size-[var(--theme-switch-knob)] items-center justify-center rounded-full bg-brand text-brand-foreground shadow-[var(--theme-switch-knob-shadow)] motion-safe:transition-transform motion-safe:duration-[var(--theme-switch-duration)] motion-safe:ease-[var(--theme-switch-ease)]"
        style={{ transform: light ? "translateX(var(--theme-switch-travel))" : "none" }}
      >
        <span className={`absolute motion-safe:transition-all motion-safe:duration-[var(--theme-switch-duration)] ${light ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}><MoonIcon /></span>
        <span className={`absolute motion-safe:transition-all motion-safe:duration-[var(--theme-switch-duration)] ${light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}><SunIcon /></span>
      </span>
    </button>
  );
}

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "size-[var(--theme-switch-icon)]" };
function SunIcon() {
  return <svg {...iconProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>;
}
function MoonIcon() {
  return <svg {...iconProps}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
}
