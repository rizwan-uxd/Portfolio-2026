# Next session: where the work stands

Written 2026-10-30, updated 2026-10-31 at the knowledge graph push, for picking this up in a fresh session. `HANDOFF.md` is a different file: the original Figma build brief.

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
- Everything below is pushed, as of 2026-10-31. See `git log` for the latest commit.
- Not committed yet: testimonial cards at equal size with the tilt hover (`components/TiltCard.tsx`).
- Stash: one, `rizwan: full section build before section-by-section rebuild (2026-10-30)`. It is Riz's own work, so keep it.

## Built and pushed
- Header: full-bleed, then a floating bar. Logo R draws on load. Linkedin star-border glow and hover fill. Nav link pill on hover. Floating logo 32px desktop, 24px mobile.
- Hero: animated horizon with radiating beams (`components/HeroHorizon.tsx`, our own WebGL shader in brand lime; React Bits Pro is paid, so none of its code is used). Top spacing reduced so the globe shows in the first screen.
- Brands carousel, titled "Led Impactful initiatives for": 8 logos from the live site, motion measured from poulo.site. Placed after Selected works.
- Selected works: intro paragraph, "Case studies instead" button and the divider above the heading removed. Riz's "the line above" was read as the divider, and "Enterprise impact" was kept.

- Selected works list: scroll-driven project list with real data from the live site (`components/WorksShowcase.tsx`).
- What I can do: each service box has an isometric diagram that animates on hover (`components/ServiceBox.tsx`, `components/ServiceDiagrams.tsx`).
- AI twin: floating ask bar and chat panel (`components/AiTwinBar.tsx`). It has no model. `lib/twin.ts` matches keywords and answers only from the CV and works in `lib/content.ts`.
- Career knowledge graph: interactive 3D sphere, see below.

- Case study pages (not committed yet): `/work/<slug>` for all five, see "Case study pages" in `components.md`. Every "Read the full case study" link now opens them, including the graph and the AI twin.

## How the knowledge graph works
Riz's direction: the interactions of sankar.work's Career Knowledge Graph, with Riz's own content, in 3D. The look follows poulo.site's graph (2026-11-01), replacing the glowing wire sphere of 2026-10-31. Highlights use brand lime only.

- `lib/graph.ts` holds the nodes and links, built from `lib/content.ts`, the shortest-path search and the sphere layout. A link goes in only if the CV, the works or the live site states it. A node with nothing stated connects only to its category.
- `components/GraphSphere.tsx` is the renderer: hand-written WebGL with no dependency. It draws curved arcs as thin quads and sprites for nodes, and projects in JS for picking and labels. The dust around the ball is decoration and can't be clicked.
- `components/Graph.tsx` holds the UI and state: filters, search, trace, Graph/Timeline, tour, Reset, details panel. It passes a `view` object to the sphere.
- Tour copy and the default trace are in `graphSection` in `lib/content.ts`. Colours are the `--graph-*` tokens.
- The Secure Communication App has no employer link because its client is confidential. Skill nodes still join it to KATIM's design-system work, so a trace between them goes through a skill.

## How the transition works
Riz's direction: no visible card, and Selected works starts contained inside the globe, which grows to fill the section on scroll.

- `components/HeroStage.tsx` publishes scroll progress as `--hero-y`, `--hero-p` and `--hero-ease` on `.hero-stage`, and sets `--r` on `#works`.
- `#works` is clipped with `clip-path: circle(r at 50% r)`. As it rises, `r` grows towards infinity, so the curve flattens to a straight line. The clip is removed at 100% (`data-covered`).
- `HeroHorizon` sits at the top of Works in a zero-height anchor, so its rim rides the globe's edge. Its `uFlat` uniform flattens the arc to match the clip. The canvas height and offset are set in JS, from `.hero-band` and the arc's depth.
- Superseded (owner, 2026-10-31), see `animations.md`: no pinning or hold. The page scrolls normally, and `HeroStage` maps scroll to `--hero-scale`, `--hero-fade`, `--works-heading-in` and `--works-list-in` in straight lines. Riz reviewed the first screen and asked to push this version (2026-10-31).
- Hiding the canvas once covered is what stops it drawing.
- The floating nav is triggered by a `data-nav-reveal-after` marker at the top of `#works`.

## Open items
- Case studies: Secure Communication's card says "3 months" dev time saved, but its page says "2 months", both as on the live site. Riz hasn't said which is right.
- Case studies: the Copilot page says 6 days, as the live site does; the CV, graph and AI twin say 3 days (see the graph item below).
- Case studies: hover states on the links and cards aren't designed. `npm run build` hasn't been run for these pages, only `tsc` and the dev server, so run it before pushing.
- Graph: the copilot prototype is "3 days" in the CV, the graph and the AI twin, but "six days" on the live site. Riz hasn't said which is right.
- Graph: Etihad has no dates in any source, so it isn't on the Timeline.
- Graph: the look was changed to poulo.site's on 2026-11-01 (monochrome, curved arcs, brand lime highlights). Only seen at 1440 so far.
- Graph, not tested: real phone touch and pinch, the reduced-motion setting, keyboard use, and WebGL context loss (no recovery is built). The reworked sphere was only seen at 1440; the first version was checked at 390.
- The heading in Selected works is centred at all times, because it has to fit inside the curve. Riz hasn't confirmed this.
- At 1440 the largest carousel circle gets a flat top where the track clips it (seen on BNY Mellon). Riz was told and hasn't answered, so don't fix it unless asked.
- Carousel drag speed is a guess, with no momentum.
- The ADCB logo reads brighter than the others because its file has white shapes.
- The floating bar's design is not in Figma.
- Not tested: the real reduced-motion setting (carousel, horizon, transition), touch scrolling on a real phone, and the horizon's pause when the tab is hidden.
- Still unbuilt (see `components.md` and "Not decided" in `animations.md`): mobile menu sheet, tablet layouts. Ask Riz before designing anything undesigned.

## Things that cost time
- **Never put the globe's `clip-path` on the whole Works section.** Once that section is thousands of pixels tall the circle stops rendering and the horizon becomes a straight line (2026-10-31). The clip lives on the short `.works-cap` strip.
- **The browser pane does not run animation frames while hidden,** and a script waiting on them times out. For real frames use `playwright-core` with `executablePath` set to the Chrome app and SwiftShader flags.
- **The browser pane may not draw while hidden.** CSS animations and `requestAnimationFrame` can stall, so a moving element can look frozen. Take a screenshot first, then run a `requestAnimationFrame` loop in the page while measuring. A stale screenshot or a zero speed reading right after load is usually this, not a bug.
- **After a window resize,** let frames run again before trusting a scroll or nav reading.
- **`npm run build` may stop `next dev`.** It went down once right after a build and survived another, so check http://localhost:3000 afterwards.
- **To click a sphere node in a test, dispatch pointer events from the page.** The auto-spin moves nodes between a screenshot and a real click, so the click misses.
- **There's no ffmpeg on this Mac.** To study a video, serve it locally, fetch it as a blob (plain `http.server` can't seek), and draw frames to canvases in the browser pane.
- **The live site is reachable from this Mac.** Assets come from `https://www.rizwanux.work/images/...`.

## Reference video
The scroll reference Riz sent: `/Users/mohammedrizwan/.claude/uploads/8bcd60ee-fd38-44da-a101-f36c137eeb31/111d470f-horizon-scroll-transition.mp4`. It shows the earlier card idea, which the globe version replaced. It may not outlive the session.
