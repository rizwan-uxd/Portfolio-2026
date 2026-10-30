# Portfolio redesign: Codex style x rizwanux.work content

## Style reference: codex.io/launchpads (scraped)

| Token | Value |
|---|---|
| Background (dark) | `#181818` |
| Foreground | `#e8e8e8` |
| Card / secondary / accent | `#1f1f1f` / `#292929` / `#2a2a2a` |
| Muted text | `#b4b4b4` |
| Border / hairline | `#2c2c2c` / `#3d4045` |
| Brand (acid lime) | `#e5ff5d` (text on it `#111`) |
| Positive / negative | `#00e599` / `#fd607f` |
| Light theme | bg `#fff`, fg `#181818`, brand unchanged |
| Fonts | Geist (sans), JetBrains Mono (9px uppercase labels), Satoshi (tables) |
| Display type | 56px / weight 500 / line-height 0.92 / tracking -0.04em; second line dimmed to muted |
| Body | 16px / 400 / 1.4 / tracking -0.02em |
| Buttons | 12px uppercase, weight 500, 4px radius, 40px tall, lime fill |
| Radii | 4px (buttons), 8px (cards), 50% (avatars/logos) |
| Layout | fixed 64px header; content in a ~1214px frame with 1px hairline side borders; full-width hairline row dividers; tab strips as equal-width cells |
| Hero | ASCII/dot-matrix canvas background, centered headline, dimmed last line |

## Not copied (on purpose)
- Codex logo, partner logos (Phantom, Uniswap, etc.), token artwork and product copy. These are their brand assets. Use your own avatar, your own client logos (KATIM, Digital Dubai, Emirates NBD, Etihad) and your own copy.

## Header: centered
- Fixed, 64px, three-part but visually centered: logo/name and nav as one centered group, or a symmetric grid `grid-cols-[1fr_auto_1fr]` with name left, nav center, CTA right.
- Preferred: pill/frame centered with `mx-auto`, nav links uppercase 12px, "Let's connect" lime button at the end of the centered group.
- Hero headline, subline and CTA also center aligned (matches Codex hero).

## Content map from rizwanux.work
1. Hero: "Designing enterprise products that create measurable business impact." + 15+ yrs line + Let's connect
2. Brands worked for (logo marquee)
3. Selected works, 4 case studies with a metric each:
   - `/work/hajj-operations-platform`: Hajj Enterprise Operations Platform, +25% efficiency
   - `/work/dubainow-mobile-app`: DubaiNow Mobile App, +30% service completion
   - `/work/secure-communication-app`: Secure Communication App, 3 months dev time saved
   - `/work/emirates-islamic-digital-ux`: Emirates Islamic Digital UX, +30% task completion
4. AI projects: AI Banking Copilot (`/work/ai-banking-copilot`, 6 days concept to prototype), AI Banking App (coming soon)
5. What I can do: Product/UX, Design systems/strategy, Vibe coding/prototyping, Discovery/user testing
6. About + stats (years, enterprise mobile apps, total projects)
7. Testimonials (Jayakumar/KATIM, Dr. Ali/Digital Dubai, Sonali/Smart Dubai)
8. CTA: Book a free call (Calendly) + email, phone, LinkedIn, Dribbble, Behance

Case study page order (from Hajj page): H1 title + metric, then sections: problem, approach/governance, flow, system/surfaces, outcome, "More works", CTA.

## Codex-style mapping
- Selected works list -> Codex "tab strip + split panel" pattern or hairline-divided rows
- Metrics (+25%, +30%) -> mono micro-label above a large display number
- Section titles -> two-line display headings, second line dimmed
- Existing case-study previews (live UI mockups) stay; frame them in hairline cards

## Next.js notes
- Your site is Next.js with Tailwind-style classes; current body font is "sathu" and background `rgb(20,18,27)`. I could not confirm from the browser whether it uses the App Router or Pages Router, so check your repo: App Router -> `app/layout.tsx` + `app/globals.css`; Pages Router -> `pages/_app.tsx` + `styles/globals.css`.
- Add `tokens.css` to your global stylesheet, load fonts as in `fonts.ts`, set `className="dark"` on `<html>`.
- Replace the current purple accent and dark-purple background with the tokens above.
