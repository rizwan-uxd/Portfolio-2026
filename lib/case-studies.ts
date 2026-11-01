// Case study pages (/work/<slug>), laid out from Figma 41:6 (desktop) and 43:6 (mobile). The copy and images come
// from the live site's /work/<slug> pages; the Hajj headings follow the Figma template, which carries the same text.
// Two rules from the live site's source: the Hajj client is only ever "Leading energy provider in Saudi", and its
// +25% card metric stays off this page, which says outright that no figures were measured. SecureLink's client stays confidential.

export type Figure = {
  src: string; w: number; h: number; alt: string; caption?: string;
  aspect?: string; // crops to this ratio; left out, the image shows whole
};
export type Definition = {
  label?: string; body: string;
  highlight?: boolean; // brand label, foreground body (Figma's "Governance decision")
  points?: string[];
  link?: { label: string; href: string };
};
export type Block =
  | { type: "text"; text: string; muted?: boolean }
  | { type: "list"; items: string[] }
  | { type: "definitions"; items: Definition[] };
export type Section = {
  eyebrow: string; title: string;
  body?: Block[];
  steps?: { label: string; actor?: string; body: string }[];
  phones?: Figure[]; // a row of portrait screens
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
      { label: "Delivery", value: "2026 Hajj season — MVP 3" },
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
            { label: "Governance decision", highlight: true, body: "The initial assumption was that Mecca users would correct project data directly. The validated model inverted it: the project manager reports reality, the Mecca team reviews, and then either approves and publishes or sends it back for revision. Catching this before the downstream design was built kept the approval trail, the states and the entire data-entry surface aligned with how the organisation actually works — the single clearest UX-leadership moment on the project." },
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
            { label: "Constraints navigated", body: "Power BI’s chart limitations meant investigating which visualisation patterns were actually supported and adapting the information design around what was feasible. The underlying data model could not be changed, so the work was designing around it — restructuring how information was surfaced, not touching the source structure." },
            { label: "The Hajj operating cycle", body: "The same dashboard was designed to shift focus across pre, during and post Hajj: readiness before, live operations during, and learning after." },
          ],
        }],
        figures: [
          { src: `${hajj}/states-board.png`, w: 2864, h: 1944, alt: "Data-entry platform wireframes for new project entry and the Mecca review screen, each next to the final UI design.", caption: "Data-entry platform: entry and review, wireframe to final UI." },
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
        figures: [{ src: `${hajj}/delivered-ecosystem.png`, w: 3104, h: 1944, alt: "Wireframes for the CEO dashboard and the project-manager data-entry landing page, each alongside the delivered UI design.", caption: "Both surfaces, from wireframe to delivered interface." }],
      },
    ],
    conclusion: { statement: ["The real transformation wasn’t the dashboard.", "It was changing how operational information moved through the organisation — from ground reality to leadership decision."] },
  },
  {
    slug: "secure-communication-app",
    title: ["Secure Communication", "App"],
    eyebrow: "Design systems",
    subtitle: "Designed a secure enterprise communication platform with a scalable design system and reusable React components, standardizing complex workflows across products and platforms.",
    summary: "Designed a secure enterprise communication platform with a scalable design system and reusable React components, standardizing complex workflows across products and platforms.",
    meta: [
      { label: "Client", value: "Confidential" },
      { label: "Year", value: "2024" },
      { label: "Role", value: "Senior Product Designer" },
      { label: "Services", value: "UX, Design system" },
    ],
    hero: { src: `${secure}/banner.png`, w: 2560, h: 1440, alt: "Secure Communication App" },
    thumbnail: `${secure}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [
          { type: "text", text: "SecureLink (name changed) is a custom-built enterprise communication platform that empowers high security government organizations to connect and collaborate securely. It enables employees to effortlessly schedule meetings, engage in instant messaging, and conduct high-quality voice and video conferences." },
          { type: "text", muted: true, text: "This case study explores the journey of converting a one line sentence from leadership to a full scale enterprise application with a custom built design system to a highest level of security, highlighting the challenges faced, the approach taken to address them, and the results achieved." },
        ],
        figures: [{ src: `${secure}/detail-1.png`, w: 1400, h: 866, alt: "Secure Communication App — process detail 1" }],
      },
      {
        eyebrow: "The problem",
        title: "The problem",
        body: [
          { type: "text", text: "The problem at hand was the lack of proper product requirements. It is just a one liner from leadership that we need to create an enterprise app for all employee internal communication. While there were few platforms available for enterprise communication apps, they often failed to provide customization tailored to organization employees with security in question." },
          {
            type: "list",
            items: [
              "Tight deadlines: Initial product key screens delivery deadlines were tighter and due in 3 weeks.",
              "Access to target users: No access to potential end users as it’s highly confidential.",
            ],
          },
        ],
      },
      {
        eyebrow: "Approach",
        title: "Approach",
        body: [
          { type: "text", text: "To address these problems and create a highly secured enterprise communication app with customizations, the following approach was taken:" },
          {
            type: "definitions",
            items: [
              { label: "Competitor analysis", body: "Defined primary features to build through secondary research & competitor analysis." },
              { label: "Design system", body: "Leveraging a design system framework and prioritizing frequently used components, able to meet deadlines." },
              { label: "Iterative guerilla testing", body: "Conducted guerilla testing for validation to identify usability issues and test design assumptions." },
            ],
          },
        ],
      },
      {
        eyebrow: "Accomplishments & takeaways",
        title: "Accomplishments & takeaways",
        body: [
          { type: "text", text: "Though we strive for positive outcomes, some projects give us experiences and learnings which I would like to note below:" },
          {
            type: "list",
            items: [
              "Thrived in the understanding and concept phase, leveraging my skills to develop successful solutions despite limited user interaction.",
              "Organized and streamlined design systems to cater to multiple product lines, reducing design and development time by 2 months.",
              "While there was a learning curve in implementing Figma variables for the Flutter environment, the process of successfully integrating them for dark and light mode using design tokens was ultimately rewarding.",
            ],
          },
        ],
        figures: [{ src: `${secure}/detail-2.png`, w: 1290, h: 740, alt: "Secure Communication App — process detail 2" }],
      },
    ],
    conclusion: {
      statement: ["SecureLink, our secure enterprise communication platform,", "successfully completed its pilot release within the agreed-upon timeframe with potential clients."],
      rest: "By leveraging reusable components from our design system, we were able to streamline development. Additionally, our iterative usability testing proved valuable as it yielded positive feedback from potential clients. SecureLink is now a prominent product within our company portfolio, and we’ve secured a client who has signed off on its implementation for their organization.",
    },
  },
  {
    slug: "dubainow-mobile-app",
    title: ["DubaiNow", "Mobile App"],
    eyebrow: "Product design",
    subtitle: "Redesigned a large-scale government mobile app, simplifying complex service journeys to improve usability and completion across key citizen interactions.",
    summary: "Redesigned a large-scale government mobile app, simplifying complex service journeys to improve usability and completion across key citizen interactions.",
    meta: [
      { label: "Client", value: "Digital Dubai government" },
      { label: "Year", value: "2019 – 2022" },
      { label: "Role", value: "CX Designer" },
      { label: "Services", value: "Mobile UX, Design system" },
    ],
    // The artwork has far more empty margin above and below than at the sides, so the live site trims it to this ratio.
    hero: { src: `${dubai}/banner.png`, w: 2400, h: 1976, alt: "DubaiNow Mobile App", aspect: "2400 / 1300" },
    thumbnail: `${dubai}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [{ type: "text", text: "DubaiNow app serves residents of Dubai with access to more than 120 government services. It’s a one stop shop for all government interactions. As a Customer Experience Designer, I optimize user experiences by analyzing app store feedback and designing innovative features for the DubaiNow app." }],
        figures: [{ src: `${dubai}/detail-1.png`, w: 1600, h: 1200, alt: "DubaiNow Mobile App — process detail 1" }],
      },
      {
        eyebrow: "The problem",
        title: "The problem",
        body: [
          { type: "text", text: "DubaiNow, a flagship government initiative, was mandated by the Ruler of Dubai to eliminate paper processes (Paperless strategy). This involves digitizing all government services. As a result there was an added pressure to deliver services." },
          {
            type: "list",
            items: [
              "Limited time: Identified 40 essential services for integration into the DubaiNow app within a demanding 6-month timeframe.",
              "Branding change: This project encompassed not only the integration and enhancement of services, but also a complete branding and visual identity overhaul – all within a tight deadline.",
              "Inconsistent experience: User feedback from app store reviews and usability studies, corroborated by Firebase analytics, indicated a high level of inconsistency within the DubaiNow app experience.",
            ],
          },
        ],
      },
      {
        eyebrow: "Approach",
        title: "Approach",
        body: [
          { type: "text", text: "The approach strategized to tackle the above problems is below:" },
          {
            type: "definitions",
            items: [
              { label: "Design System Approach", body: "The primary reason for adopting this approach was to leverage reusable components and establish consistency in all services." },
              { label: "Design Workshop", body: "Through a week-long collaborative design workshop and subsequent user testing, we successfully established a unified visual style and brand identity for the app." },
              { label: "Prioritization of components", body: "To accelerate service releases, we collaborated with developers in a workshop to identify and prioritize essential components. By pinpointing commonly used components and recognizing those missing from our library, we could expedite the design process and streamline future development efforts." },
            ],
          },
        ],
      },
      {
        eyebrow: "Results",
        title: "Results",
        body: [
          { type: "text", text: "The DubaiNow project yielded several positive results:" },
          {
            type: "definitions",
            items: [
              { label: "Consistent experience", body: "Implementing a design system with a unified visual identity resolved service inconsistencies, resulting in a decreased monthly churn rate for new services, as tracked by Firebase analytics." },
              { label: "Reduced development and design effort", body: "Typical service delivery cycle with design and development for a mid sized service was significantly reduced from an average of 1 month to 8 days." },
              { label: "Increased customer adoption", body: "New services and a refreshed brand identity combined to boost customer adoption, resulting in a 30% increase in conversion rate post-launch, according to analytics data." },
            ],
          },
        ],
        figures: [{ src: `${dubai}/detail-2.png`, w: 1200, h: 675, alt: "DubaiNow Mobile App — process detail 2" }],
      },
    ],
    conclusion: {
      statement: ["The DubaiNow app, featuring a new brand identity and expanded services, achieved remarkable success,", "winning ICXA’s Gold Award in 2020 for “Customer at the heart of everything.”"],
      rest: "This success was largely due to a well-executed design system strategy that prioritized essential components and aligned them with high-usage services.",
    },
  },
  {
    slug: "emirates-islamic-digital-ux",
    title: ["Emirates Islamic", "Digital UX"],
    eyebrow: "UX/UI",
    subtitle: "Optimized digital banking experiences by simplifying key financial workflows, reducing task time, and improving adoption across core user journeys.",
    summary: "Optimized digital banking experiences by simplifying key financial workflows, reducing task time, and improving adoption across core user journeys.",
    meta: [
      { label: "Client", value: "Emirates Islamic Bank" },
      { label: "Year", value: "2018" },
      { label: "Role", value: "UX designer" },
      { label: "Services", value: "Digital banking UX/UI" },
    ],
    hero: { src: `${emirates}/banner.png`, w: 2560, h: 1440, alt: "Emirates Islamic Digital UX" },
    thumbnail: `${emirates}/banner.png`,
    sections: [
      {
        eyebrow: "Overview",
        title: "Overview",
        body: [
          { type: "text", text: "Emirates Islamic Bank (EIB) is a United Arab Emirates based bank engaged in the provision of Sharia-compliant banking solutions." },
          { type: "text", muted: true, text: "This is one of the premium Islamic banks in the market, and as it’s connected to Emirates NBD, it has its own set of premium and loyal customers." },
        ],
        figures: [{ src: `${emirates}/detail-1.png`, w: 1260, h: 648, alt: "Emirates Islamic Digital UX — process detail 1" }],
      },
      {
        eyebrow: "The problem",
        title: "The problem",
        body: [
          { type: "text", text: "As the sole UX designer within a ten-person agile squad at Emirates Islamic, I was tasked with enhancing the digital customer journey across retail and online banking channels. The team focused on bug fixes, addressing customer feedback, and implementing feature requests." },
          {
            type: "list",
            items: [
              "Traditional banking environment: As part of a traditional bank, it’s very hard to explain the importance of user experience to people.",
              "UX maturity: A prevalent challenge was the limited understanding of UX design as a distinct discipline. Design was often equated with development, and the significance of clearly articulating problem statements was undervalued.",
              "UX in an Agile environment: The two-week sprint cycle demanded efficient planning and execution of design tasks. Close collaboration with development was essential as their work was dependent on design deliverables.",
            ],
          },
        ],
      },
      {
        eyebrow: "Approach",
        title: "Approach",
        body: [{
          type: "definitions",
          items: [
            { label: "Discovery in grooming", body: "By actively participating in grooming sessions, I ensured a deep understanding of user needs, business objectives, and the validity of user feedback. This critical analysis enabled precise problem identification before assigning story points." },
            { label: "T-shirt sizing UX stories", body: "To arrive at correct story points, I sized user stories assigned to me based on complexity and hours required, based on my experience — e.g. a simple UI enhancement (2–4 hours) sized “S” would need to be fixed across 3 digital channels." },
            { label: "Paper sketches", body: "To optimize ideation within tight deadlines, I used paper sketches to quickly ideate and brainstorm ideas with the team." },
          ],
        }],
      },
      {
        eyebrow: "Results",
        title: "Results",
        body: [
          { type: "text", text: "Agile methodologies accelerated time-to-market, enabling rapid feedback loops and iterative design refinements based on customer interactions." },
          {
            type: "definitions",
            items: [
              { label: "Increased digital adoption", body: "Within 2 months of our squad’s first release, digital adoption rose to 55% by the end of our squad’s tenure — 20% more than the success criteria of 35%." },
              { label: "Addressed UX feedback", body: "Addressed 75% of the UX feedback from customers by the end of 14 sprints." },
            ],
          },
        ],
        figures: [{ src: `${emirates}/detail-2.png`, w: 1260, h: 648, alt: "Emirates Islamic Digital UX — process detail 2" }],
      },
    ],
    conclusion: {
      statement: ["Over 24 sprints, the Emirates Islamic digital enhancement squad successfully cleared the backlog and resolved bugs,", "aligning with objectives of increased digital adoption, reduced customer complaints, and fewer customer service calls."],
      rest: "This fast-paced environment fostered innovative UX problem-solving through iterative guerilla testing and rapid paper prototyping.",
    },
  },
  {
    slug: "ai-banking-copilot",
    title: ["AI Banking", "Copilot"],
    eyebrow: "AI product design · Vibe coded",
    subtitle: "From AI concept to working prototype in 6 days.",
    summary: "Designing an AI-native banking experience and transforming it into a working prototype using AI-assisted development.",
    links: [
      { label: "Live prototype", href: copilotPrototype },
      { label: "GitHub repository", href: copilotRepository },
    ],
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Duration", value: "6 days" },
      { label: "Type", value: "AI concept + vibe-coded prototype" },
      { label: "Stack", value: "Figma · Claude Code · Cursor · React Native · Expo · GitHub" },
      { label: "Repository", value: "Public on GitHub" },
    ],
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
          { type: "text", muted: true, text: "AI Banking Copilot shifts that cognitive work to the assistant — understanding intent, reasoning with customer context, and recommending the best next action." },
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
        body: [
          { type: "text", text: "Each workflow starts from what the customer is actually trying to do, and ends in a completed action rather than an answer." },
          {
            type: "definitions",
            items: [
              {
                label: "Explain transactions",
                body: "A charge the customer doesn’t recognise is answered in a single turn — what it was, who took it, and what they can do about it.",
                points: [
                  "Answers in plain language first: the merchant and the reason for the charge, before any transaction detail.",
                  "Backs the answer with the record — amount, merchant, date, reference — so the explanation is checkable, not just plausible.",
                  "Ends on the three actions that actually follow: view the bill, download the receipt, or report a problem.",
                  "Leaves the thread open, so the next question continues the conversation instead of restarting it.",
                ],
              },
              {
                label: "Analyze spending",
                body: "The analysis is set up in conversation — which accounts, over what period — and comes back as something to act on rather than read.",
                points: [
                  "Asks two questions before answering, and no more: which accounts, and which timeframe.",
                  "Leads with the total and its movement against the previous month, then the category split behind it.",
                  "Names the specific things worth knowing — the category that jumped, the saving that was missed.",
                  "Turns each insight into a recommendation with the control attached: set the budget, view the offers, enable the alerts.",
                ],
              },
              {
                label: "Find best product",
                body: "Product discovery reasons over the customer’s own spending, then proves the recommendation before asking them to apply for anything.",
                points: [
                  "Ranks by net annual benefit against real spending, not by product tier or marketing order.",
                  "Justifies the match in the customer’s own data — where the money goes, how often they fly, what they currently earn on it.",
                  "Checks eligibility in place against income, tenure and credit score, without touching the credit file.",
                  "Ends pre-qualified with the terms stated up front: documents, timing, and the odds of approval.",
                ],
              },
              {
                label: "Resolve issues",
                body: "A reported problem is carried all the way to a raised, referenced case — inside the same conversation that surfaced it.",
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
          { src: `${copilot}/product-eligibility.png`, ...phone, alt: "The product recommendation flow checking eligibility in place — income, tenure and credit score confirmed against the customer’s own data before any application starts." },
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
    conclusion: { statement: ["The customer defines the goal.", "The AI figures out how to achieve it."] },
  },
];

export const caseStudySection = {
  back: "Back to work",
  conclusion: "Conclusion",
  moreLabel: "Next case studies",
  moreHeading: "More works",
  readCase: "Read case study",
};

export const getCaseStudy = (slug: string) => caseStudies.find((study) => study.slug === slug);

export const nextCaseStudies = (slug: string, count = 2) => {
  const at = caseStudies.findIndex((study) => study.slug === slug);
  return Array.from({ length: count }, (_, i) => caseStudies[(at + i + 1) % caseStudies.length]);
};
