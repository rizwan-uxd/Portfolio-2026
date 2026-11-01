"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectPreview } from "@/components/preview/project-preview";
import type { Work } from "@/lib/content";

// Scenes are authored at one fixed canvas: 1120 x 480 (21:9) or 560 x 420 (4:3), see components/preview/project-preview.tsx.
const shape: Record<string, { variant: "featured" | "grid"; ratio: number }> = {
  "hajj-operations-platform": { variant: "featured", ratio: 21 / 9 },
  "dubainow-mobile-app": { variant: "featured", ratio: 21 / 9 },
  "secure-communication-app": { variant: "grid", ratio: 4 / 3 },
  "emirates-islamic-digital-ux": { variant: "grid", ratio: 4 / 3 },
};

// Plays by default while the card is in view, no hover needed, as on poulo.site (owner, 2026-11-01; replaces hover-to-play).
// Out of view it pauses, so only the previews on screen run.
export function WorkPreview({ work }: { work: Work }) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const spec = shape[work.slug];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!spec) return null;
  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${work.title} preview`}
      className="works-demo relative overflow-hidden rounded-lg border border-border bg-card"
      style={{ aspectRatio: spec.ratio, "--demo-ratio": spec.ratio } as React.CSSProperties}
    >
      <ProjectPreview slug={work.slug} variant={spec.variant} playing={playing} poster={work.screens[0].src} alt={work.screens[0].alt} sizes="(min-width: 1024px) 760px, 100vw" />
    </div>
  );
}
