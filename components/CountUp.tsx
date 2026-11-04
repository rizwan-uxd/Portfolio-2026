"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

// Stat count-up (owner, 2026-11-03), after the 21st.dev Count Animation (bundui): a 2s tween from 0 to the value.
// Plays once, at the same point as the section reveals (--rise-margin), and keeps the text around the number, so
// "+25%" counts 0 → 25 between "+" and "%". The final text renders first and stays for no-JS and reduced motion.
// A hidden copy of the final text holds the width, so the line doesn't reflow while the digits change.
const DURATION = 2;
const EASE = [0.16, 1, 0.3, 1] as const; // ease-out: quick start, slow settle on the real value

const parse = (text: string) => {
  const m = text.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const digits = m[2].replace(/,/g, "");
  return { prefix: m[1], value: Number(digits), decimals: digits.split(".")[1]?.length ?? 0, grouped: m[2].includes(","), suffix: m[3] };
};

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const stat = parse(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !stat || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const format = (n: number) =>
      stat.prefix + n.toLocaleString("en-US", { minimumFractionDigits: stat.decimals, maximumFractionDigits: stat.decimals, useGrouping: stat.grouped }) + stat.suffix;
    el.textContent = format(0);
    let stop: (() => void) | undefined;
    const margin = getComputedStyle(document.documentElement).getPropertyValue("--rise-margin").trim() || "-35%";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        stop = animate(0, stat.value, { duration: DURATION, ease: EASE, onUpdate: (n) => { el.textContent = format(n); } }).stop;
      },
      { rootMargin: `1000000px 0px ${margin} 0px` }, // open top, as ScrollReveal: a jump past the stat still plays it
    );
    io.observe(el);
    return () => { io.disconnect(); stop?.(); el.textContent = value; };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps -- stat is derived from value

  if (!stat) return <span className={className}>{value}</span>;
  return (
    <span className={`inline-grid tabular-nums ${className ?? ""}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1">{value}</span>
      <span ref={ref} aria-hidden className="col-start-1 row-start-1">{value}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
