# Design decisions

Values live in `app/tokens.css` (copied from Figma variables; prefer `get_variable_defs` if they differ). This file records how we use them.

## Tokens (summary, see tokens.css)
- Dark: bg `#181818`, fg `#e8e8e8`, card `#1f1f1f`, secondary `#292929`, muted-fg `#b4b4b4`, border `#2c2c2c`, hairline `#3d4045`, brand `#e5ff5d` (text on brand `#111`), pos `#00e599`, neg `#fd607f`.
- Knowledge graph (owner, 2026-11-01): monochrome, like poulo.site. Nodes, links and labels are `--foreground` and `--muted-foreground`, fading with depth, on `--graph-canvas` `#0a0a0a`. Highlights are `--brand` only. The `--graph-*` category colours are unused there.
- Radius: btn 4, sm 3.2, md 6, lg 8 (cards), xl 12 (prompt shell), full (avatars, pills).
- Spacing scale 4 8 12 16 24 32 48 64 96. Section padding mostly 64 vertical, 48 horizontal on desktop; 48 vertical, 24 horizontal on mobile.
- Text styles: Display 56/0.92/-0.04em/500, Title 32/1.10/-0.03em/500, Subtitle 20/1.20/-0.02em/500, Body 16/1.40/-0.02em/400, Label 12 uppercase 500, Micro 9 mono uppercase tracking 0.18em.

## Styling approach
- Tailwind v4 with `@theme inline` mapping CSS variables to utilities. No component-level hex values.
- Hairline grid: sections separated by `border-t border-hairline`; two-column splits use a hairline divider only from `md`/`lg` up.
- Cards: `bg-card border border-border rounded-lg`.
- Buttons: lime fill (`bg-brand text-brand-foreground rounded-btn h-10 label`), ghost (hairline border), outline-brand (graph Trace). Header Linkedin is an outlined pill with soft lime glow.
- Headline pattern: first part foreground, remainder `text-muted-foreground`. Hero's muted part starts at "create" on desktop and at "that" on mobile, as in frames `2:2` and `27:5`.

## Responsive decisions (owner, 2026-10-30)
- Desktop is 1440 in Figma. Mobile frame `27:5` (390) also exists. Tablet (768) is not designed: follow Codex behaviour and ask before inventing.
- Below 1214px the frame loses its side borders and goes full width.
- Mobile follows frame `27:5`: works as an accordion list, graph as chips, category list and thumbnail, testimonials as a swipe row with pagination dots.
- Header collapses to a compact bar.
- Display type is 36/0.96 on mobile (frame `27:5`) and 56/0.92 from `md`, not fluid.
- Header and hero use the mobile frame below `md` (768) and the desktop frame from `md` up. This is the interim 768 behaviour, awaiting the owner's tablet decision.
- Review every section at 1440, 768 and 390.

## Decisions log
- Header nav: Works / AI projects / About, Linkedin pill (from Figma `3:33`).
- Fonts (owner, Option A, 2026-10-30): Geist for headings and display text. Satoshi (local `app/fonts/Satoshi-Variable.ttf`, via `next/font/local`) for body, nav links and buttons, replacing Host Grotesk. JetBrains Mono for labels. The original site uses Satoshi for body/UI and Clash Display for headings; we deliberately use Geist for headings to follow the Codex style.
- Header background (owner, 2026-10-30): fully transparent at the top of the page; dark translucent blur plus a hairline bottom border after scrolling past the top. Motion is in animations.md.
- Graph cross-links are now only ones stated in the CV, works or live site (2026-10-31). Nodes with nothing stated connect to their category only.
- Testimonial headlines ("Proactive", "Always curious", "Iterates fast") come from Figma, not the live site. Unconfirmed.
- Remaining sections: the Mac-built version replaces the earlier pushed one (owner choice, 2026-10-30): real photo, live-site copy, Figma-derived graph data.

- Build order (owner, 2026-10-30): lay out all sections from Figma in one pass with no per-section approval; behaviour and animation follow, one section at a time.
- Sections keep the mobile frame up to 1023px and use the desktop frame from `lg` (1024); header and hero switch at `md` (768). Interim until the owner decides tablet.

- CTA buttons (owner, 2026-11-01): every CTA ends in a round badge with a dotted arrow (`components/DottedArrow.tsx`, after the "Learn more" button on poulo.site), replacing the arrow glyph. Up-right opens a page or another site, right moves forward. Lime buttons get a dark badge with lime dots; hairline buttons a lime badge with dark dots. Buttons without an arrow (Reset, Done, Trace) stay as they are.

## Not designed (ask first)
Hover/focus/pressed states, menu sheet (mobile nav), tablet layouts, light theme, AI projects section, About + stats, hero dot-matrix background.
