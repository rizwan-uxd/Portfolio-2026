// Dotted arrow in a round badge, the icon of every CTA on the site (owner, 2026-11-01, after the dotted "Learn more"
// icon on poulo.site). The direction follows the arrow the CTA used before: up-right opens a page or another site,
// right moves forward, left goes back, down scrolls, up returns to the top.
// Hover on the parent link or button (owner, 2026-11-03): the dots light up from tail to head in a loop. The CSS lives
// with .cta-arrow in globals.css.
import type { CSSProperties } from "react";

type Direction = "up-right" | "right" | "left" | "down" | "up";

const upRight = [[6, 18], [9, 15], [12, 12], [15, 9], [18, 6], [14, 6], [10, 6], [18, 10], [18, 14]];
const right = [[4, 12], [8, 12], [12, 12], [16, 12], [20, 12], [17, 9], [14, 6], [17, 15], [14, 18]];
// run: the way the arrow points, before the turn. Each dot's distance along it sets its place in the wave.
const shapes: Record<Direction, { dots: number[][]; turn: number; run: [number, number] }> = {
  "up-right": { dots: upRight, turn: 0, run: [1, -1] },
  right: { dots: right, turn: 0, run: [1, 0] },
  down: { dots: right, turn: 90, run: [1, 0] },
  left: { dots: right, turn: 180, run: [1, 0] },
  up: { dots: right, turn: 270, run: [1, 0] },
};

export function DottedArrow({ direction = "up-right", tone = "brand", size = "md" }: {
  direction?: Direction;
  tone?: "brand" | "outline"; // brand: on a lime button. outline: on a hairline button.
  size?: "sm" | "md";
}) {
  const { dots, turn, run } = shapes[direction];
  const lead = dots.map(([x, y]) => x * run[0] + y * run[1]);
  const min = Math.min(...lead);
  const step = (i: number) => ({ "--i": Math.round((lead[i] - min) / 3) }) as CSSProperties;
  return (
    <span
      aria-hidden
      data-tone={tone}
      className={`cta-arrow inline-flex shrink-0 items-center justify-center rounded-full ${size === "sm" ? "size-6" : "size-8"} ${tone === "brand" ? "bg-brand-foreground text-brand" : "bg-brand text-brand-foreground"}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={size === "sm" ? "size-4" : "size-5"}>
        <g transform={`rotate(${turn} 12 12)`}>
          {dots.map(([x, y], i) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} style={step(i)} />)}
        </g>
      </svg>
    </span>
  );
}
