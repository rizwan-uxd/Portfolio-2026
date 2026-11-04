// Case study pages (/work/<slug>), laid out from Figma 41:6 (desktop) and 43:6 (mobile). The copy and images come
// from the live site's /work/<slug> pages; the Hajj headings follow the Figma template, which carries the same text.
// Two rules from the live site's source: the Hajj client is only ever "Leading energy provider in Saudi", and its
// +25% card metric stays off this page, which says outright that no figures were measured. SecureLine's client stays confidential.

import type { CaseIconName } from "@/components/CaseFeatures";

export type Figure = {
  src: string; w: number; h: number; alt: string; caption?: string;
  aspect?: string; // crops to this ratio; left out, the image shows whole
};
// A wireframe → UI pair, shown as a drag slider. Export both at the same frame size so they line up.
export type Comparison = { title?: string; before: Figure; after: Figure; caption?: string; labels?: [string, string] }; // labels default to Wireframe / UI design
export type Definition = {
  label?: string; body: string;
  highlight?: boolean; // brand label, foreground body (Figma's "Governance decision")
  points?: string[];
  link?: { label: string; href: string };
};
// A card or list row with an icon and an illustration (SecureLine overview and approach, owner 2026-11-04).
export type FeatureArt = "secure-chat" | "one-app" | "legacy-layers" | "feature-checklist" | "component-kit" | "test-loop";
export type Feature = { icon: CaseIconName; label: string; body: string; art: FeatureArt; points?: string[]; image?: Figure }; // image replaces the art
export type IconItem = { icon: CaseIconName; label: string; body: string };
export type Block =
  | { type: "text"; text: string; muted?: boolean }
  | { type: "list"; items: string[] }
  | { type: "definitions"; items: Definition[] }
  | { type: "cards"; items: Feature[] } // full-width cards under the section header
  | { type: "features"; items: Feature[] } // full-width list with a visual for the chosen row
  | { type: "iconGrid"; items: IconItem[] }; // cards with icons, full width under the header (owner, 2026-11-04)
// One tab of a rotating screen showcase: the same screen in both themes, with what it does.
export type Showcase = { label: string; lead: string; points: string[]; dark: Figure; light: Figure };
export type Section = {
  eyebrow: string; title: string;
  body?: Block[];
  steps?: { label: string; actor?: string; body: string }[];
  phones?: Figure[]; // a row of portrait screens
  phonesPaired?: boolean; // each definition gets the phone at its index, label and phone on the left (owner, 2026-11-03)
  showcase?: Showcase[]; // tabbed screens that rotate on their own (owner, 2026-11-04)
  comparisons?: Comparison[]; // shown before figures
  figures?: Figure[];
};
export type CaseStudy = {
  slug: string;
  title: [string, string]; // 2nd half muted
  eyebrow: string;
  subtitle: string;
  summary: string; // page description
  tags?: string[];
  links?: { label: string; href: string }[]; // 1st is the primary button
  meta: { label: string; value: string }[];
  hero?: Figure;
  heroPhones?: Figure[];
  prototype?: { src: string; title: string }; // embedded under the meta strip, above the hero (owner, 2026-11-03)
  thumbnail: string; // More works card
  sections: Section[];
  conclusion: { statement: [string, string]; rest?: string }; // statement's 2nd half muted
};

const hajj = "/images/work/hajj-operations-platform";
const dubai = "/images/work/dubainow-mobile-app";
const secure = "/images/work/secure-communication-app";
const emirates = "/images/work/emirates-islamic-digital-ux";
const copilot = "/images/work/ai-banking-copilot";
const phone = { w: 786, h: 1704 };
const copilotPrototype = "https://ai-banking-copilot.vercel.app/";
const copilotRepository = "https://github.com/rizwan-uxd/AI-banking-copilot";

