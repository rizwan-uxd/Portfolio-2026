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
  - At rest the first screen is the hero and the empty globe: a short strip at the top of the section (`.works-cap`) is clipped to the circle the horizon draws, in the page colour. The clip must stay on that strip. On the whole section it stops rendering once the section is thousands of pixels tall, and the horizon turned into a straight line (owner, 2026-10-31), and all of Selected works is hidden. 135px of the globe shows, unless the hero content needs more height.
  - The page scrolls normally, so the horizon rises 1:1 with the scroll from the first pixel until it reaches the top of the screen. Everything below is a straight line against scroll position, as a share of that travel, with no easing.
  - Hero, eyebrow to CTA: scales from 100% to 10% towards a point 48px below the top of the rim over the whole travel, and fades out from 30% to 85%.
  - Selected works heading: from 33% to 80%, it goes from 40% size (owner, 2026-10-31), invisible and 80px below its place, to full size, opacity and position, riding up with the horizon.
  - Project list: fades in from 40% to 70%, overlapping the heading, so no empty space sits below it (owner, 2026-11-02; supersedes 80% to 100%, which waited for the heading to be fully visible).
  - The globe's edge flattens evenly until it is a straight line at 100%, so Selected works arrives full width and square. The rim and beams ride that edge and fade out late in the move.
  - Reduced motion: plain scroll, no scaling, clipping or fades.
- Hero intro line (owner, 2026-10-31, follows Magic UI "Typing Animation"; our own code). Replaces the "Senior UX/Product Designer · Dubai" eyebrow above the headline. `components/HeroIntro.tsx`, `.hero-intro`, `.hero-flag*` and `--intro-*` in `app/tokens.css`:
  - It must not steal the show (owner, 2026-10-31), so it is quick, small and settles. About 1.4s in total.
  - Plays once on load: after 300ms it types "Hi" at 28ms per character, with a thin muted cursor. A hand fades in and waves once (owner, 2026-10-31). It types "I'm Mohammed Rizwan from", the UAE flag fades in and ripples for two cycles, then it types "Dubai". The hand and flag each get 120ms, and the cursor leaves after 500ms. Nothing moves once it has settled.
  - The untyped text is held invisibly, so the centred line doesn't shift as it types. Screen readers get the whole sentence.
  - Mono at 12px, not the 9px uppercase eyebrow style. That size is not in Figma. The hand is the system emoji, the flag is drawn in code.
  - Reduced motion: the final line at once, with a still hand and flag and no cursor.
