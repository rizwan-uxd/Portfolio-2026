# Components

Figma file `uDzkzeMLL6tOJaT0lf2hNy`. Desktop frame `2:2`, mobile frame `27:5`.

| Component | File | Node | Behaviour and states |
|---|---|---|---|
| Header | `components/Header.tsx` | `3:33`, mobile `27:6` (button `12:13`) | Fixed, hides on scroll (animations.md). Desktop: logo 48, nav (Works, AI projects, About), glow Linkedin button. Mobile: logo 40, Linkedin, menu button. Menu button is inert because the sheet isn't designed. Hover not designed. |
| Hero | `components/Hero.tsx` | `2:15`, mobile `27:32` | Eyebrow, headline, subline, lime "Let's connect →" to Calendly (full width on mobile). The dot-matrix background in HANDOFF.md isn't in the Figma node, so it's not drawn. |
| Brands strip | `components/Brands.tsx` | `2:21`, mobile `27:38` | Four text names from Figma. Live site has 8 logos; owner to decide. |
| Selected works | `components/Works.tsx` | `8:2`, mobile `29:6` | Static: first project open. Screens are Figma placeholders. To build: project switching, Final screens/Case study toggle, show other screens, `/work/[slug]` links. |
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
