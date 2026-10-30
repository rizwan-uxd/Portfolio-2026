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
  - The floating bar's contents (pill shape, 40px logo, shadow) are not in Figma; built from existing tokens. Confirm or adjust.
- Logo R draw (owner, 2026-10-30, Figma `3:39` motion): plays once on load. The R channel starts filled by a thick lime stroke, which retracts along the letter from the stem foot to the leg tip, revealing the R as a drawn line. Figma timeline: 2s, stroke retracts 0.15s to 1.35s linear, then hidden. We play it once instead of looping. Only the full-bleed header animates; the floating bar shows the end state. Reduced motion: end state, no animation.
- Linkedin button (owner, 2026-10-30):
  - Rest: React Bits "star border" motion. The two Figma glows travel along the bottom (right to left) and top (left to right) edges and fade, 6s linear, infinite, alternate.
  - Hover (pointer devices) and keyboard focus: Magic UI "interactive hover button" motion. A small lime dot at the left grows to fill the pill, the label slides right and fades, and "Linkedin →" slides in centred in brand-foreground. 300ms ease. The dot is hidden at rest because Figma's default has no dot.
  - Reduced motion: no glow travel, state swaps instantly.

- Nav links Works / AI projects / About (owner, 2026-10-30, surinder.design): on hover and keyboard focus a soft pill (foreground at 8%) fades in behind the link and the text brightens to foreground, 200ms ease. Links are now `px-3 py-2` pills with a 28px gap, so the text keeps Figma's spacing. Same in the full-bleed header and the floating bar. Reduced motion: instant.

## Not decided (ask before building)
- Hero dot-matrix / ASCII background motion.
- Scroll reveals and section entrance animations.
- Hover/focus/pressed states for everything except the header Linkedin button and nav links.
- Knowledge graph: node hover, selection transitions, drag and zoom feel, tour.
- AI twin: expand/collapse transition into the chat (Figma `17:2`).
- Mobile menu sheet open/close.
- Testimonials carousel motion on mobile.