- Selected works project blocks (owner, 2026-11-01, layout after poulo.site/#work; supersedes the 2026-10-31 pinned list after pleurat.com/work). `components/WorksList.tsx`, `.works-media`, `.works-square`, `.works-fig` in `app/tokens.css`:
  - No pinning, no project switching and no filters (owner, 2026-11-01): the four projects stack and scroll with the page.
  - Each card (media, story, the four squares) reveals once as it enters: fade over 800ms, rise 56px and unclip from 16% at the top over 1250ms.
  - Reduced motion: no reveal.
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

## AI twin bar and panel (owner, 2026-10-31)
Function and timing measured from surinder.design, colours from our tokens. Values live in `--twin-*` in `tokens.css`.
- Trigger: the bar slides up when the end of Selected works reaches the middle of the screen, and leaves when Contact reaches 80% of the screen height. The owner's message cut off at "when it reaches about", so this point is a best guess until confirmed.
- Bar: in 500ms, out to the panel in 220ms. The placeholder types a question, holds, erases, then moves on. Reduced motion: static first question.
- Panel: rises 56px from 0.98 scale with a 3px blur clearing, 480ms; closes in 340ms. Scrim fades and blurs the page, which stops scrolling. Below `lg:` the panel is full screen.
- Messages rise 10px with a blur clearing, 400ms. A shimmering "Thinking…" shows for at least 700ms.

## Services diagrams (owner, 2026-10-31)
Motion and drawing style from the tracks section on pleurat.com, colours from our tokens. `components/ServiceDiagrams.tsx`, `components/ServiceBox.tsx`, `.iso-*` and `--iso-*` in `tokens.css`.
- Trigger: hovering anywhere on the box. Touch screens have no hover, so the diagram plays while 60% of the diagram itself is in view (our call, not in the brief).
- At rest the diagram is still and assembled. On hover the lines brighten and the parts loop. Every loop starts and ends with the part in place, and on leave each part finishes its current loop, so nothing snaps back.
- Six boxes (owner, 2026-11-01). Product Strategy: bars rise in turn (3.6s). UX Research: a signal runs the loop and each station lifts and lights as it arrives (4s). Complex Interaction: three planes show dense data simplifying, a request passing through two human reviewers, and an exception resolving to approval (7s); the completed state remains visible with reduced motion. AI-Native (owner, 2026-11-02): runs once and holds. At rest the flow waits at a closed gate with a person beside it and a flat action box. The top block shows two opposite raised chat bubbles (extruded slabs with tails), with a CONVERSATION label beside it like CONFIRM (owner, 2026-11-02). At rest the bubbles lie flat on the block. On hover the first bubble rises off it, then the second (0.45s each), each lighting lime on its raised edge as it goes, and only then (0.9s lead) the existing sequence starts: the signal stops short of the gate for about a second, the person only reacts once it arrives and taps confirm, the gate sinks, and the action box rises from flat when the signal reaches it. Moving off is a quick undo. Code Prototyping (logos, owner, 2026-11-02): the Claude Code, Cursor, v0, Lovable and Figma Make logos light in turn and send a pulse down a dotted line into the prompt slab, then the prompt lines write, a token runs down the wire, and only once it arrives does a laptop open and its prototype interface appear, then the laptop closes before the next loop (owner, 2026-11-02; 6.5s). Design Systems (owner, 2026-11-02): each plane shows its own content, token tiles, a button, input, toggle and card, then a page layout. It runs once and holds instead of looping. The dotted lines and layer labels go, the layers fold into one slab (0.8s), its edge turns lime with the label "MACHINE-READABLE DESIGN SYSTEM", then the agent and human icons appear with dotted lines and pulses running into the slab, which repeat while hovered. On leave it reverses to the open stack.
- Reduced motion: no loops, only the colour change.

## Floating bar menu and favicon (owner, 2026-10-31)
- Menu links in the floating bar drop from 20px to 16px (`--text-nav-float`), the same 32px pill height as surinder.design, which drops 15px to 14px. The exact step is our call.
- The tab icon is the logo (`app/icon.svg`): the lime M on a dark rounded square. Read from the owner's screenshot of a default globe in a blue tab.

## Case study hover previews (owner, 2026-10-31)
- Each project in Selected works shows its live preview in the media card (owner, 2026-11-01). The banner is the resting poster.
- The animations are the owner's own, built in github.com/rizwan-uxd/portfolio (`src/components/preview`) and copied here into `components/preview` with their images in `public/images/preview`. Only two edits: the theme hook is a dark-only stub (`components/theme/theme-provider.tsx`) and the grey-box test fixture is dropped. They use `framer-motion`, a new dependency. Their colours are the products' own, not our tokens.
- `components/WorkPreview.tsx` plays by default while the card is at least 40% in view, with no hover needed, as on poulo.site (owner, 2026-11-01; replaces hover to play). Out of view it pauses. It fills the width of the media card. Hajj and DubaiNow sit in a 21:9 frame, SecureLink and Emirates Islamic in 4:3, which are the shapes the scenes are drawn for. Reduced motion is handled by the preview engine.

## Contact lanyard card (owner, 2026-10-31)
Motion from the 21st.dev id-card-lanyard demo, written again for our site; look, copy and colours ours. `components/Lanyard.tsx`, `.lanyard-*` and `--lanyard-*` in `tokens.css`.
- Replaces the profile photo in Contact. A card hangs from a rope that is a Verlet chain (13 points, 140px, gravity 0.55, damping 0.98, 6 passes, 60Hz fixed step) drawn on a canvas in our tokens. Drag the card to swing it, and it is let go with the speed of the hand (capped, our call). A click, or Enter on the focused card, flips it. Hovering tilts it up to 9deg towards the pointer, with a soft sheen.
- Front: photo, name, role, location, "15+ years" (all from `lib/content.ts`). Back: email, phone, LinkedIn, Dribbble and Behance as links. No ID number, QR code or validity date, because they would be invented.
- It draws only while on screen and the tab is visible. Reduced motion: the card hangs still, there is no drag or tilt, and a click flips it with no turn. Touch: the card takes the touch (no page scroll from on it), the 56px each side of it still scrolls the page.
- Layout (owner): the "Let's talk" label, heading and "Book a free call" moved to the top of the right column, above "Connect with me". The card stage fills the left column.

## Nav current section (owner, 2026-10-31)
- The nav link for the section on screen keeps the hover pill. Works runs from Selected works through Brands, AI projects is the placeholder section after Brands, and About starts at "What I can do for you" and runs to the end. Nothing is active above Works. The switch happens when a section's top passes 30% down the screen (our call).
- AI projects is a placeholder section (`components/AiProjects.tsx`) with a stand-in heading, to be designed.

## Testimonial cards (owner, 2026-10-31)
Motion from the 21st.dev tilt-card "evade" demo, colours from our tokens. `components/TiltCard.tsx`, `.tilt-*` and `--tilt-*` in `tokens.css`.
- On hover the card turns away from the pointer, up to 20deg each way, at 1.08 scale with 1200px perspective. Transform eases over 200ms, and a soft spotlight follows the cursor and fades in over 300ms. All values are the demo's.
- Our calls: the pointer is read on a still wrapper, so the card edges don't flicker as the card tilts away. The shadow shows only on hover, because the cards are flat at rest.
- Touch screens, widths below `lg:` (the swipe row would clip the card) and reduced motion get no tilt.

## Knowledge graph sphere (owner, 2026-11-01)
Interactions from sankar.work, look from poulo.site's graph (owner's screenshot): monochrome, with brand lime as the only highlight colour. `components/GraphSphere.tsx`.
- Real 3D: a ball of nodes, not a shell. The root sits at the centre, hubs part-way out, and each hub's nodes scatter in and out around it. Every link is a thin curved arc bowed away from the centre. Dust specks fill the space around it.
- Everything is white or grey and fades with depth, labels included. Highlight (hover, select, trace, search matches) is brand lime on the nodes, their links and their labels, and everything else dims. A traced path is brand lime and dashed, flowing from start to end. Category colours are not used anywhere in the graph, including the filter chips.
- The Rizwan node at the centre is the owner's profile photo (`/images/profile-brand.png`: the owner's black-and-white portrait with its background recoloured to brand lime) in a 48px circle, with the whole head showing (owner, 2026-11-01). It is an HTML element over the canvas that follows the node, so nodes passing in front of it are drawn behind it. The ring turns brand lime when the node is highlighted.
- Slow auto-rotation that stops while a node is hovered or selected or a path is traced, and resumes after. Selecting or tracing flies the camera to it. Reduced motion: no spin, and the camera jumps.
- Drag empty space to rotate, with inertia. Drag a node to move it around the ball, at its own depth; Reset puts it back. Pinch or ctrl + wheel zooms always; plain wheel only after clicking in the graph (our call), so the page still scrolls past it. Touch keeps vertical swipes for the page.
- Rendering pauses off screen and in a hidden tab.
- Replaces the glowing wire shell from the owner's two sphere images (2026-10-31), which the owner moved on from.

