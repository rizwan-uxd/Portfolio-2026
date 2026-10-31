# Animations

Rule: respect `prefers-reduced-motion` for everything below.

## Decided
- Works panel switch: 200ms opacity crossfade (`.works-panel` in globals.css).
- Header (owner, 2026-10-30, follows surinder.design's behaviour; motion only, our colours). Supersedes the earlier hide-on-scroll-down spec. `components/Header.tsx`, `.nav-float` / `.nav-veil` in `app/tokens.css`:
  - At the top: the full-bleed header from Figma `3:33`, absolutely positioned, so it scrolls away with the page.
  - Once Selected works fills the whole screen (its top reaches the viewport top, owner, 2026-10-30; `data-nav-reveal-after` sits at the top of the section), a floating bar slides down from above: centred pill (full width minus 16px gutters on mobile), glass card fill, hairline border, soft shadow, 24px from the top (12px on mobile). It hides again when scrolling back above that point.
  - 300ms translateY(-140% to 0) with `cubic-bezier(0.2, 0.8, 0.2, 1)` plus an opacity fade.
  - A 120px blur veil fades in behind the bar so content softens under it (hidden under `prefers-reduced-transparency`).
  - The hidden bar is `inert`, so it is never in the tab order. Same bar on all breakpoints (surinder.design hides its mobile bar on scroll down instead; we kept one behaviour).
  - Reduced motion: 200ms opacity only, no slide.
  - Floating bar logo is 32px on desktop and 24px on mobile (owner, 2026-10-30).
  - The floating bar's pill shape and shadow are not in Figma; built from existing tokens.
- Hero horizon (owner, 2026-10-30, follows React Bits Pro "Horizon Bloom"; our own shader, none of its code or colours). `components/HeroHorizon.tsx`, `--horizon-*` in `app/tokens.css`:
  - A glowing planet edge with beams radiating up from a point of light at the centre, in `--brand` with a `--foreground` core. Decorative and non-interactive.
  - It sits at the top of Selected works, behind the hero content. The faint top of the beams can touch the CTA (owner, 2026-10-30). The light fades with its distance from the rim and each shaft has its own length, up to 150px (120px on mobile), so there is no straight line where the beams stop (owner, 2026-10-31; length shortened the same day).
  - The hero's top spacing is 68px (28px on mobile, both 20px less than the owner's first image, owner, 2026-10-31), (owner, 2026-10-31, from the owner's image; supersedes 24px). The rim stays 135px above the bottom of the first screen (owner, 2026-10-31: hero and horizon moved up 20px together). Extra screen height is shared equally between the space above the hero and the gap below the CTA, which is at least 64px (48px on mobile).
  - On load the light spreads along the arc over 4s with an ease-out, as on the reference. After that the beams shift slowly, the glow breathes and the sun drifts slightly.
  - Pauses off-screen and when the tab is hidden. Reduced motion: one still frame with the light fully risen.

- Hero to Selected works scroll transition (owner, 2026-10-31: no pause or pinning, so the scroll feels organic, "not hampered, not hastened"; supersedes the earlier pinned versions). `components/HeroStage.tsx`, `.hero-*`, `.works-heading`, `.works-list` and `.works-card` in `app/tokens.css`:
  - At rest the first screen is the hero and the empty globe: the section is clipped to the circle the horizon draws, in the page colour, and all of Selected works is hidden. 135px of the globe shows, unless the hero content needs more height.
  - The page scrolls normally, so the horizon rises 1:1 with the scroll from the first pixel until it reaches the top of the screen. Everything below is a straight line against scroll position, as a share of that travel, with no easing.
  - Hero, eyebrow to CTA: scales from 100% to 10% towards a point 48px below the top of the rim over the whole travel, and fades out from 30% to 85%.
  - Selected works heading: from 33% to 80%, it goes from 40% size (owner, 2026-10-31), invisible and 80px below its place, to full size, opacity and position, riding up with the horizon.
  - Project list: fades in from 80% to 100%, starting only once the heading is fully visible (owner, 2026-10-31).
  - The globe's edge flattens evenly until it is a straight line at 100%, so Selected works arrives full width and square. The rim and beams ride that edge and fade out late in the move.
  - Reduced motion: plain scroll, no scaling, clipping or fades.
- Hero intro line (owner, 2026-10-31, follows Magic UI "Typing Animation"; our own code). Replaces the "Senior UX/Product Designer · Dubai" eyebrow above the headline. `components/HeroIntro.tsx`, `.hero-intro`, `.hero-flag*` and `--intro-*` in `app/tokens.css`:
  - It must not steal the show (owner, 2026-10-31), so it is quick, small and settles. About 1.4s in total.
  - Plays once on load: after 300ms it types "Hi" at 28ms per character, with a thin muted cursor. A hand fades in and waves once (owner, 2026-10-31). It types "I'm Mohammed Rizwan from", the UAE flag fades in and ripples for two cycles, then it types "Dubai". The hand and flag each get 120ms, and the cursor leaves after 500ms. Nothing moves once it has settled.
  - The untyped text is held invisibly, so the centred line doesn't shift as it types. Screen readers get the whole sentence.
  - Mono at 12px, not the 9px uppercase eyebrow style. That size is not in Figma. The hand is the system emoji, the flag is drawn in code.
  - Reduced motion: the final line at once, with a still hand and flag and no cursor.
- Selected works scroll behaviour (owner, 2026-10-31, follows pleurat.com/work; motion only, our content and colours). `components/WorksShowcase.tsx`, `.works-rail`, `.works-bar`, `.works-rule`, `.works-fig` in `app/tokens.css`:
  - Four projects: AI Banking Copilot is not in this list (owner, 2026-10-31). All projects' screens stack in one scrolling column. A project is active once its first row reaches the middle of the screen.
  - Desktop: the project list is pinned at the left, 112px from the top to clear the floating bar. The active row opens over 550ms and the previous one closes, with its title brightening over 350ms. A lime line on the column edge grows with progress through all the projects. Clicking a title smooth-scrolls to its screens.
  - Mobile: a pinned bar of project names under the floating bar, with a lime underline on the active name, which centres itself. Tapping a name scrolls to it. Each project shows its own details above its screens.
  - Screens reveal once as they enter: fade over 800ms, rise 56px and unclip from 16% at the top over 1250ms.
  - Final screens / Case study flips one project at a time, as on the reference. Case study shows a short summary of that project and a link to its full page. Show the other screens opens the rest for that project and stays open.
  - Reduced motion: no reveal or transitions. The list and bar still pin and follow the scroll.
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
