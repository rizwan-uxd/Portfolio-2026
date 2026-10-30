# Animations

Rule: respect `prefers-reduced-motion` for everything below.

## Decided
- Works panel switch: 200ms opacity crossfade (`.works-panel` in globals.css).
- Nav on scroll (owner, 2026-10-30), `components/Header.tsx`, `.site-header` in `app/tokens.css`:
  - At the top of the page: always visible and fully transparent.
  - Scrolling down past about 80px: slides up and hides.
  - Scrolling up: slides back in right away.
  - Scroll stops (about 150ms idle): reappears.
  - After scrolling past the top: dark translucent blur plus a hairline bottom border.
  - 250ms translate with ease-out.
  - Stays visible while a link has keyboard focus, and while the mobile menu is open (to wire up when the sheet is built).
  - No animation under `prefers-reduced-motion`: it still hides and reappears, instantly.

## Not decided (ask before building)
- Logo "R" draw reveal (2s timeline in Figma, no keyframes available; logo is static).
- Hero dot-matrix / ASCII background motion.
- Scroll reveals and section entrance animations.
- Button hover (star-border glow, Magic UI interactive-hover-button style) and all hover/focus/pressed states.
- Knowledge graph: node hover, selection transitions, drag and zoom feel, tour.
- AI twin: expand/collapse transition into the chat (Figma `17:2`).
- Mobile menu sheet open/close.
- Testimonials carousel motion on mobile.
