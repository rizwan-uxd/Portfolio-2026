"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Feature, FeatureArt, IconItem } from "@/lib/case-studies";

// SecureLine overview cards and approach list (owner, 2026-11-04). Overview follows 21st.dev's "Feature" by moazamtrade: an
// illustration above each card's text that moves on hover. Approach follows prebuiltui's "Features section with credit card
// showcase": a visual on one side and a list on the other, where the chosen row is highlighted. Colours, type and radii are
// this site's tokens; motion only runs under motion-safe.

// Path data from Lucide (lucide.dev, ISC licence), inlined so no new dependency is needed.
const icons = {
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  layers: <><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  component: <><path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" /><path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z" /><path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z" /><path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" /></>,
  "user-check": <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  palette: <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z" /></>,
  braces: <><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /></>,
  "sun-moon": <><path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" /><path d="M12 2v2M12 20v2m-7.1-17.1 1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></>,
};
export type CaseIconName = keyof typeof icons;

function Icon({ name, className = "size-5" }: { name: CaseIconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
}

function IconChip({ name, active }: { name: CaseIconName; active?: boolean }) {
  return (
    <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${active ? "border-brand bg-brand text-brand-foreground" : "border-hairline bg-background text-brand group-hover:border-brand"}`}>
      <Icon name={name} />
    </span>
  );
}

const move = "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-[var(--ease-feature)]";

// Overview: one card per fact, its illustration on top.
export function FeatureCards({ items }: { items: Feature[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.label} tabIndex={0} className={`group flex flex-col gap-6 rounded-lg border border-hairline bg-card p-6 outline-none hover:border-brand/50 focus-visible:border-brand lg:p-8 ${move} motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1`}>
          <div className="relative flex h-[var(--case-feature-art-h)] items-center justify-center overflow-hidden rounded-md border border-hairline bg-background">
            <Art art={item.art} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <IconChip name={item.icon} />
              <p className="label">{item.label}</p>
            </div>
            <p className="text-muted-foreground">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Approach: the chosen step's visual beside the list of steps.
export function FeatureList({ items }: { items: Feature[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-12">
      <div className="relative min-h-[var(--case-feature-visual-h)] overflow-hidden rounded-lg border border-hairline bg-card">
        {items.map((item, i) => (
          <div key={item.label} aria-hidden={i !== active} className={`absolute inset-0 flex items-center justify-center p-6 ${move} ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            {item.image ? (
              <Image src={item.image.src} alt={item.image.alt} width={item.image.w} height={item.image.h} sizes="(min-width: 1024px) 560px, 90vw" className="h-auto max-h-full w-full rounded-md border border-hairline object-contain" />
            ) : (
              <Art art={item.art} on={i === active} points={item.points} />
            )}
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item.label}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:gap-6 lg:p-6 ${i === active ? "border-brand/60 bg-brand/5" : "border-transparent hover:border-hairline"}`}
            >
              <IconChip name={item.icon} active={i === active} />
              <span className="flex flex-col gap-2">
                <span className="label text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Illustrations, drawn with tokens. In cards they move on the card's hover; in the list, when their step is chosen (on).
function Art({ art, on, points }: { art: FeatureArt; on?: boolean; points?: string[] }) {
  if (art === "secure-chat") {
    // Messages travel inside a shield, which locks on hover.
    return (
      <div className="relative flex size-28 items-center justify-center">
        <svg aria-hidden viewBox="0 0 24 24" fill="none" strokeWidth={1} strokeLinejoin="round" className={`absolute inset-0 size-full stroke-hairline group-hover:stroke-brand ${move}`}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
        <div className="relative flex w-14 flex-col gap-1.5">
          <span className={`h-2.5 w-9 rounded-full bg-muted-foreground/40 ${move} -translate-x-3 group-hover:translate-x-0`} />
          <span className={`ml-auto h-2.5 w-10 rounded-full bg-brand/70 ${move} translate-x-3 group-hover:translate-x-0`} />
          <span className={`h-2.5 w-7 rounded-full bg-muted-foreground/40 ${move} delay-75 -translate-x-3 group-hover:translate-x-0`} />
        </div>
      </div>
    );
  }
  if (art === "one-app") {
    // Scattered people gather into one app.
    const dots = [
      ["-64px", "-34px"], ["58px", "-40px"], ["-52px", "36px"], ["66px", "30px"], ["4px", "-52px"],
    ];
    return (
      <div className="relative flex h-28 w-16 items-center justify-center rounded-xl border border-hairline group-hover:border-brand">
        {dots.map(([x, y], i) => (
          <span
            key={i}
            className={`absolute size-3 rounded-full bg-muted-foreground/50 group-hover:bg-brand ${move} [transform:translate(var(--fx),var(--fy))] group-hover:[transform:translate(0,var(--to-y))]`}
            style={{ ["--fx" as string]: x, ["--fy" as string]: y, ["--to-y" as string]: `${(i - 2) * 16}px`, transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    );
  }
  if (art === "legacy-layers") {
    // New designs settle onto the legacy framework.
    return (
      <div className="relative h-24 w-40">
        <span className="absolute inset-x-0 bottom-0 h-10 rounded-md border border-hairline bg-muted-foreground/15" />
        <span className="micro absolute bottom-3 left-3 text-muted-foreground">Legacy</span>
        <span className={`absolute inset-x-0 bottom-10 h-10 rounded-md border border-brand/70 bg-brand/10 ${move} -translate-y-4 group-hover:translate-y-0`} />
        <span className={`micro absolute bottom-[3.25rem] left-3 text-brand ${move} -translate-y-4 group-hover:translate-y-0`}>New</span>
      </div>
    );
  }
  if (art === "feature-checklist") {
    return (
      <div className="flex w-full max-w-[var(--case-feature-panel-w)] flex-col gap-3 rounded-lg border border-hairline bg-background p-5">
        <p className="micro text-muted-foreground">Essential features</p>
        <ul className="flex flex-col gap-2.5">
          {points?.map((point, i) => (
            <li key={point} className="flex items-center gap-3">
              <span className={`flex size-5 items-center justify-center rounded-sm border ${move} ${on ? "border-brand bg-brand text-brand-foreground" : "border-hairline text-transparent"}`} style={{ transitionDelay: on ? `${150 + i * 90}ms` : "0ms" }}>
                <Icon name="check" className="size-3.5" />
              </span>
              <span className={on ? "text-foreground" : "text-muted-foreground"}>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (art === "component-kit") {
    // Frequently used components come together into a screen.
    const parts = [
      <span key="bar" className="flex items-center gap-2"><span className="size-5 rounded-full bg-muted-foreground/40" /><span className="h-2 w-16 rounded-full bg-muted-foreground/40" /></span>,
      <span key="search" className="h-6 rounded-md border border-hairline" />,
      <span key="card" className="flex flex-col gap-1.5 rounded-md border border-hairline p-2"><span className="h-2 w-20 rounded-full bg-muted-foreground/40" /><span className="h-2 w-14 rounded-full bg-muted-foreground/25" /><span className="ml-auto h-3 w-10 rounded-full bg-brand/60" /></span>,
      <span key="bubble" className="ml-auto h-5 w-24 rounded-lg bg-brand/70" />,
      <span key="button" className="h-7 rounded-md bg-brand" />,
    ];
    return (
      <div className="flex h-full max-h-[var(--case-feature-visual-h)] w-[var(--case-feature-phone-w)] flex-col justify-center gap-3 rounded-2xl border border-hairline bg-background p-4">
        {parts.map((part, i) => (
          <div key={i} className={`flex flex-col ${move} ${on ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`} style={{ transitionDelay: on ? `${120 + i * 90}ms` : "0ms" }}>
            {part}
          </div>
        ))}
      </div>
    );
  }
  return <TestLoop on={on} />;
}

// Design, test, fix, around and around (owner, 2026-11-04): the dot turns the dashed track solid behind it and lights each
// step as it passes; when it gets back to Design the next round starts from a dashed track again.
const LOOP_MS = 6000;
const R = 76; // circle radius in the 200-unit viewBox
const C = 2 * Math.PI * R;
const steps = ["Design", "Test", "Fix"];

function TestLoop({ on }: { on?: boolean }) {
  const [p, setP] = useState(0); // 0..1 around the loop, starting at Design
  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setP(((now - start) % LOOP_MS) / LOOP_MS);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); setP(0); };
  }, [on]);
  const angle = p * 2 * Math.PI - Math.PI / 2;
  return (
    <div className="relative size-[var(--case-loop-size)]">
      <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" strokeWidth="1.5" strokeDasharray="4 5" className="stroke-hairline" />
        <circle cx="100" cy="100" r={R} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={`${p * C} ${C}`} className="stroke-brand" />
      </svg>
      <span
        aria-hidden
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_12px_var(--brand)]"
        style={{ left: `${50 + (R / 2) * Math.cos(angle)}%`, top: `${50 + (R / 2) * Math.sin(angle)}%` }}
      />
      {steps.map((step, i) => {
        const at = i / steps.length;
        const a = at * 2 * Math.PI - Math.PI / 2;
        const lit = on && p >= at;
        return (
          <span
            key={step}
            className={`micro absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 transition-colors duration-300 ${lit ? "border-brand bg-brand text-brand-foreground" : "border-hairline bg-card text-muted-foreground"}`}
            style={{ left: `${50 + (R / 2) * Math.cos(a)}%`, top: `${50 + (R / 2) * Math.sin(a)}%` }}
          >
            {step}
          </span>
        );
      })}
    </div>
  );
}

// A row of facts with icons, full width under the header (2 x 2 below lg), after 21st.dev's "Feature Section" by ravikatiyar162 (owner, 2026-11-04).
export function IconGrid({ items }: { items: IconItem[] }) {
  return (
    <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label} className={`group flex flex-col gap-4 rounded-lg border border-hairline bg-card p-5 hover:border-brand/50 lg:p-6 ${move}`}>
          <IconChip name={item.icon} />
          <p className="label">{item.label}</p>
          <p className="text-muted-foreground">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
