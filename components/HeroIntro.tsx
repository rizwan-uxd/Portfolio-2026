"use client";

import { useEffect, useRef, useState } from "react";
import { hero } from "@/lib/content";

const FLAG_SLICES = 10;
const { greeting, lead, place } = hero.intro;
const afterGreeting = greeting.length;
const afterLead = afterGreeting + lead.length;
const total = afterLead + place.length;

const Typed = ({ text, count, cursor }: { text: string; count: number; cursor: boolean }) => (
  <>
    {text.slice(0, Math.max(count, 0))}
    {cursor && <span className="hero-intro-cursor" />}
    <span className="invisible">{text.slice(Math.max(count, 0))}</span>
  </>
);

// Plays once on load and quickly, because it must not compete with the headline: types the greeting, a hand
// waves, types the name, the UAE flag waves, then types the place (animations.md). Untyped text stays in the
// line, invisible, so the centred line doesn't shift as it grows.
export function HeroIntro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      setDone(true);
      return;
    }
    const css = getComputedStyle(ref.current!);
    const token = (name: string) => parseFloat(css.getPropertyValue(name));
    let timer = 0;
    const wait = (ms: number) => new Promise((resolve) => { timer = window.setTimeout(resolve, ms); });
    let cancelled = false;

    (async () => {
      await wait(token("--intro-delay"));
      for (let i = 1; i <= total && !cancelled; i++) {
        setTyped(i);
        await wait(token("--intro-char"));
        if (i === afterGreeting || i === afterLead) await wait(token("--intro-mark-pause"));
      }
      await wait(token("--intro-cursor-hold"));
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setTyped(0);
      setDone(false);
    };
  }, []);

  const handIn = typed >= afterGreeting;
  const flagIn = typed >= afterLead;

  return (
    <p ref={ref} className="hero-intro text-muted-foreground">
      <span className="sr-only">{`${greeting} ${lead} ${place}`}</span>
      <span aria-hidden>
        <Typed text={greeting} count={typed} cursor={!handIn} />
        <span className={`hero-hand${handIn ? " hero-mark-in" : ""}`}>👋</span>
        <Typed text={lead} count={typed - afterGreeting} cursor={handIn && !flagIn} />
        <span className={`hero-flag${flagIn ? " hero-mark-in" : ""}`}>
          {Array.from({ length: FLAG_SLICES }, (_, i) => (
            <span key={i} className="hero-flag-slice" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
        <Typed text={place} count={typed - afterLead} cursor={flagIn && !done} />
      </span>
    </p>
  );
}
