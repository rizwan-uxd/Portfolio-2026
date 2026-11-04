"use client";

import { useEffect, useRef, type ReactNode } from "react";

const ramp = (from: number, to: number, x: number) => Math.min(Math.max((x - from) / (to - from), 0), 1);

// The page scrolls normally the whole way, so the horizon rises 1:1 with the wheel. Over that travel the hero
// scales into the rim, the Selected works heading grows in and rides up with it, its list follows, and the
// globe's edge flattens until it fills the screen (animations.md). This only publishes the progress, in
// straight lines against scroll position; app/tokens.css does the rest.
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    const works = stage?.querySelector<HTMLElement>("#works");
    if (!stage || !works) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (motion.matches) {
        stage.removeAttribute("data-covered");
        return;
      }
      const css = getComputedStyle(stage);
      const travel = works.getBoundingClientRect().top + scrollY;
      const p = travel > 0 ? Math.min(Math.max(scrollY, 0) / travel, 1) : 1;

      const endScale = parseFloat(css.getPropertyValue("--hero-end-scale"));
      stage.style.setProperty("--hero-scale", String(1 - (1 - endScale) * p));
      stage.style.setProperty("--hero-fade", String(1 - ramp(0.3, 0.85, p)));
      stage.style.setProperty("--works-heading-in", String(ramp(0.33, 0.8, p)));
      stage.style.setProperty("--works-list-in", String(ramp(0.4, 0.7, p)));

      stage.style.setProperty("--hero-p", String(p));
      stage.style.setProperty("--hero-ease", String(p));
      const radius = parseFloat(css.getPropertyValue("--horizon-radius")) * stage.clientWidth;
      works.style.setProperty("--r", `${radius / Math.max(1 - p, 0.001)}px`);
      stage.toggleAttribute("data-covered", p >= 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const sizes = new ResizeObserver(schedule);
    sizes.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      sizes.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="hero-stage">
      {children}
    </div>
  );
}
