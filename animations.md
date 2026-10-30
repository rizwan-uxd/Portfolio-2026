# Animations

Rule: respect `prefers-reduced-motion` for everything below.

## Decided
- Works panel switch: 200ms opacity crossfade (`.works-panel` in globals.css).
- Header (owner, 2026-10-30, follows surinder.design's behaviour; motion only, our colours). Supersedes the earlier hide-on-scroll-down spec. `components/Header.tsx`, `.nav-float` / `.nav-veil` in `app/tokens.css`:
  - At the top: the full-bleed header from Figma `3:33`, absolutely positioned, so it scrolls away with the page.
  - Once the hero CTA (`data-nav-reveal-after`) has scrolled out above the viewport, a floating bar slides down from above: centred pill (full width minus 16px gutters on mobile), glass card fill, hairline border, soft shadow, 24px from the top (12px on mobile). It hides again when the CTA comes back into view.
  - 300ms translateY(-140% to 0) with `cubic-bezier(0.2, 0.8, 0.2, 1)` plus an opacity fade.
  - A 120px blur veil fades in behind the bar so content softens under it (hidden under `prefers-reduced-transparency`).
  - The hidden bar is `inert`, so it is never in the tab order. Same bar on all breakpoints (surinder.design hides its mobile bar on scroll down instead; we kept one behaviour).
  - Reduced motion: 200ms opacity only, no slide.
  - Floating bar logo is 32px on desktop and 24px on mobile (owner, 2026-10-30).
  - The floating bar's pill shape and shadow are not in Figma; built from existing tokens.
- Logo R draw (owner, 2026-10-30, Figma `3:39` motion): plays once on load. The R channel starts filled by a thick lime stroke, which retracts along the letter from the stem foot to the leg tip, revealing the R as a drawn line. Figma timeline: 2s, stroke retracts 0.15s to 1.35s linear, then hidden. We play it once instead of looping. Only the full-bleed header animates; the floating bar shows the end state. Reduced motion: end state, no animation.
- Linkedin button (owner, 2026-10-30):
  - Rest: React Bits "star border" motion. The two Figma glows travel along the bottom (right to left) and top (left to right) edges and fade, 6s linear, infinite, alternate.
  - Hover (pointer devices) and keyboard focus: Magic UI "interactive hover button" motion. A small lime dot at the left grows to fill the pill, the label slides right and fades, and "Linkedin →" slides in centred in brand-foreground. 300ms ease. The dot is hidden at rest because Figma's default has no dot.
  - Reduced motion: no glow travel, state swaps instantly.

- Nav links Works / AI projects / About (owner, 2026-10-30, surinder.design): on hover and keyboard focus a soft pill (foreground at 8%) fades in behind the link and the text brightens to foreground, 200ms ease. Links are `px-3 py-1` pills (36px tall) with a 28px gap and a -4px right margin on the nav, so the labels stay exactly where Figma puts them. Same in the full-bleed header and the floating bar. Reduced motion: instant.

- Brands carousel (owner, 2026-10-30, follows poulo.site's logo carousel; motion only, our colours; title "Led Impactful initiatives for", owner's capitalisation). `components/Brands.tsx`, `.brands-*` in `app/tokens.css`:
  - Circles ride a shallow arc and move right to left at a constant 0.35 items per second, so one loop of 8 takes about 23s. Linear, no stops.
  - Position `p` is the item's distance from the centre in items. Scale is `0.55 + 0.15 x |p|`, so the smallest circle is in the centre. In circle sizes, `x = 2.29 x tan(0.296 x p)` and `y = 0.175 - x^2 / 22.5`. Items wrap off-screen at `p = 4`. These numbers are fitted to measurements of the reference.
  - Hover pauses it and it resumes on leave. Drag moves it (no momentum). Left and right arrow keys move one item when focused, 1.2s.
  - Circle size is 13.35% of the panel width at `lg:` and up, and 21% below it (owner, 2026-10-30: 0.75x of the first pass, which used the reference's 17.8% and 28%). Larger below `lg:` so the wordmarks stay legible.
  - Reduced motion: no auto-scroll or arc, a static row that scrolls sideways, so all 8 logos can be reached.

## Not decided (ask before building)
- Hero dot-matrix / ASCII background motion.
- Scroll reveals and section entrance animations.
- Hover/focus/pressed states for everything except the header Linkedin button and nav links.
- Knowledge graph: node hover, selection transitions, drag and zoom feel, tour.
- AI twin: expand/collapse transition into the chat (Figma `17:2`).
- Mobile menu sheet open/close.
- Testimonials carousel motion on mobile.
