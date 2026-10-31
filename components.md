# Components

Figma file `uDzkzeMLL6tOJaT0lf2hNy`. Desktop frame `2:2`, mobile frame `27:5`.

| Component | File | Node | Behaviour and states |
|---|---|---|---|
| Header | `components/Header.tsx` | `3:33`, mobile `27:6` (button `12:13`) | Full bleed at the top, then a floating bar once Selected works fills the screen; logo R draws on load; Linkedin star-border glow and hover fill (animations.md). Desktop: logo 48, nav (Works, AI projects, About), glow Linkedin button. Mobile: logo 40, Linkedin, menu button. Menu button is inert because the sheet isn't designed. Nav links get a pill on hover and focus (animations.md). |
| Hero | `components/Hero.tsx` | `2:15`, mobile `27:32` | Eyebrow, headline, subline, lime "Let's connect →" to Calendly (full width on mobile). Animated horizon in its own band below the CTA (`components/HeroHorizon.tsx`, animations.md). On scroll it moves up with the horizon while scaling down and fading into it (owner, 2026-10-31). The dot-matrix background in HANDOFF.md isn't in the Figma node, so it's not drawn. |
| Brands carousel | `components/Brands.tsx` | `2:21`, mobile `27:38` (layout superseded by owner, 2026-10-30) | Title "Led Impactful initiatives for". All 8 logos and names from the live site (`public/images/brands/`, `lib/content.ts`) in circles on an auto-scrolling arc; hover pause, drag, arrow keys (animations.md). Sits after Selected works (owner, 2026-10-30). |
| Selected works | `components/Works.tsx` | `8:2`, mobile `29:6` | Static: first project open. Hidden at rest inside the horizon globe (owner, 2026-10-31). The centred heading grows in and rides up with the horizon, then the project list fades in, and the globe grows to fill the screen on scroll (`components/HeroStage.tsx`, animations.md). Intro paragraph, "Case studies instead" button and the divider above the heading removed (owner, 2026-10-30). Screens are Figma placeholders. To build: project switching, Final screens/Case study toggle, show other screens, `/work/[slug]` links. |
| What I can do | `components/Services.tsx` | `10:2`, mobile `29:46` | Static. Desktop list fades out, mobile doesn't. No chevrons, numbers or accordion. |
| AI twin (collapsed) | `components/AiTwinBar.tsx` | `19:17`, mobile `29:98` | Static. Status line is Figma placeholder; must come from the real rate limiter. To build: input, send. |
| AI twin (expanded) | not built | `17:2`, section `13:2` | Designed but the open transition is not decided. Ask first. |
| Knowledge graph | `components/Graph.tsx`, `lib/graph.ts` | `14:58` (canvas `14:113`), mobile `30:6` | Static. Stats are computed from data. To build: search, filters, trace, node details, drag and zoom, timeline, tour, reset; mobile category tap and "Open interactive graph". |
| Testimonials | `components/Testimonials.tsx` | `20:2`, mobile `30:148` | Three top-aligned cards with natural height, initial avatars, no star ratings. Mobile is a swipe row with static dots. To build: dots following the swipe. |
| Contact + footer | `components/Contact.tsx` | `21:2` (card `23:3`, footer `23:22`), mobile `30:197` | Real photo from the live site. Email, phone, Calendly and socials are live links. |

## Open questions
- Where `/api/twin` gets answers (model, knowledge source, rate limit).
- Confirm graph cross-links and testimonial headlines.
- Keep existing case-study routes and content, restyled only?

## Progress

### 2026-10-30
Done:
- Header: full-bleed at the top, floating bar once Selected works fills the screen.
- Logo R draws on load in the full-bleed header.
- Linkedin button: star-border glow at rest, hover fill.
- Nav links: pill on hover and focus.
- Floating bar logo: 32px on desktop, 24px on mobile.
- Brands carousel: all 8 logos and names from the live site, on an auto-scrolling arc, with hover pause, drag and arrow keys.
- Hero horizon: animated arc and beams below the CTA, with the top of the arc inside the first screen.
- Page order: Brands carousel moved to after Selected works.
- Scroll transition (owner, 2026-10-31): no pause. The horizon rises with the scroll while the hero scales into it and the Selected works heading grows in; the project list fades in after.

Open:
- The floating bar's design is not in Figma; built from existing tokens.
- Carousel drag speed is a guess, with no momentum.
- The ADCB logo reads brighter than the others because its file has white shapes.
- Reduced motion has not been tested with the real system setting (carousel, horizon, scroll transition).
- Selected works' centred heading and the organic scroll transition are awaiting the owner's review.
