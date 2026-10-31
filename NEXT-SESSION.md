# Next session: where the work stands

Written 2026-10-30, updated 2026-10-31, for picking this up in a fresh session. `HANDOFF.md` is a different file: the original Figma build brief.

## Start here
1. Work in `/Users/mohammedrizwan/Desktop/Website redesign/Code/Portfolio-2026`. The empty repo at `Website redesign/Portfolio-2026` is not the project.
2. Read `CLAUDE.md`, then this file. Decisions live in `animations.md`, `components.md` and `design.md`.
3. Run `git status`. Only `AGENTS.md` should show as untracked.
4. Run `npm run dev` and open http://localhost:3000. The old dev server ran from the previous session and may be gone.

## Rules from Riz
- **Stay local.** Make changes in this clone so they show on localhost. Commit and push only when Riz says to, and each "push" covers that push only.
- **No PNG mockups.** Implement in the site directly.
- **References are for motion only.** Take no assets, content or colours from them unless Riz asks.
- **Don't commit `AGENTS.md`.** `next dev` generates it.
- Record Riz's decisions in the matching `.md` file, marked `(owner, date)`.

## Git state
- Branch: `claude/project-thread-rhwh4o`, the branch behind PR #1 (open): https://github.com/rizwan-uxd/Portfolio-2026/pull/1
- The scroll transition is pushed. See `git log` for the latest commit.
- Stash: one, `rizwan: full section build before section-by-section rebuild (2026-10-30)`. It is Riz's own work, so keep it.

## Built and pushed
- Header: full-bleed, then a floating bar. Logo R draws on load. Linkedin star-border glow and hover fill. Nav link pill on hover. Floating logo 32px desktop, 24px mobile.
- Hero: animated horizon with radiating beams (`components/HeroHorizon.tsx`, our own WebGL shader in brand lime; React Bits Pro is paid, so none of its code is used). Top spacing reduced so the globe shows in the first screen.
- Brands carousel, titled "Led Impactful initiatives for": 8 logos from the live site, motion measured from poulo.site. Placed after Selected works.
- Selected works: intro paragraph, "Case studies instead" button and the divider above the heading removed. Riz's "the line above" was read as the divider, and "Enterprise impact" was kept.

## How the transition works
Riz's direction: no visible card, and Selected works starts contained inside the globe, which grows to fill the section on scroll.

- `components/HeroStage.tsx` publishes scroll progress as `--hero-y`, `--hero-p` and `--hero-ease` on `.hero-stage`, and sets `--r` on `#works`.
- `#works` is clipped with `clip-path: circle(r at 50% r)`. As it rises, `r` grows towards infinity, so the curve flattens to a straight line. The clip is removed at 100% (`data-covered`).
- `HeroHorizon` sits at the top of Works in a zero-height anchor, so its rim rides the globe's edge. Its `uFlat` uniform flattens the arc to match the clip. The canvas height and offset are set in JS, from `.hero-band` and the arc's depth.
- Superseded (owner, 2026-10-31), see `animations.md`: no pinning or hold. The page scrolls normally, and `HeroStage` maps scroll to `--hero-scale`, `--hero-fade`, `--works-heading-in` and `--works-list-in` in straight lines. Riz reviewed the first screen and asked to push this version (2026-10-31).
- Hiding the canvas once covered is what stops it drawing.
- The floating nav is triggered by a `data-nav-reveal-after` marker at the top of `#works`.

## Open items
- The heading in Selected works is centred at all times, because it has to fit inside the curve. Riz hasn't confirmed this.
- At 1440 the largest carousel circle gets a flat top where the track clips it (seen on BNY Mellon). Riz was told and hasn't answered, so don't fix it unless asked.
- Carousel drag speed is a guess, with no momentum.
- The ADCB logo reads brighter than the others because its file has white shapes.
- The floating bar's design is not in Figma.
- Not tested: the real reduced-motion setting (carousel, horizon, transition), touch scrolling on a real phone, and the horizon's pause when the tab is hidden.
- Still unbuilt (see `components.md` and "Not decided" in `animations.md`): project switching in Selected works, mobile menu sheet, AI twin, knowledge graph interactions, tablet layouts. Ask Riz before designing anything undesigned.

## Things that cost time
- **The browser pane does not run animation frames while hidden,** and a script waiting on them times out. For real frames use `playwright-core` with `executablePath` set to the Chrome app and SwiftShader flags.
- **The browser pane may not draw while hidden.** CSS animations and `requestAnimationFrame` can stall, so a moving element can look frozen. Take a screenshot first, then run a `requestAnimationFrame` loop in the page while measuring. A stale screenshot or a zero speed reading right after load is usually this, not a bug.
- **After a window resize,** let frames run again before trusting a scroll or nav reading.
- **`npm run build` may stop `next dev`.** It went down once right after a build and survived another, so check http://localhost:3000 afterwards.
- **There's no ffmpeg on this Mac.** To study a video, serve it locally, fetch it as a blob (plain `http.server` can't seek), and draw frames to canvases in the browser pane.
- **The live site is reachable from this Mac.** Assets come from `https://www.rizwanux.work/images/...`.

## Reference video
The scroll reference Riz sent: `/Users/mohammedrizwan/.claude/uploads/8bcd60ee-fd38-44da-a101-f36c137eeb31/111d470f-horizon-scroll-transition.mp4`. It shows the earlier card idea, which the globe version replaced. It may not outlive the session.
