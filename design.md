# Design decisions

Values live in `tokens.css` (copied from Figma variables; prefer `get_variable_defs` if they differ). This file records how we use them.

## Tokens (summary, see tokens.css)
- Dark: bg `#181818`, fg `#e8e8e8`, card `#1f1f1f`, secondary `#292929`, muted-fg `#b4b4b4`, border `#2c2c2c`, hairline `#3d4045`, brand `#e5ff5d` (text on brand `#111`), pos `#00e599`, neg `#fd607f`.
- Graph categories: companies `#6cb6ff`, industries `#ffa24d`, skills `#ff7ab6`, tools `#4fd8eb`, projects `#e5ff5d`, impact `#b69cff`.
- Radius: btn 4, sm 3.2, md 6, lg 8 (cards), xl 12 (prompt shell), full (avatars, pills).
- Spacing scale 4 8 12 16 24 32 48 64 96. Section padding mostly 64 vertical, 48 horizontal on desktop; 48 vertical, 24 horizontal on mobile.
- Text styles: Display 56/0.92/-0.04em/500, Title 32/1.10/-0.03em/500, Subtitle 20/1.20/-0.02em/500, Body 16/1.40/-0.02em/400, Label 12 uppercase 500, Micro 9 mono uppercase tracking 0.18em.

## Styling approach
- Tailwind v4 with `@theme inline` mapping CSS variables to utilities. No component-level hex values.
- Hairline grid: sections separated by `border-t border-hairline`; two-column splits use a hairline divider only from `md`/`lg` up.
- Cards: `bg-card border border-border rounded-lg`.
- Buttons: lime fill (`bg-brand text-brand-foreground rounded-btn h-10 label`), ghost (hairline border), outline-brand (graph Trace). Header Linkedin is an outlined pill with soft lime glow.
- Headline pattern: first part foreground, remainder `text-muted-foreground`. Hero splits mid-line ("...products that" / "create measurable business impact.").

## Responsive decisions (owner, 2026-10-30)
- Desktop is 1440 in Figma. Mobile frame `27:5` (390) also exists. Tablet (768) is not designed: follow Codex behaviour and ask before inventing.
- Below 1214px the frame loses its side borders and goes full width.
- Two- and three-column layouts (bento cells, testimonial cards, contact split, works rail + preview) stack to one column on mobile.
- Header collapses to a compact bar. Collapsed AI twin bar goes full width.
- Display type scales with `clamp(36px, 6vw, 56px)`.
- Knowledge graph scales with its container; tap-to-highlight replaces hover.
- Review every section at 1440, 768 and 390.

## Decisions log
- Header nav: Works / AI projects / About, Linkedin pill (from Figma `3:33`).
- Fonts: Geist everywhere for now. Satoshi deferred until the file is added.
- Header background: translucent dark with blur (Figma is transparent, but content ran through the nav on scroll). Tell the owner if they want it fully transparent.
- Graph cross-links (28) are inferred and unconfirmed.
- Testimonial headlines ("Proactive", "Always curious", "Iterates fast") come from Figma, not the live site. Unconfirmed.
- Remaining sections: the Mac-built version replaces the earlier pushed one (owner choice, 2026-10-30).

## Not designed (ask first)
Hover/focus/pressed states, expanded AI twin, menu sheet (mobile nav), tablet layouts, light theme, AI projects section, About + stats, case-study pages, hero dot-matrix background.
