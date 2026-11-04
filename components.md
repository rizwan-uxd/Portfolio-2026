# Components

Figma file `uDzkzeMLL6tOJaT0lf2hNy`. Desktop frame `2:2`, mobile frame `27:5`.

| Component | File | Node | Behaviour and states |
|---|---|---|---|
| Header | `components/Header.tsx` | `3:33`, mobile `27:6` (button `12:13`) | Full bleed at the top, then a floating bar once Selected works fills the screen; logo R draws on load; Linkedin star-border glow and hover fill (animations.md). Desktop: logo 48, nav (Works, AI projects, About), glow Linkedin button. Mobile: logo 40, Linkedin, menu button. Menu button is inert because the sheet isn't designed. Nav links get a pill on hover and focus (animations.md). |
| Hero | `components/Hero.tsx` | `2:15`, mobile `27:32` | Typed intro line (`components/HeroIntro.tsx`, owner, 2026-10-31), headline, subline, lime "Let's connect →" to Calendly (full width on mobile). Animated horizon in its own band below the CTA (`components/HeroHorizon.tsx`, animations.md). On scroll it moves up with the horizon while scaling down and fading into it (owner, 2026-10-31). The dot-matrix background in HANDOFF.md isn't in the Figma node, so it's not drawn. |
| Brands carousel | `components/Brands.tsx` | `2:21`, mobile `27:38` (layout superseded by owner, 2026-10-30) | Title "Led Impactful initiatives for". All 8 logos and names from the live site (`public/images/brands/`, `lib/content.ts`) in circles on an auto-scrolling arc; hover pause, drag, arrow keys (animations.md). Sits after Selected works (owner, 2026-10-30). |
| Selected works | `components/Works.tsx` | `8:2`, mobile `29:6` | Pinned project list with scroll-driven auto-expand, mobile bar of project names (`components/WorksShowcase.tsx`, owner, 2026-10-31). Hidden at rest inside the horizon globe (owner, 2026-10-31). The centred heading grows in and rides up with the horizon, then the project list fades in, and the globe grows to fill the screen on scroll (`components/HeroStage.tsx`, animations.md). Intro paragraph, "Case studies instead" button and the divider above the heading removed (owner, 2026-10-30). Real data from the live site (owner, 2026-10-31): copy in `lib/content.ts`, images in `public/images/work/`. "Read the full case study" links to the live site's page, because `/work/[slug]` is out of scope for v1. |
| What I can do | `components/Services.tsx`, `ServiceBox.tsx`, `ServiceDiagrams.tsx` | `10:2`, mobile `29:46`; panel changed by the owner, 2026-10-31 | Each box: isometric diagram on the left, bullets on the right (stacked below `sm:`). Replaces the list table. Diagram labels are decoration, not from content. No chevrons, numbers or accordion. |
| AI twin (floating bar) | `components/AiTwinBar.tsx` | replaces `19:17`, mobile `29:98` (owner, 2026-10-31) | Fixed ask bar, function taken from surinder.design, colours from our tokens. Removed from the Services section. Comes in past Selected works, leaves at Contact (animations.md). Clicking it opens the panel. |
| AI twin (panel) | `components/AiTwinBar.tsx`, `lib/twin.ts`, `app/api/twin/route.ts` | layout from surinder.design, copy from `13:2` (owner, 2026-10-31) | Header, intro, 3 suggestion cards, quick actions (Book a call, See works; WhatsApp removed by owner, 2026-10-31), input, footnote. Answers are matched by keyword and built only from the works and the owner's CV (owner, 2026-10-31; `cv` in `lib/content.ts`), no model yet. Where the CV and site differ on dev time saved, the site's 3 months is correct and the CV's 2 months is out of date (owner, 2026-10-31). The Secure Communication App stays unlinked from any employer because its client is confidential. Minimize keeps the chat; Close and New chat clear it. Dropped from the reference: thumbs, next-open-slot card, common-questions tray. "Messages left" dropped until there is a limiter. |
| Knowledge graph | `components/Graph.tsx`, `components/GraphSphere.tsx`, `lib/graph.ts` | `14:58`, mobile `30:6` (layout superseded) | Interactive 3D sphere (owner, 2026-10-31), interactions matched to sankar.work: category filters with counts, search, trace a path, Graph/Timeline toggle, tour, reset, details panel, drag and zoom. Our own WebGL, no dependency. Nodes come from the CV, the works and the live site's About stats, so nothing is invented. Mobile replaces the frame's category list and "Open interactive graph" with the same sphere inline. |
| Testimonials | `components/Testimonials.tsx` | `20:2`, mobile `30:148` | Three top-aligned cards with natural height, initial avatars, no star ratings. Mobile is a swipe row with static dots. To build: dots following the swipe. |
| Contact + footer | `components/Contact.tsx` | `21:2` (card `23:3`, footer `23:22`), mobile `30:197` | Real photo from the live site. Email, phone, Calendly and socials are live links. |

## Open questions
- Whether `/api/twin` moves to a real model (model, knowledge source, rate limit). Today it answers from `lib/content.ts`.
- AI twin: confirm the suggestion card labels and the exact bar trigger point.
- Confirm testimonial headlines.
- Graph: the copilot prototype is "3 days" in the CV and the graph, "six days" on the live site. Confirm which is right.
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
