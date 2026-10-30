# Handoff: Rizwan portfolio redesign (Figma → Next.js)

Drop this folder into the repo root (or paste this file into `CLAUDE.md`). Files: `HANDOFF.md` (this), `tokens.css`, `fonts.ts`, `content.ts`, `NOTES.md` (style research).

## 0. Starter prompt for Claude Code

> Read HANDOFF.md, then implement the redesign of this Next.js portfolio exactly as designed in Figma file `uDzkzeMLL6tOJaT0lf2hNy` (https://www.figma.com/design/uDzkzeMLL6tOJaT0lf2hNy). Detect whether the repo uses the App Router or Pages Router and follow it. Use the Figma MCP (`get_design_context`, `get_screenshot`) per section using the node IDs below; treat its output as reference and adapt to our stack. Build section by section, starting with tokens and layout, and show me a screenshot of each section for approval before moving on. Do not invent copy, metrics or ratings: use `content.ts`, the Figma text, or https://www.rizwanux.work/.

## 1. Source of truth

- Figma file: `uDzkzeMLL6tOJaT0lf2hNy` ("Rizwan Portfolio — Codex-style Tokens & Base"). Page frame `2:2` "Home — Desktop (Dark)" is 1440 wide.
- Style base: codex.io/launchpads (dark, acid-lime accent, hairline grid). Content/structure: rizwanux.work. We reuse Codex's visual language only, never its logo, partner logos, token art or copy.
- Figma variables are the token source: collections **Color** (modes Dark/Light), **Radius & Spacing**, **Typography**. Every value is already in `tokens.css`. Prefer `get_variable_defs` if anything differs.

## 2. Node map (use with `get_design_context`)

| Node | Name | Size | Notes |
|---|---|---|---|
| `3:33` | Header - transparent | 1212×80 | Centered; user-edited. Logo group, `Links` frame `3:42`, CTA = component `12:13` "Button / Glow (default)" |
| `2:14` | Content frame | 1214 wide | `max-w-[1214px] mx-auto border-x border-hairline` |
| `2:15` | Hero | 540 | Centered headline, dimmed 2nd line, ASCII/dot-matrix style background (Codex pattern, ours to draw) |
| `2:21` | Brands strip | 119 | KATIM, Digital Dubai, Emirates NBD, Etihad (own logos, not placeholders) |
| `8:2` | Selected works | 1337 | Pleurat-style split: left rail of project rows, right panel preview of the active one |
| `10:2` | What I can do for you | 1346 | Codex bento, 2×2 cells with 'Visual' panels, **no chevrons, no 01–04 numbers**; last child is the collapsed AI twin `19:17` |
| `19:17` | AI twin / Collapsed (default) | | Surinder-style floating prompt bar |
| `14:58` | Career knowledge graph | 1026 | Canvas `14:113`, stats title `14:115` |
| `20:2` | Testimonials | 803 | Heading + 3 cards |
| `21:2` | Contact | 588 | Split card `23:3` + footer bar `23:22` |
| `17:2` | AI twin — Expanded state | at x=1600 | Annotation `17:3` + section `13:2` (card `13:9`, bubble, chips, input row, footnote). Not on the landing page flow: opens from the collapsed bar |

Header: fixed, 64px, `padding 8/32/24/32`, centered group; CTA is the lime radial-glow button (default state only designed).

## 3. Tokens (summary, full in `tokens.css`)

- Dark: bg `#181818`, fg `#e8e8e8`, card `#1f1f1f`, secondary `#292929`, muted-fg `#b4b4b4`, border `#2c2c2c`, hairline `#3d4045`, brand `#e5ff5d` (text on brand `#111`), pos `#00e599`, neg `#fd607f`. Light mode exists in variables but only Dark is designed; keep `.dark` default.
- Graph categories: companies `#6cb6ff`, industries `#ffa24d`, skills `#ff7ab6`, tools `#4fd8eb`, projects `#e5ff5d`, impact `#b69cff`.
- Radius: btn 4, sm 3.2, md 6, lg 8 (cards), xl 12 (prompt shell), full (avatars).
- Spacing: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 (`space/1…24`). Section padding is mostly 64 vertical / 48 horizontal.
- Text styles (Figma name → CSS): Display 56/0.92/-0.04em/500 · Title 32/1.10/-0.03em/500 · Subtitle 20/1.20/-0.02em/500 · Body 16/1.40/-0.02em/400 · Label 12 uppercase 500 · Micro 9 mono uppercase tracking 0.18em. Display's second line uses `muted-foreground`.
- Fonts: Geist (sans), JetBrains Mono (labels), Satoshi (`font/data`, optional). **Satoshi is local** (`Satoshi-Variable.ttf`; the user owns it): load with `next/font/local` into `--font-satoshi` and use it for data/table text if the Figma styles are switched to it. The Figma text styles currently use Geist.

## 4. Section specs

**Hero.** Centered headline in Display, line 2 muted. Subline: 15+ years line from the live site. Lime "Let's connect" button → Calendly.

**Selected works.** Left: rows of the 5 works in `content.ts` (title, metric as mono micro label above a large number). Right: sticky preview panel inside a hairline card showing the active project's UI mockup. Hover/click on a row switches the panel (interaction not in Figma; do a simple crossfade). Rows link to `/work/[slug]`.

**What I can do for you.** Heading row, then 2 rows × 2 cells (Product/UX, Design systems/strategy, Vibe coding/prototyping, Discovery/user testing). Each cell: title, short description and bullet list as in Figma, plus a 'Visual' panel. Hairline dividers, no chevrons, no numbers, no accordion. Pull cell copy from Figma text (node `10:2`) because `content.ts` only holds the titles.

**Collapsed AI twin (`19:17`).** Bar centered at 880px: shell (card fill, hairline stroke, radius-xl, 8px padding) with soft lime glow `0 0 48px rgb(229 255 93 / .10)` plus `0 12px 24px rgb(0 0 0 / .5)`; field with sparkle icon (3 four-point stars), placeholder, 40×40 lime send button; tagline below; status row with `pos` dot. Behaviour (to implement, not designed): focus or submit expands into the full chat (section `13:2`) as a modal or inline expansion; rate limit text must come from the real limiter. Backend/model endpoint is undecided: stub with a `/api/twin` route.

**Career knowledge graph.** 6 hubs and their leaves (data in `content.ts`), canvas with category colors and background-colored 3px halos behind labels. Stats text "27 nodes · 61 connections." must be computed from the data. Implement with SVG or `react-force-graph`/d3-force with fixed seeded layout so it matches Figma. The 28 cross-links in Figma are inferred, so confirm with the user before shipping.

**Testimonials.** Heading "What clients say about me." (2nd line muted), intro paragraph on the right, three cards: lime quote mark, Title-size headline, Body-size sub-line, quote with highlighted phrases (Geist Medium, foreground color), divider, avatar (initial placeholder) + name + mono role. Cards top-aligned with natural height. Don't add star ratings.

**Contact + footer.** Split card: left (avatar with lime ring and glow, "LET'S TALK" mono label, heading with muted second half, lime "Book a free call" → Calendly); right ("CONNECT WITH ME", email and phone fields as bordered cards with ↗). Footer bar: name and copyright left, LinkedIn / Dribbble / Behance right. Avatar is a placeholder: use the real photo from the existing site's `public/` folder.

## 5. Not designed yet (do not guess visuals, ask)

- Hover, focus and pressed states (star-border glow button hover = Magic UI interactive-hover-button style, per user, not yet designed)
- Expanded AI twin transition
- Mobile and tablet layouts (Figma has desktop only; follow Codex responsive behavior: single column, frame borders drop below 1214)
- Light theme, AI projects section, About + stats section, case-study pages (follow case-study order in `NOTES.md`)

## 6. Build order

1. `tokens.css` into global CSS, fonts via `fonts.ts`, `<html className="dark">`.
2. Layout shell: header + `Frame` component (`max-w-[1214px]`, `border-x border-hairline`) + section dividers.
3. Sections top to bottom, each from its node; compare with `get_screenshot` at 1440px.
4. Wire data from `content.ts` (replace hardcoded copy).
5. Interactions (works switcher, AI twin expand, graph hover), then responsive, then a11y (focus rings use `--ring`, contrast check for muted text on `#181818`).

## 7. Open questions for the user

- App Router or Pages Router? (check `app/` vs `pages/`)
- Where does `/api/twin` get its answers (which model, knowledge source, rate limit)?
- Confirm the inferred graph cross-links and the distilled testimonial headlines.
- Keep the existing case-study routes and content as is, restyled only?
