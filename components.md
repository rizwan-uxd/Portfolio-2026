# Components

Figma file `uDzkzeMLL6tOJaT0lf2hNy`. Desktop frame `2:2`, mobile frame `27:5`.

| Component | File | Node | Behaviour and states |
|---|---|---|---|
| Header | `components/Header.tsx` | `3:33` (button `12:13`) | Fixed. Logo, nav (Works, AI projects, About), Linkedin pill. Nav hidden below `md`; menu sheet not designed. Hover not designed. |
| Hero | `app/page.tsx` | `2:15` | Eyebrow, headline, subline, lime "Let's connect →" to Calendly. Dot-matrix background not drawn. |
| Brands strip | `components/Brands.tsx` | `2:21` | Four text names from Figma (KATIM, Digital Dubai, Emirates NBD, Etihad Airways). Live site has 8 logos; owner to decide. 2×2 on mobile. |
| Selected works | `components/Works.tsx` | `8:2` | Rail of 5 projects, only the active one expanded. Click switches the panel with a 200ms crossfade. "Final screens / Case study" toggle and "Case studies instead" switch the view. Only Hajj has detail copy; others show title + metric. Screens are Figma placeholders. Rows link to `/work/[slug]` (not built). |
| What I can do | `components/Services.tsx` | `10:2` | 2×2 cells (1 column on mobile), bullets fade top to bottom. No chevrons, numbers or accordion. |
| AI twin (collapsed) | `components/AiTwinBar.tsx` | `19:17` | 880px max bar, lime glow, sparkle, input, 40px lime send. Submit does nothing yet. Status line is Figma placeholder; must come from the real rate limiter. |
| AI twin (expanded) | not built | `17:2`, section `13:2` | Designed but the open transition is not decided. Ask first. |
| Knowledge graph | `components/Graph.tsx`, `lib/graph.ts` | `14:58` (canvas `14:113`) | Click/tap a node to highlight it and its neighbours. Category chips toggle visibility, search highlights, Trace finds shortest path, Reset clears. Stats are computed from data. Timeline and Take the tour are disabled (not designed). |
| Testimonials | `components/Testimonials.tsx` | `20:2` | Three top-aligned cards with natural height, highlighted phrases, initial avatars. No star ratings. |
| Contact + footer | `components/Contact.tsx` | `21:2` (card `23:3`, footer `23:22`) | Split card, email and phone as link cards, footer with socials. Avatar is "MR" placeholder until the photo is added. |

## Mobile frame `27:5` notes (to verify per section at review)
Seen at low resolution only. It differs from the simple stacking used so far:
- Works as a list of project titles with a toggle for the active one.
- Graph as category list with counts, a small graph and an "Open interactive graph" button.
- Testimonials as a horizontally scrolling row (next card peeks in).
- Compact AI twin bar and header with logo + Linkedin.
Each section gets its own `get_design_context` on `27:5` children before it is finalised.

## Open questions
- Where `/api/twin` gets answers (model, knowledge source, rate limit).
- Confirm graph cross-links and testimonial headlines.
- Keep existing case-study routes and content, restyled only?
