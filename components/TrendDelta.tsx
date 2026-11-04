"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "./CountUp";

// The rise behind a works metric (owner, 2026-11-04): a small tinted pill with an up-right arrow, after the growth
// pills in Searchable and Mintlify on Mobbin. It settles in (a short fade and 4px lift) as the value counts up,
// once, at the same point as the section reveals (--rise-margin); static for reduced motion.
const EASE = [0.16, 1, 0.3, 1] as const;

export function TrendDelta({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "1000000px 0px -35% 0px" }); // --rise-margin, open top as in CountUp
  const still = useReducedMotion();
  const shown = still || inView;

  return (
    <motion.span
      ref={ref}
      initial={still ? false : { opacity: 0, y: 4 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      className="label inline-flex items-center gap-1 rounded-full bg-[var(--delta-bg)] py-1 pl-2 pr-2.5 text-brand"
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-3">
        <path d="M7 17 17 7" /><path d="M8 7h9v9" />
      </svg>
      <CountUp value={value} />
    </motion.span>
  );
}
