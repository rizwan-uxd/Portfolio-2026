# Components

Figma file `uDzkzeMLL6tOJaT0lf2hNy`. Desktop frame `2:2`, mobile frame `27:5`.

| Component | File | Node | Behaviour and states |
|---|---|---|---|
| Header | `components/Header.tsx` | `3:33`, mobile `27:6` (button `12:13`) | Full bleed at the top, then a floating bar once Selected works fills the screen; logo R draws on load; Linkedin star-border glow and hover fill (animations.md). Desktop: logo 48, nav (Works, AI projects, About), glow Linkedin button. Mobile: logo 40, Linkedin, menu button. Menu button is inert because the sheet isn't designed. Nav links get a pill on hover and focus (animations.md). |
| Hero | `components/Hero.tsx` | `2:15`, mobile `27:32` | Typed intro line (`components/HeroIntro.tsx`, owner, 2026-10-31), headline, subline, lime "Let's connect →" to Calendly (full width on mobile). Animated horizon in its own band below the CTA (`components/HeroHorizon.tsx`, animations.md). On scroll it moves up with the horizon while scaling down and fading into it (owner, 2026-10-31). The dot-matrix background in HANDOFF.md isn't in the Figma node, so it's not drawn. |
| Brands carousel | `components/Brands.tsx` | `2:21`, mobile `27:38` (layout superseded by owner, 2026-10-30) | Title "Led Impactful initiatives for". All 8 logos and names from the live site (`public/images/brands/`, `lib/content.ts`) in circles on an auto-scrolling arc; hover pause, drag, arrow keys (animations.md). Sits after Selected works (owner, 2026-10-30). |
| Selected works | `components/Works.tsx`, `components/WorksList.tsx` | `8:2`, mobile `29:6` (layout superseded by owner, 2026-11-01) | Layout after poulo.site/#work, in our styling (owner, 2026-11-01). Per project: title in `.display` with the chip, then a media card (live preview, client and year) beside a story card (summary, facts, "Read the full case study" button to `/work/[slug]`), then four squares: the metric, then three highlights. No filters and no AI twin chip (owner, 2026-11-01). Highlights are the owner's bold leads from each case study with the sentence shortened (`lib/works-highlights.ts`), pending the owner's review of the wording. Each square leads with a line icon where the numbers were (owner, 2026-11-01, reverting the titles-on-top change the same day): Lucide paths inlined in `components/WorkIcons.tsx`, picked by us per highlight in `lib/works-highlights.ts`; the metric square shows a trend icon and the title "Impact" above the metric. The case study button uses a dotted outward arrow in a dark circle instead of the arrow glyph (`DottedArrow`, after the "Learn more" button on poulo.site). Hidden at rest inside the horizon globe; the heading grows in and rides up with the horizon (`components/HeroStage.tsx`, animations.md). Real data from the live site in `lib/content.ts`, images in `public/images/work/`. |
| Tools I build with | `components/Tools.tsx`, `components/ToolLogos.tsx` | none, owner's reference image (2026-11-03) | Placed after AI projects, before What I can do (owner, 2026-11-03). Three-part display heading (second phrase muted) with the intro to its right on desktop, as in What I can do. Ten square tiles (Claude, Figma, Cursor, Supabase, Vercel, OpenAI, Meta, Grok, GitHub, Tailwind) with mono labels below. Logos inlined from Simple Icons, Grok from LobeHub Icons. One row from `md` up, two rows of 5 on phone. Static: no hover, no fade-in. Copy in `toolsSection` in `lib/content.ts`. |
| What I can do | `components/Services.tsx`, `ServiceBox.tsx`, `ServiceDiagrams.tsx` | `10:2`, mobile `29:46`; panel changed by the owner, 2026-10-31 and 2026-11-01 | Six boxes: headline, one-sentence pitch and an isometric diagram. No bullets and no raised card behind the diagram (owner, 2026-11-01). Diagram labels are decoration, not from content. No chevrons, numbers or accordion. Six descriptions reworded (owner, 2026-11-02) to drop claims the case studies do not support (revenue, interviews, live APIs, canvas workspaces, AI code agents, accessibility); titles unchanged. |
| AI twin (floating bar) | `components/AiTwinBar.tsx` | replaces `19:17`, mobile `29:98` (owner, 2026-10-31) | Fixed ask bar, function taken from surinder.design, colours from our tokens. Removed from the Services section. Comes in past Selected works, leaves at Contact (animations.md). Clicking it opens the panel. |
| AI twin (panel) | `components/AiTwinBar.tsx`, `lib/twin.ts`, `app/api/twin/route.ts` | layout from surinder.design, copy from `13:2` (owner, 2026-10-31) | Header, intro, 3 suggestion cards, quick actions (Book a call, See works; WhatsApp removed by owner, 2026-10-31), input, footnote. Answers are matched by keyword and built only from the works and the owner's CV (owner, 2026-10-31; `cv` in `lib/content.ts`), no model yet. Where the CV and site differ on dev time saved, the site's 3 months is correct and the CV's 2 months is out of date (owner, 2026-10-31). The Secure Communication App stays unlinked from any employer because its client is confidential. Minimize keeps the chat; Close and New chat clear it. Dropped from the reference: thumbs, next-open-slot card, common-questions tray. "Messages left" dropped until there is a limiter. |
| Knowledge graph | `components/Graph.tsx`, `components/GraphSphere.tsx`, `lib/graph.ts` | `14:58`, mobile `30:6` (layout superseded) | Interactive 3D graph, monochrome like poulo.site with brand lime highlights (owner, 2026-11-01), interactions matched to sankar.work: filter bar benchmarked on Mobbin (owner, 2026-11-02): search is the primary control, full width and 48px, then selectable pills at 40px. None selected means All is selected and everything shows; a selected pill gets a check, a brand outline and the secondary fill, and a Clear button appears. Selecting every category collapses back to All. Opening a node in a filtered-out category adds that category. Then search, trace a path, Trace dropdowns are our own `components/GraphSelect.tsx`, not the browser's select (grouped by category, keyboard, owner, 2026-11-02), Graph/Timeline toggle (selected state is the subtle secondary fill, not brand lime; owner, 2026-11-01), tour, reset, details panel, drag and zoom. Our own WebGL, no dependency. Nodes come from the CV, the works and the live site's About stats, so nothing is invented. Mobile replaces the frame's category list and "Open interactive graph" with the same sphere inline. |
| Testimonials | `components/Testimonials.tsx` | `20:2`, mobile `30:148` | Three equal-size cards (owner, 2026-10-31) with the divider and author lined up at the bottom, tilt hover (`components/TiltCard.tsx`), initial avatars, no star ratings. Mobile is a swipe row with static dots. To build: dots following the swipe. |
| Contact + footer | `components/Contact.tsx` | `21:2` (card `23:3`, footer `23:22`), mobile `30:197` | Real photo from the live site. Email, phone, Calendly and socials are live links. Heading "Let’s build something meaningful together." and CTA "Let’s talk" (owner, 2026-11-02); booking link and contact details unchanged. |

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