## Tools I build with entrance (owner, 2026-11-03)
Plan built with the emil-design-eng skill; HyperFrames is not installed and renders video, so it was not used. `components/Tools.tsx`, `components/ToolsReveal.tsx`, `--tools-*` and `.tools-*` in `app/tokens.css`.
- Plays once, when the section top is 100px inside the viewport bottom (`--tools-reveal-margin`). No replay, no scroll scrubbing. CSS transitions started by one IntersectionObserver.
- Heading: the three phrases each fade in, rise 12px and unblur from 4px over 400ms, 60ms apart.
- Intro: opacity only, 300ms, starts at 120ms.
- Tiles: fade in, rise 8px and scale from 95% over 300ms, from 200ms, 40ms apart in reading order. Labels move with their tile. Settled at about 0.8s.
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`. Only opacity, translate, scale and a small blur animate.
- Reduced motion: a 200ms opacity fade, no movement, scale or blur.
- Without JS the section shows at rest: the hidden state needs `data-ready`, set by the script.
- No hover (not designed).
- Side effect: the heading phrases are inline blocks, so on phone "every day." now wraps as one unit onto its own line.

## Not decided (ask before building)
- Hero dot-matrix / ASCII background motion.
- Scroll reveals and section entrance animations.
- Hover/focus/pressed states for everything except the header Linkedin button and nav links.
- Mobile menu sheet open/close.
- Testimonials carousel motion on mobile.