// Each page's More works shows the next two in this order, so every case study is linked from another.
export const caseStudies: CaseStudy[] = [
  {
    slug: "hajj-operations-platform",
    title: ["Hajj Enterprise", "Operations Platform"],
    eyebrow: "Enterprise UX · Digital transformation",
    subtitle: "From meeting-driven reporting to digital operational intelligence",
    summary: "Led the UX transformation of a PowerPoint- and meeting-driven Hajj reporting process into a connected enterprise platform for operational data capture, validation, reporting and executive decision-making.",
    tags: ["Enterprise B2B", "Meeting-driven → digital", "UX Lead, hands-on", "Multi-team, Power BI, legacy data", "Live for 2026 Hajj season"],
    meta: [
      { label: "Client", value: "Leading energy provider in Saudi" },
      { label: "Role", value: "UX Lead + Product Designer" },
      { label: "Duration", value: "4 months" },
      { label: "Team", value: "2 designers, with PM, Ops, Mecca and development counterparts" },
      { label: "Delivery", value: "2026 Hajj season, MVP 3" },
    ],
    hero: { src: `${hajj}/hero-dashboard.png`, w: 3184, h: 1832, alt: "The live power monitoring dashboard for the Hajj period alongside the project-manager data entry platform, showing load, meter connectivity, interruptions, readiness and the projects list." },
    thumbnail: `${hajj}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [{ type: "text", text: "Led the UX transformation of a PowerPoint- and meeting-driven Hajj reporting process into a connected enterprise platform for operational data capture, validation, reporting and executive decision-making." }],
      },
      {
        eyebrow: "The problem",
        title: "Operational reality lived in decks and meetings",
        body: [
          {
            type: "list",
            items: [
              "Operational status was reported in PowerPoint decks, assembled by hand.",
              "Each department reported in its own structure and its own terminology.",
              "Progress was reviewed in physical meetings, on the meeting’s schedule.",
              "Information arrived fragmented and inconsistent across sources.",
              "There was no digital view of consumption, outages, overloads or readiness.",
            ],
          },
          { type: "text", muted: true, text: "What the organisation needed was a single path: capture reality on the ground, validate it, publish it digitally, and put timely information in front of leadership while there was still time to act." },
        ],
        figures: [{ src: `${hajj}/legacy-vs-digital.png`, w: 3184, h: 1944, alt: "A legacy Arabic project report slide next to the new digital project detail screens that replaced it.", caption: "The legacy reporting artefact, and the digital surface that replaced it." }],
      },
      {
        eyebrow: "Approach & key decision",
        title: "Getting the governance model right before designing on top of it",
        body: [{
          type: "definitions",
          items: [
            { label: "Role", body: "UX Lead, hands-on throughout: discovery, data and KPI analysis, information architecture, flows, hi-fi UI, developer handoff and QA. I led two designers on the engagement." },
            { label: "Challenge", body: "Information was fragmented, inconsistently structured, and rarely tied to a clear action. Source reports were in Arabic and translated for the design work, with terminology verified against native speakers before it entered the interface." },
            { label: "Governance decision", highlight: true, body: "The initial assumption was that Mecca users would correct project data directly. The validated model inverted it: the project manager reports reality, the Mecca team reviews, and then either approves and publishes or sends it back for revision. Catching this before the downstream design was built kept the approval trail, the states and the entire data-entry surface aligned with how the organisation actually works. It was the single clearest UX-leadership moment on the project." },
          ],
        }],
        figures: [{ src: `${hajj}/governance-flow.png`, w: 3344, h: 1360, alt: "The initial information architecture next to the structure confirmed in the users and stakeholder workshop sessions.", caption: "Initial understanding, and the structure confirmed in workshop." }],
      },
      {
        eyebrow: "The workflow",
        title: "Capture → Validate → Publish → Decide",
        steps: [
          { label: "Capture", actor: "Project manager", body: "Reports ground reality against their own projects, in a structured entry flow rather than a deck." },
          { label: "Validate", actor: "Mecca team", body: "Reviews each submission and either approves it or sends it back for revision, with the trail preserved." },
          { label: "Publish", actor: "The platform", body: "Approved information moves into structured digital reporting instead of a scheduled review meeting." },
          { label: "Decide", actor: "CEO & operations", body: "Read readiness, load, interruptions and risk from a shared view, and act on them in the same cycle." },
        ],
        figures: [{ src: `${hajj}/flow-composite.png`, w: 3392, h: 1792, alt: "Requirements and operational understanding on the left, and the confirmed PM-to-Mecca-team approval workflow diagram on the right.", caption: "The four stages as one connected approval workflow." }],
      },
      {
        eyebrow: "Execution & constraints",
        title: "Two surfaces, one vocabulary, inside a fixed data model",
        body: [{
          type: "definitions",
          items: [
            { label: "Data-entry platform", body: "A separate product surface, deliberately not part of the CEO portal: login → project list → add or update → approval → reporting. Keeping it separate meant the people reporting reality were never designing around an executive’s view of it." },
            { label: "States as reusable patterns", body: "On Track, Delayed, Completed Early, Completed Late and Not Started, plus empty and no-result, validation, error, approval and send-back. These were authored as reusable patterns rather than one-off screens, so the same vocabulary carries across the whole workflow." },
            { label: "Constraints navigated", body: "Power BI’s chart limitations meant investigating which visualisation patterns were actually supported and adapting the information design around what was feasible. The underlying data model could not be changed, so I designed around it, restructuring how information was surfaced without touching the source structure." },
            { label: "The Hajj operating cycle", body: "The same dashboard was designed to shift focus across pre, during and post Hajj: readiness before, live operations during, and learning after." },
          ],
        }],
        comparisons: [
          {
            title: "New project entry",
            before: { src: `${hajj}/compare/entry-wireframe.png`, w: 1241, h: 700, alt: "Wireframe of the data-entry platform's new project entry form, on the project info step." },
            after: { src: `${hajj}/compare/entry-ui.png`, w: 1241, h: 700, alt: "Final UI of the new project entry form, on the project info step." },
          },
          {
            title: "Mecca users review screen",
            before: { src: `${hajj}/compare/review-wireframe.png`, w: 1194, h: 672, alt: "Wireframe of the Mecca review screen: the projects table with a project's details open in a side panel." },
            after: { src: `${hajj}/compare/review-ui.png`, w: 1194, h: 672, alt: "Final UI of the Mecca review screen, with the project details panel and the approve and publish action." },
            caption: "Data-entry platform: entry and review, wireframe to final UI.",
          },
        ],
        figures: [
          { src: `${hajj}/phase-dashboards.png`, w: 2176, h: 816, alt: "The during-Hajj live operations dashboard next to the pre-Hajj readiness dashboard, showing the same surface with different priorities.", caption: "One dashboard, two phases of the cycle: live operations and readiness." },
        ],
      },
      {
        eyebrow: "Delivery & outcome",
        title: "A connected ecosystem, live for the 2026 Hajj season",
        body: [
          { type: "text", text: "The PowerPoint-and-meeting reporting process was replaced by a connected capture → validate → report → decide ecosystem, live for the 2026 Hajj season at MVP 3." },
          { type: "text", muted: true, text: "The change is qualitative and stated as such: leadership moved from periodic visibility that arrived with the next deck to continuous digital visibility of the same operation. No adoption, time-saving or performance figures were measured, so none are claimed." },
        ],
        comparisons: [
          {
            title: "CEO during dashboard",
            before: { src: `${hajj}/compare/ceo-wireframe.png`, w: 1243, h: 779, alt: "Wireframe of the CEO dashboard: readiness index, project and maintenance summaries, site map, risks and safety reports." },
            after: { src: `${hajj}/compare/ceo-ui.png`, w: 1243, h: 779, alt: "Delivered UI of the CEO dashboard, with the readiness index, projects at risk, site distribution and drill test countdown." },
          },
          {
            title: "Data entry landing page, PM users",
            before: { src: `${hajj}/compare/pm-wireframe.png`, w: 1261, h: 691, alt: "Wireframe of the project-manager data-entry landing page with the my projects table." },
            after: { src: `${hajj}/compare/pm-ui.png`, w: 1261, h: 691, alt: "Delivered UI of the project-manager data-entry landing page with the my projects table." },
            caption: "Both surfaces, from wireframe to delivered interface.",
          },
        ],
      },
    ],
    conclusion: { statement: ["The real transformation wasn’t the dashboard.", "It was changing how operational information moved through the organisation, from ground reality to leadership decision."] },
  },
  {
    // Rebuilt 2026-11-04 from three of the owner's sources: the live site, the Behance project "SecureLine Communication App"
    // (gallery 210562981) and the one-page PDF portfolio (case study 01). Owner, 2026-11-04: the name is SecureLine
    // (the screens still show SecureLine until re-exported), there was no access to users, the app was built in Flutter,
    // and the PDF is correct wherever it speaks. The saving is 3 months of development time (CV, works card, graph, AI twin; only the old page said 2). The PDF
    // names the client, but the page keeps it confidential. Key screens and the semantic colours are exports from the owner's
    // Figma files (Connect Me, TDS v1.2, 2026-11-04); the hero is still a crop of the Behance file.
    slug: "secure-communication-app",
    title: ["Secure Communication", "App"],
    eyebrow: "Design systems",
    subtitle: "Took a one-line brief from leadership to SecureLine, a secure communication app for iOS, Android and desktop, built on a design system that saved 3 months of development time.",
    summary: "Took a one-line brief from leadership to SecureLine, a secure communication app for iOS, Android and desktop, built on a design system that saved 3 months of development time.",
    tags: ["Enterprise communication", "iOS, Android + desktop", "Light + dark themes"],
    links: [{ label: "Behance case study", href: "https://www.behance.net/gallery/210562981/SecureLine-Communication-App" }],
    meta: [
      { label: "Client", value: "Confidential" },
      { label: "Year", value: "2024" },
      { label: "Role", value: "Senior Product Designer, concept to post-launch" },
      { label: "Platforms", value: "iOS, Android, desktop native" },
      { label: "Impact", value: "3 months of development time saved" },
    ],
    hero: { src: `${secure}/hero-dark.jpg`, w: 1400, h: 800, alt: "SecureLine on a laptop: the home screen with today’s meetings, recent chats, the Daily standup participants and its group chat." },
    thumbnail: `${secure}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [
          { type: "text", text: "SecureLine is a secure communication application designed for the defence industry. Its military-grade encryption lets employees across the organisation collaborate and share information: they schedule meetings, message each other, and hold voice and video calls." },
          { type: "text", muted: true, text: "As Senior Product Designer I owned the design from concept to post-launch, and delivered and supported two product lifecycles." },
          {
            type: "cards",
            items: [
              { icon: "target", art: "secure-chat", label: "Project goal", body: "Design an enterprise communication app for secure communication between employees inside the organisation." },
              { icon: "users", art: "one-app", label: "Users", body: "Employees within the client organisation, who needed one app for official communication and scheduling." },
              { icon: "layers", art: "legacy-layers", label: "Constraint", body: "New designs had to build on the organisation’s existing legacy application framework and its system rules." },
            ],
          },
        ],
      },
      {
        eyebrow: "The problem",
        title: "A one-line brief",
        body: [
          { type: "text", text: "There were no product requirements, only one line from leadership: build an enterprise app for all internal employee communication. Enterprise communication platforms already existed, but none could be tailored to the organisation’s employees or meet its security needs." },
          {
            type: "list",
            items: [
              "Tight deadline: the first key screens were due in 3 weeks.",
              "No access to users: the domain is sensitive, so direct contact with users to gather requirements was restricted.",
            ],
          },
        ],
      },
      {
        eyebrow: "Approach",
        title: "Approach",
        body: [
          { type: "text", text: "Without users to interview, I worked from the market, from the system, and from quick validation:" },
          {
            type: "features",
            items: [
              { icon: "search", art: "feature-checklist", label: "Competitor analysis", body: "Competitor analysis of enterprise communication apps set the essential features to build.", points: ["User onboarding", "Chat", "Video and audio calls", "Meetings", "Settings", "User profile"] },
              { icon: "component", art: "component-kit", label: "Design system first", body: "I built on a design system framework and designed the most frequently used components first, which is how the 3-week deadline was met.", image: { src: `${secure}/tds-buttons.png`, w: 1480, h: 740, alt: "The TDS button matrix for mobile: primary and secondary buttons in small, medium and large, with and without icons." } },
              { icon: "user-check", art: "test-loop", label: "Iterative guerrilla testing", body: "Guerrilla testing validated the designs, found usability issues and tested our assumptions, round after round." },
            ],
          },
        ],
      },
      {
        eyebrow: "Design system",
        title: "One system for mobile, desktop and web",
        body: [
          { type: "text", text: "The library is organised the way it is used: foundations, then tokens, then components." },
          {
            type: "iconGrid",
            items: [
              { icon: "palette", label: "Foundations", body: "Colour, border, layout, spacing, typography and icons, each a page of the Figma library." },
              { icon: "braces", label: "Semantic tokens", body: "54 semantic colours in five groups: 17 for content, 17 for backgrounds, 11 for borders, 7 surface levels and 2 overlays. Each name points to a different primitive in light and dark, so a component never changes when the theme does." },
              { icon: "sun-moon", label: "Variables and modes", body: "Figma variables carry the light and dark modes across mobile, desktop and code." },
              { icon: "component", label: "Components", body: "Avatars, buttons, badges, chips and tags, top, bottom and title bars, the navigation drawer, controls, text input, alerts, banners, snackbars, lists and message bubbles, with their variants and sizes for mobile and web." },
            ],
          },
        ],
        figures: [
          { src: `${secure}/tds-semantic-colors.png`, w: 1008, h: 812, alt: "The Semantic colors page of the TDS design system: content tokens such as Content Primary, Content Brand and Content Link, each mapped to a neutral or brand primitive, shown side by side in light and dark.", caption: "Semantic content colours in TDS v1.2, light beside dark. Same token names, different primitives." },
          { src: `${secure}/detail-1.png`, w: 1400, h: 866, alt: "The SecureLine home screen on mobile and desktop, each split half dark and half light, next to Figma’s variable mode menu set to Dark.", caption: "The same screens in dark and light, switched by variable mode in Figma." },
          { src: `${secure}/detail-2.png`, w: 1290, h: 740, alt: "The component library pages in Figma, laid out at an angle: buttons, typography headings, colour scales and navigation.", caption: "The component library." },
        ],
      },
      {
        eyebrow: "Key screens",
        title: "Home, meetings, calls and one way to start anything",
        body: [{ type: "text", text: "Four screens from the mobile app, exported from the product’s Figma file. Each one comes in both themes, built from the same design tokens." }],
        showcase: [
          {
            label: "Home",
            lead: "Today at a glance: the next meetings and the latest chats on one screen.",
            points: [
              "Meetings sit at the top as swipeable cards, each with its time, purpose, organiser and status.",
              "Recent chats follow, with attachments, read receipts and unread counts.",
              "The bottom bar reaches Meetings, Calls and Chats in one tap.",
            ],
            dark: { src: `${secure}/screens/home-dark.png`, w: 750, h: 1624, alt: "SecureLine home screen in dark mode: a Daily standup meeting card marked Pending, then recent chats with unread counts." },
            light: { src: `${secure}/screens/home-light.png`, w: 750, h: 1624, alt: "SecureLine home screen in light mode: a Daily standup meeting card marked Pending, then recent chats with unread counts." },
          },
          {
            label: "Meetings",
            lead: "A dashboard to manage and understand ongoing and upcoming meetings.",
            points: [
              "Each card carries the date and time, the meeting’s purpose and who organised it.",
              "Status chips show what still needs a response.",
              "Sort and filter controls keep a long schedule manageable.",
            ],
            dark: { src: `${secure}/screens/meetings-dark.png`, w: 750, h: 1624, alt: "SecureLine meetings screen in dark mode: Daily standup, Sprint backlog and Product road map cards with sort and filter icons." },
            light: { src: `${secure}/screens/meetings-light.png`, w: 750, h: 1624, alt: "SecureLine meetings screen in light mode: Daily standup, Sprint backlog and Product road map cards with sort and filter icons." },
          },
          {
            label: "Calls",
            lead: "Recent call logs with their history, and a call back by video or voice from each one.",
            points: [
              "A missed call stands out in the brand colour.",
              "An arrow shows whether each call came in or went out, with its time.",
              "Video and voice buttons sit on every row for a one-tap call back.",
            ],
            dark: { src: `${secure}/screens/calls-dark.png`, w: 750, h: 1624, alt: "SecureLine calls screen in dark mode: four recent calls, the first a missed call in orange, each with video and voice buttons." },
            light: { src: `${secure}/screens/calls-light.png`, w: 750, h: 1624, alt: "SecureLine calls screen in light mode: four recent calls, the first a missed call in orange, each with video and voice buttons." },
          },
          {
            label: "Create new",
            lead: "One plus button starts anything: a meeting, a call or a chat.",
            points: [
              "The same button sits in the top bar of every screen.",
              "A bottom sheet keeps the current screen in view behind it.",
              "Its three options match the three tabs in the bottom bar.",
            ],
            dark: { src: `${secure}/screens/create-dark.png`, w: 750, h: 1624, alt: "SecureLine Create New bottom sheet in dark mode over the dimmed home screen, offering Meeting, Calls and Chats." },
            light: { src: `${secure}/screens/create-light.png`, w: 750, h: 1624, alt: "SecureLine Create New bottom sheet in light mode over the dimmed home screen, offering Meeting, Calls and Chats." },
          },
        ],
      },
      {
        eyebrow: "After launch",
        title: "Requests from a custom-built product",
        body: [
          { type: "text", text: "Because the product was tailored to one organisation, its users came back with requests of their own:" },
          {
            type: "definitions",
            items: [
              { label: "My Teams and departments", body: "Lets users organise and reach colleagues within their own teams and departments." },
              { label: "Chats with moderators", body: "Users can create chat rooms and give moderators special privileges to manage discussions." },
              { label: "Late design tokens", body: "Design tokens came into Figma near the end of the product cycle, which challenged our design plan." },
            ],
          },
        ],
      },
      {
        eyebrow: "Accomplishments & takeaways",
        title: "Accomplishments & takeaways",
        body: [
          {
            type: "list",
            items: [
              "Thrived in the understanding and concept phase, developing solutions that worked despite limited user interaction.",
              "Organised one design system to serve two product lines, saving 3 months of development time.",
              "Implementing Figma variables for the Flutter environment had a learning curve, but integrating them for dark and light mode through design tokens was ultimately rewarding.",
            ],
          },
        ],
      },
    ],
    conclusion: {
      statement: ["SecureLine’s pilot release shipped within the agreed timeframe,", "and a client has signed off on its implementation for their organisation."],
      rest: "Reusable components from the design system streamlined development, and iterative usability testing earned positive feedback from potential clients. SecureLine is now a prominent product in the company’s portfolio.",
    },
  },
  {
    // Rebuilt 2026-11-03 from the owner's PDF portfolio (case study 03), the source of truth for every figure here, plus the
    // owner's Behance projects "Dubainow Design system" and "Dubainow Report accident". The owner designed the system alone.
    slug: "dubainow-mobile-app",
    title: ["DubaiNow", "Mobile App"],
    eyebrow: "Product design · Government sector",
    subtitle: "A design system first, then 57 services built on it in a year",
    summary: "Built the DubaiNow design system and used it to deliver 28 new and 29 enhanced government services in a year, lifting CSAT to 70%.",
    tags: ["Government B2C", "115+ services", "Design system", "iOS + Android", "Paperless strategy"],
    meta: [
      { label: "Client", value: "Digital Dubai government" },
      { label: "Role", value: "Customer Experience Designer" },
      { label: "Timeline", value: "Design system 4 months, services 8 months" },
      { label: "Results", value: "57 services in a year, CSAT 70%" },
    ],
    // The artwork has far more empty margin above and below than at the sides, so the live site trims it to this ratio.
    hero: { src: `${dubai}/banner.png`, w: 2400, h: 1976, alt: "DubaiNow Mobile App", aspect: "2400 / 1300" },
    thumbnail: `${dubai}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "One app for 115+ government services",
        body: [
          { type: "text", text: "DubaiNow is the only Dubai Government app for city services, giving residents access to 115+ government services, from bills and residency to police and driving. It is part of Dubai’s paperless strategy, which moves every government service into the app." },
          { type: "text", muted: true, text: "As Customer Experience Designer I created the app’s design system, then designed services on it from concept to release and tracked how they performed." },
        ],
        figures: [{ src: `${dubai}/services-home.png`, w: 1788, h: 1140, alt: "The DubaiNow home screen with its service categories, next to the Police category with the Report Accident service.", caption: "115+ services, grouped by category." }],
      },
      {
        eyebrow: "The problem",
        title: "Inconsistent services, and a paperless deadline",
        body: [
          { type: "text", text: "Users found the services inconsistent and confusing. Page flows changed from one service to the next, which frustrated people, raised drop-off and lowered satisfaction scores." },
          {
            type: "list",
            items: [
              "Components were only partly reusable, and developers working in silos gave them their own behaviours.",
              "Developers had limited time to build reusable components, so new services kept reusing legacy designs.",
              "The paperless strategy needed new services in the app within months, leaving little time for research.",
            ],
          },
          {
            type: "definitions",
            items: [
              { label: "Objective 1", body: "Reduce the drop-off rate by at least 30% within 6 months." },
              { label: "Objective 2", body: "Redesign all 22 existing services on the new design system, to fix inconsistency and improve CSAT within 6 months." },
              { label: "Objective 3", body: "Bring at least 20 new services into the app within 8 months, as part of the paperless strategy." },
            ],
          },
        ],
      },
      {
        eyebrow: "Research",
        title: "Analytics, app store feedback and personas",
        body: [{
          type: "definitions",
          items: [
            { label: "Stakeholder workshops", body: "To understand the requirements of the new services." },
            { label: "Data analysis", body: "Firebase analytics on the previous app, to see how people used it and where they dropped off." },
            { label: "Secondary research", body: "App store feedback, and CSAT scores with feedback from the customer experience team." },
            { label: "Personas", body: "Built from the analytics and app store reviews, segmented by usage, to keep the target users in view." },
            { label: "Competitor analysis", body: "Popular design systems, Apple’s Human Interface Guidelines and Material Design, since the app is native." },
          ],
        }],
        figures: [{ src: `${dubai}/detail-1.png`, w: 1600, h: 1200, alt: "Persona profiling: a table of users segmented by usage, the Emirati father persona card, and his service usage from analytics.", caption: "Personas segmented by real usage data." }],
      },
      {
        eyebrow: "Part 1 · The design system",
        title: "A shared system before more services",
        body: [
          { type: "text", text: "A reusable design system gives every squad the same components, so users get one consistent experience across services. Designers spend less time per service, and developers reuse most of what they build." },
          { type: "text", muted: true, text: "Brand workshops with stakeholders set the style as elegant, classy and modern. Typography is native, SF Pro on iOS and Roboto on Android, on an 8pt grid, with four icon families: category, microapp, microapp badge and contextual." },
        ],
        steps: [
          { label: "Research & audit", body: "An inventory of existing components, reusable and not, and of the best design systems." },
          { label: "Foundations", body: "Colour, type, scale, grid, icons and voice, defined from the new brand identity." },
          { label: "Components", body: "Built the 20% of components that cover 80% of the UI first, then the rest." },
          { label: "Documentation", body: "Behaviour, specs and Zeplin links in Confluence for the whole team." },
        ],
        figures: [{ src: `${dubai}/foundations.png`, w: 1400, h: 1090, alt: "The DubaiNow foundations: primary blue and greys, native iOS and Android type scales, and the 8pt grid.", caption: "Foundations: colour, native type and an 8pt grid." }],
      },
      {
        eyebrow: "Testing the system",
        title: "Paper cut-outs to learn how users group components",
        body: [{
          type: "list",
          items: [
            "Analysed the old app’s components to find which were used most, which set the system’s priorities.",
            "Tested the designed components with users as paper cut-outs. They thought aloud as they sorted and used them.",
            "Refactored the components on that feedback, then released them. Duplicates were removed and broken components fixed.",
          ],
        }],
        figures: [{ src: `${dubai}/paper-testing.png`, w: 2960, h: 888, alt: "The first components in Figma, users sorting printed paper cut-outs of them, and the refactored component library.", caption: "From first components, to paper testing, to the released library." }],
      },
      {
        eyebrow: "Adoption",
        title: "A system the whole team uses",
        body: [{
          type: "definitions",
          items: [
            { label: "Education", body: "Weekly presentations to the whole team with success stories and challenges, followed by brainstorming. Team members helped name and explain components." },
            { label: "Documentation", body: "An internal site in Confluence, where anyone can look up a component’s behaviour, specs, Zeplin links, constraints and best practice." },
            { label: "Testing", body: "When developers finished a component, I ran an expert review of the built UI, then tested it again with users." },
          ],
        }],
        figures: [
          { src: `${dubai}/components.png`, w: 840, h: 788, alt: "Isometric view of the DubaiNow component library: inputs, alerts, cells, steppers and payment totals." },
          { src: `${dubai}/documentation.png`, w: 700, h: 788, alt: "The design system documentation site showing a profile card component with its variants and code.", caption: "The component library, and its documentation." },
        ],
      },
      {
        eyebrow: "Part 2 · Services",
        title: "Every service: requirement, service diagram, UI",
        body: [{ type: "text", text: "Each service started with the government entity that owns it, and its requirement was sometimes a single line. I turned it into a service diagram, then designed the UI from system components. When a component was missing, I created it with its use cases and added it to the system through governance." }],
        steps: [
          { label: "Understand", actor: "Entity stakeholders", body: "Gather the requirement in a meeting with the government entity." },
          { label: "Service diagram", body: "A flow diagram, as detailed as the service’s complexity needs." },
          { label: "UI design", body: "Screens built from design system components, with new ones governed into the system." },
        ],
        figures: [{ src: `${dubai}/service-diagrams.png`, w: 2938, h: 900, alt: "Service diagrams: the full residency service flow by stage, the GDRFA reports flow, and the mobile contracts flow from sketch to wireframes.", caption: "Service diagrams for residency, GDRFA reports and mobile contracts." }],
      },
      {
        eyebrow: "Service redesign",
        title: "Get Residency, rebuilt on the system",
        body: [{ type: "text", text: "The same steps, costs and fields, moved onto system components: step cards with a status and a start action, grouped form fields, and the standard header, Continue button and tab bar." }],
        comparisons: [{
          title: "Get Residency, before and after",
          labels: ["Before", "After"],
          before: { src: `${dubai}/residency-before.png`, w: 1600, h: 1040, alt: "The old Get Residency service: an orange-headed steps list, a sponsor form and a passport details form." },
          after: { src: `${dubai}/residency-after.png`, w: 1600, h: 1040, alt: "The redesigned Get Residency service on the design system: step cards with cost and duration, application details and passport details." },
          caption: "Residency category: the Get Residency service redesigned on the design system.",
        }],
      },
      {
        eyebrow: "Service in focus",
        title: "Report Accident: a collision report without a station visit",
        body: [
          {
            type: "definitions",
            items: [
              { label: "Project goal", body: "A DubaiNow service to report a collision between vehicles." },
              { label: "User goal", body: "Get an accident report to repair the car and claim the cost from insurance." },
              { label: "Prerequisite", body: "Dubai residents and expats with UAE Pass access." },
            ],
          },
          {
            type: "list",
            items: [
              "The location is picked on the map first, so nobody types an address at the roadside.",
              "At least two vehicles are involved, so the vehicle count starts at 2 and can’t go lower.",
              "Saved vehicles and drivers come first, with manual entry and plate scan as fallbacks.",
              "Each vehicle gets its own plate, driver and up to four damage photos.",
              "Anyone unsure who is liable is sent to the nearest police station, not forced to guess.",
            ],
          },
        ],
        steps: [
          { label: "Location & vehicles", body: "Pin the accident on the map and set the number of vehicles." },
          { label: "Accident details", body: "Plate, driver and damage pictures for each vehicle." },
          { label: "Liability", body: "Select who is liable, or go to the nearest police station." },
          { label: "Report history", body: "Submit, then see the issued report from the report history." },
        ],
        figures: [
          { src: `${dubai}/accident-location.png`, w: 1792, h: 640, alt: "The first step: the accident pinned on the map, and a stepper for the number of vehicles that starts at two." },
          { src: `${dubai}/accident-details.png`, w: 1792, h: 1215, alt: "Accident details for each vehicle: plate from the user’s vehicle list, driver from their drivers list, and damage pictures." },
          { src: `${dubai}/accident-liability.png`, w: 1792, h: 700, alt: "Selecting who is liable for the accident, then the submitted report in the report history.", caption: "Location, accident details, then liability and the report." },
        ],
      },
      {
        eyebrow: "Results",
        title: "57 services in a year, and CSAT at 70%",
        body: [{
          type: "definitions",
          items: [
            { label: "New services", body: "28 new services delivered within a year, against a target of 20." },
            { label: "Enhanced services", body: "29 existing services redesigned on the design system in the same year." },
            { label: "Satisfaction", body: "The redesigned services reached a CSAT score of 70%, above the 60% target." },
          ],
        }],
        figures: [{ src: `${dubai}/accident-screens.png`, w: 1792, h: 1008, alt: "Report Accident screens on angled phones: the Police category, vehicle count, vehicle plates and liability." }],
      },
    ],
    conclusion: {
      statement: ["The DubaiNow app, with its new brand identity and services built on one system,", "won ICXA’s Gold Award in 2020 for “Customer at heart of everything.”"],
      rest: "The design system came first, and it is why 57 services could ship in a year and still feel like one app.",
    },
  },
  {
    // Figures follow the owner's PDF portfolio 3.0 (case study 02, pages 08 to 12) and the owner's outcome summary of 2026-11-04,
    // which is final: three reported outcomes (digital customer retention, NPS, complaints). Feature engagement stays unquantified, and the
    // 85% feedback figure is out. Objective 3 (conversion) has no reported result, so none is claimed.
    slug: "emirates-islamic-digital-ux",
    title: ["Emirates Islamic", "Digital UX"],
    eyebrow: "Product design · Banking",
    subtitle: "Turning low digital engagement into repeat usage for Emirates Islamic’s existing customers, as the only designer in an agile squad.",
    summary: "Fixed recurring pain points and shipped customer-requested features across Emirates Islamic’s mobile, tablet and online banking, lifting digital customer retention from below 20% to a weekly average of 55% in 20 sprints.",
    tags: ["Banking B2C", "Mobile, tablet + online banking", "Sole designer in an agile squad", "20 sprints"],
    links: [
      { label: "Live website", href: "https://www.emiratesislamic.ae" },
      { label: "EI+ on Google Play", href: "https://play.google.com/store/apps/details?id=com.emiratesislamic.android" },
    ],
    meta: [
      { label: "Client", value: "Emirates Islamic Bank" },
      { label: "Year", value: "2018" },
      { label: "Role", value: "Product Designer" },
      { label: "Platforms", value: "Mobile, tablet apps & online banking" },
      { label: "Timeline", value: "10 months · 20 two-week sprints" },
    ],
    hero: { src: `${emirates}/banner.png`, w: 2560, h: 1440, alt: "The Emirates Islamic website on desktop next to the EI+ mobile app login screen." },
    thumbnail: `${emirates}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [
          { type: "text", text: "Emirates Islamic Bank (EIB) is a United Arab Emirates based bank providing Sharia-compliant banking. As part of the Emirates NBD group, it serves its own base of premium, loyal customers." },
          { type: "text", muted: true, text: "Those customers were not using digital banking. I was the only designer in the agile squad formed to change that, responsible for all UX from concept to after-live support, across the mobile app, tablet app and online banking website." },
        ],
      },
      {
        eyebrow: "The problem",
        title: "Low engagement, frequent complaints",
        body: [
          { type: "text", text: "Emirates Islamic’s existing customers showed low engagement with digital channels: digital user retention was below 20%. The customers who did use digital services complained often, through retail branches and app store reviews." },
          {
            type: "list",
            items: [
              "Low digital engagement limited the bank’s cost-saving opportunities and revenue growth.",
              "Frequent complaints risked customer satisfaction and retention. Left unresolved, they meant higher operational costs and missed opportunities to grow through digital channels.",
            ],
          },
        ],
      },
      {
        eyebrow: "Goals & objectives",
        title: "Three objectives for the squad",
        body: [{ type: "text", text: "The goal was to enhance the overall user experience and increase digital adoption among existing customers. For UX, that became three objectives." }],
        steps: [
          { label: "Objective 1", body: "Fix at least 70% of the high-impact user pain points identified by the business." },
          { label: "Objective 2", body: "Increase the digital user retention rate to above 50%." },
          { label: "Objective 3", body: "Increase the conversion rate of digital banking users by at least 20%." },
        ],
      },
      {
        eyebrow: "Process",
        title: "UX inside a two-week sprint cycle",
        body: [{ type: "text", text: "The squad had limited time, so the challenge was fitting UX methods into agile. After a stakeholder workshop, UX discovery happened mainly at the product backlog stage." }],
        steps: [
          { label: "Backlog grooming", actor: "UX discovery", body: "Understood the business goal and user pain point behind each story. Validated and grouped stories, prioritised them through user story mapping, and sent a user survey when a story needed more evidence before entering a sprint." },
          { label: "Sprint planning", actor: "Sizing", body: "Assigned story points by effort, sorted stories into small, medium and large, and explained the rationale for prioritising each design deliverable." },
          { label: "Agile sprints", actor: "Testing", body: "Paper sketches for brainstorming, guerrilla testing with employees outside the squad to check each design hypothesis, and competitor analysis of similar finance products." },
        ],
        figures: [{ src: `${emirates}/story-map.png`, w: 1566, h: 975, alt: "User story map: the squad’s three objectives across the top, the epics that serve each, and user stories below in P1, P2 and P3 rows.", caption: "User story mapping, prioritised by impact against each objective." }],
      },
      {
        eyebrow: "UI design during sprints",
        title: "Two design tracks, sized to the work",
        body: [
          {
            type: "definitions",
            items: [
              { label: "New features", body: "Understand → Page flow and information architecture → Wireframes → UI design → Testing." },
              { label: "Minor requirements", body: "Understand → Paper sketches → UI design → Testing." },
            ],
          },
          { type: "text", muted: true, text: "Work designed in sprints included ATM self-withdrawal on mobile (a new feature), the NOL top-up redesign, international transfer, and spending analysis and bill payments in online banking." },
        ],
        figures: [
          { src: `${emirates}/detail-1.png`, w: 1260, h: 648, alt: "International transfer on mobile, before and after the enhancement." },
          { src: `${emirates}/detail-2.png`, w: 1260, h: 648, alt: "New digital features, cardless cash withdrawal and Noqodi payments, and financial budgeting enhancements on the tablet app." },
        ],
      },
      {
        eyebrow: "Outcomes",
        title: "Retention up, complaints down",
        body: [{
          type: "definitions",
          items: [
            { label: "Digital customer retention", body: "Increased from below 20% to a weekly average of 55% by sprint 20, beating the 50% target." },
            { label: "Customer advocacy (NPS)", body: "Exceeded 85." },
            { label: "Customer complaints", body: "Reduced to fewer than 3 per week by sprint 18." },
            { label: "Feature engagement", body: "Newly introduced features showed returning and regular customer usage." },
          ],
        }],
      },
      {
        eyebrow: "Why it worked",
        title: "Why the numbers moved",
        body: [{
          type: "list",
          items: [
            "Improved existing banking journeys by addressing recurring customer pain points.",
            "Reduced customer friction and improved the overall digital banking experience.",
            "Introduced customer-requested features to address unmet needs.",
            "Encouraged repeat usage and stronger engagement with digital banking services.",
            "Improved customer advocacy and reduced recurring complaints.",
          ],
        }],
      },
      {
        eyebrow: "Measurement",
        title: "How we measured it",
        body: [{
          type: "definitions",
          items: [
            { label: "Digital customer retention", body: "Digital traffic analytics tracking returning customers after 30 days." },
            { label: "NPS", body: "Customer feedback and recommendation scores." },
            { label: "Customer complaints", body: "Weekly complaint volume, monitored across sprint releases." },
            { label: "Feature adoption", body: "Unique customers using newly released features." },
            { label: "Repeat feature usage", body: "Customers returning to use the same features over a defined 30-day period." },
          ],
        }],
      },
    ],
    conclusion: {
      statement: ["Twenty sprints took digital customer retention from below 20% to a weekly average of 55%,", "with NPS above 85 and complaints under 3 a week by sprint 18."],
      rest: "The lesson I carry forward: guerrilla testing validated assumptions quickly, but a few stories still needed rework, so formal usability testing belongs inside the sprints.",
    },
  },
  {
    slug: "ai-banking-copilot",
    title: ["AI Banking", "Copilot"],
    eyebrow: "AI product design · Vibe coded",
    subtitle: "From AI concept to working prototype in 6 days.",
    summary: "Designing an AI-native banking experience and transforming it into a working prototype using AI-assisted development.",
    links: [ // the Live prototype button went when the prototype was embedded below (owner, 2026-11-03)
      { label: "GitHub repository", href: copilotRepository },
    ],
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Duration", value: "6 days" },
      { label: "Type", value: "AI concept + vibe-coded prototype" },
      { label: "Stack", value: "Figma · Claude Code · Cursor · React Native · Expo · GitHub" },
      { label: "Repository", value: "Public on GitHub" },
    ],
    prototype: { src: copilotPrototype, title: "AI Banking Copilot live prototype" },
    heroPhones: [
      { src: `${copilot}/home.png`, ...phone, alt: "Copilot home screen: a natural-language prompt field, four workflow shortcuts, and a proactive insights list flagging a spending rise and two ways to save." },
      { src: `${copilot}/explain-transaction.png`, ...phone, alt: "A transaction opened into a plain-language explanation of what the charge was, with the amount, merchant, date and reference listed underneath." },
      { src: `${copilot}/analyze-spending.png`, ...phone, alt: "Spending analysis screen: total spent for the period against the previous month, a category breakdown donut, and proactive insights." },
      { src: `${copilot}/find-best-product.png`, ...phone, alt: "Product recommendation outcome: the customer is pre-qualified for a matched travel credit card, with an approval probability and the conditions of the offer." },
      { src: `${copilot}/resolve-issue.png`, ...phone, alt: "Issue resolution screen: an unauthorised charge reported in conversation, then routed into a typed dispute the assistant can raise as a ticket." },
    ],
    thumbnail: `${copilot}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [
          { type: "text", text: "Designing an AI-native banking experience and transforming it into a working prototype using AI-assisted development." },
          { type: "text", muted: true, text: "Instead of building another banking app, this project explores how AI understands context, recommends next-best actions and orchestrates complete workflows." },
        ],
      },
      {
        eyebrow: "Why it matters",
        title: "Banking has always made customers do the thinking.",
        body: [
          { type: "text", text: "The AI Copilot changes who does the thinking." },
          { type: "text", muted: true, text: "Traditional banking expects customers to search, compare, understand products and decide what to do next." },
          { type: "text", muted: true, text: "AI Banking Copilot shifts that cognitive work to the assistant. It understands intent, reasons with customer context and recommends the best next action." },
          {
            type: "definitions",
            items: [
              { label: "Traditional banking · Customer does the thinking", body: "Goal → Search → Compare → Fill forms → Submit" },
              { label: "AI Banking Copilot · Customer states a goal", highlight: true, body: "Goal → AI understands → AI reasons → AI recommends → Customer confirms" },
            ],
          },
        ],
      },
      {
        eyebrow: "AI workspace",
        title: "Four workflows, one copilot",
        phonesPaired: true,
        body: [
          { type: "text", text: "Each workflow starts from what the customer is actually trying to do, and ends in a completed action rather than an answer." },
          {
            type: "definitions",
            items: [
              {
                label: "Explain transactions",
                body: "A charge the customer doesn’t recognise is answered in a single turn, covering what it was, who took it and what they can do about it.",
                points: [
                  "Answers in plain language first: the merchant and the reason for the charge, before any transaction detail.",
                  "Backs the answer with the record (amount, merchant, date and reference), so the customer can check the explanation for themselves.",
                  "Ends on the three actions that actually follow: view the bill, download the receipt, or report a problem.",
                  "Leaves the thread open, so the next question continues the conversation instead of restarting it.",
                ],
              },
              {
                label: "Analyze spending",
                body: "The analysis is set up in conversation, choosing which accounts and what period, and comes back as something to act on rather than read.",
                points: [
                  "Asks two questions before answering, and no more: which accounts, and which timeframe.",
                  "Leads with the total and its movement against the previous month, then the category split behind it.",
                  "Names the specific things worth knowing, like the category that jumped or the saving that was missed.",
                  "Turns each insight into a recommendation with the control attached: set the budget, view the offers, enable the alerts.",
                ],
              },
              {
                label: "Find best product",
                body: "Product discovery reasons over the customer’s own spending, then proves the recommendation before asking them to apply for anything.",
                points: [
                  "Ranks by net annual benefit against real spending, not by product tier or marketing order.",
                  "Justifies the match with the customer’s own data, such as where the money goes, how often they fly and what they currently earn on it.",
                  "Checks eligibility in place against income, tenure and credit score, without touching the credit file.",
                  "Ends pre-qualified with the terms stated up front: documents, timing, and the odds of approval.",
                ],
              },
              {
                label: "Resolve issues",
                body: "A reported problem is carried all the way to a raised, referenced case, inside the same conversation that surfaced it.",
                points: [
                  "Picks the dispute up from the transaction already on screen, with no separate support journey to find.",
                  "Confirms what it understood before acting, and has the customer name the issue type rather than assuming it.",
                  "Files the case itself and shows the summary it submitted, so nothing is raised on the customer’s behalf unseen.",
                  "Returns a ticket reference and a route back to it, so the issue outlives the session.",
                ],
              },
            ],
          },
        ],
        phones: [
          { src: `${copilot}/explain-transaction.png`, ...phone, alt: "The explain-transaction flow: a question about a deduction answered with the charge’s origin, its details, and the actions available next." },
          { src: `${copilot}/analyze-recommendations.png`, ...phone, alt: "The end of the spending analysis flow: each insight turned into a recommendation the customer can act on, with quick actions underneath." },
          { src: `${copilot}/product-eligibility.png`, ...phone, alt: "The product recommendation flow checking eligibility in place. Income, tenure and credit score are confirmed against the customer’s own data before any application starts." },
          { src: `${copilot}/resolve-issue-confirmed.png`, ...phone, alt: "The end of the issue resolution flow: the dispute raised and confirmed, with a case summary and a ticket reference the customer can return to." },
        ],
      },
      {
        eyebrow: "How I built it",
        title: "From concept to prototype in 6 days",
        body: [
          { type: "text", text: "AI accelerated execution, allowing ideas to move from concept to a working prototype in days instead of weeks." },
          {
            type: "definitions",
            items: [
              { label: "Live prototype", body: "Explore the AI Banking Copilot experience across mobile and web.", link: { label: "Try prototype", href: copilotPrototype } },
              { label: "Public GitHub", body: "Inspect the implementation, project structure and development history.", link: { label: "View repository", href: copilotRepository } },
              { label: "Built with", body: "Figma · Claude Code · Cursor · React Native · Expo · TypeScript · GitHub" },
            ],
          },
        ],
        steps: [
          { label: "Explore", body: "Benchmark AI experiences" },
          { label: "Design", body: "Create AI-first workflows" },
          { label: "Vibe code", body: "Transform into a working prototype" },
          { label: "Ship", body: "Interactive prototype + GitHub" },
        ],
      },
    ],
    conclusion: { statement: ["The AI does the thinking.", "The customer stays in control."], rest: "It understands the goal, reasons over the customer’s own data and recommends the next step, but nothing happens until the customer confirms." }, // owner, 2026-11-03
  },
];

export const caseStudySection = {
  back: "Back to work",
  conclusion: "Conclusion",
  moreLabel: "Next case studies",
  moreHeading: "More works",
  readCase: "Read case study",
  prototypeLabel: "Try the live prototype", // our UI labels for the embed, not from the live site
  prototypeOpen: "Open in a new tab",
};

export const getCaseStudy = (slug: string) => caseStudies.find((study) => study.slug === slug);

export const nextCaseStudies = (slug: string, count = 2) => {
  const at = caseStudies.findIndex((study) => study.slug === slug);
  return Array.from({ length: count }, (_, i) => caseStudies[(at + i + 1) % caseStudies.length]);
};