## Case study pages (owner, 2026-10-31)
- Route `app/work/[slug]`, renderer `components/CaseStudy.tsx`, copy in `lib/case-studies.ts`. Template is Figma `41:6` (desktop) and `43:6` (mobile), which is the Hajj page. Copy and images are from the live site.
- Five pages: Hajj, Secure Communication, DubaiNow, Emirates Islamic, AI Banking Copilot. The Copilot page is linked only from More works, because the home page's AI projects section is still a placeholder.
- Choices the template doesn't cover, not yet reviewed by the owner:
  - Images show whole at their own ratio instead of the template's fixed-height placeholders, because the boards carry small type. DubaiNow's hero keeps the live site's crop.
  - The Hajj workflow section shows the live site's flow image above the caption. The template has only the caption there.
  - On the four shorter case studies, the overview takes the first image and the last section takes the second, as on the live site. The live site gives them no captions, tags or section headlines, so those slots are empty or repeat the section name.
  - Long conclusions show the first sentence in the large style and the rest as body text.
  - The Copilot page turns the live site's interactive parts into static template blocks: phones for the carousel, text for the transformation diagram, all four workflows in a row for the tabs. The live site's commit list and tool icons are left out.

- AI projects section (owner, 2026-10-31): two cards in a hairline grid, AI Banking Copilot (links to its case study) and AI Banking App (coming soon, not linked), each ending in a lime pixel chevron. Copy and the tile image are from the live site. `components/AiProjects.tsx`. Intro sentence replaced by the owner's (2026-11-02); no tool-logo row inside this section. The separate Tools I build with section follows it (owner, 2026-11-03).
