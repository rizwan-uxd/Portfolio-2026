// content.ts — single source of truth for copy that is final in the Figma file.
// Anything not here (full "What I can do" cell text, case-study previews) must be pulled from
// the Figma nodes listed in HANDOFF.md or from https://www.rizwanux.work/.

export const person = {
  name: "Mohammed Rizwan",
  role: "Product Designer",
  location: "Dubai, UAE",
  email: "mailrazik@gmail.com",
  phone: "+971 556703127",
  calendly: "https://calendly.com/rizwan-uxdesigner/new-meeting",
  linkedin: "https://www.linkedin.com/in/rizwan-ux/",
  dribbble: "https://dribbble.com/MohammedRizwan",
  behance: "https://www.behance.net/rizuxdesigner",
};

export const hero = {
  intro: { greeting: "Hi", lead: "I'm Mohammed Rizwan from", place: "Dubai" },
  headline: ["Designing enterprise products ", "that ", "create measurable business impact."], // last part is muted; "that " is muted only on mobile (frame 27:5)
  subline:
    "15+ years designing banking, government and enterprise platforms. AI accelerates my design process — enabling faster delivery, broader exploration and uncompromising quality.",
  cta: "Let's connect",
};

export const brandsTitle = "Led Impactful initiatives for";
// Names and logos from the live site, in its order
export const brands = [
  { name: "Horizontal Digital", logo: "/images/brands/6_Horizontal.svg", width: 75, height: 53 },
  { name: "KATIM", logo: "/images/brands/7_katim.svg", width: 126, height: 35 },
  { name: "Digital Dubai", logo: "/images/brands/4_DD.svg", width: 126, height: 43 },
  { name: "Emirates NBD", logo: "/images/brands/5_enbd.svg", width: 152, height: 43 },
  { name: "Etihad Airways", logo: "/images/brands/3_etihad.svg", width: 126, height: 42 },
  { name: "BNY Mellon", logo: "/images/brands/1_BNYM.svg", width: 115, height: 40 },
  { name: "Cognizant", logo: "/images/brands/2_CS.svg", width: 126, height: 28 },
  { name: "Abu Dhabi Commercial Bank", logo: "/images/brands/8_ADCB.svg", width: 123, height: 37 },
];

export type WorkScreen = { src: string; w: number; h: number; alt: string };
export type Work = {
  slug: string; title: string; metric: string; metricLabel: string; chip: string; client?: string; year?: string; summary: string;
  overview: string[]; facts: { label: string; value: string }[];
  initialScreens: number; // how many show before "Show the other screens"
  screens: WorkScreen[];
};

// All of this comes from the live site (home page cards and /work/<slug> pages), and the images from its /images/work.
export const works: Work[] = [
  {
    slug: "hajj-operations-platform",
    title: "Hajj Enterprise Operations Platform",
    metric: "+25%",
    metricLabel: "Efficiency gain",
    chip: "Enterprise UX",
    summary: "Led the UX transformation of a PowerPoint- and meeting-driven Hajj reporting process into a connected enterprise platform for operational data capture, validation, reporting and executive decision-making.",
    overview: [
      "Led the UX transformation of a PowerPoint- and meeting-driven Hajj reporting process into a connected enterprise platform for operational data capture, validation, reporting and executive decision-making."
    ],
    facts: [
      {
        label: "Role",
        value: "UX Lead + Product Designer"
      },
      {
        label: "Duration",
        value: "4 months"
      },
      {
        label: "Team",
        value: "2 designers, with PM, Ops, Mecca and development counterparts"
      },
      {
        label: "Delivery",
        value: "2026 Hajj season — MVP 3"
      }
    ],
    initialScreens: 2,
    screens: [
      {
        src: "/images/work/hajj-operations-platform/banner.png",
        w: 2560,
        h: 1097,
        alt: "Hajj Enterprise Operations Platform"
      },
      {
        src: "/images/work/hajj-operations-platform/hero-dashboard.png",
        w: 3184,
        h: 1832,
        alt: "The live power monitoring dashboard for the Hajj period alongside the project-manager data entry platform, showing load, meter connectivity, interruptions, readiness and the projects list."
      },
      {
        src: "/images/work/hajj-operations-platform/legacy-vs-digital.png",
        w: 3184,
        h: 1944,
        alt: "A legacy Arabic project report slide next to the new digital project detail screens that replaced it."
      },
      {
        src: "/images/work/hajj-operations-platform/governance-flow.png",
        w: 3344,
        h: 1360,
        alt: "The initial information architecture next to the structure confirmed in the users and stakeholder workshop sessions."
      },
      {
        src: "/images/work/hajj-operations-platform/flow-composite.png",
        w: 3392,
        h: 1792,
        alt: "Requirements and operational understanding on the left, and the confirmed PM-to-Mecca-team approval workflow diagram on the right."
      },
      {
        src: "/images/work/hajj-operations-platform/states-board.png",
        w: 2864,
        h: 1944,
        alt: "Data-entry platform wireframes for new project entry and the Mecca review screen, each next to the final UI design."
      },
      {
        src: "/images/work/hajj-operations-platform/phase-dashboards.png",
        w: 2176,
        h: 816,
        alt: "The during-Hajj live operations dashboard next to the pre-Hajj readiness dashboard, showing the same surface with different priorities."
      },
      {
        src: "/images/work/hajj-operations-platform/delivered-ecosystem.png",
        w: 3104,
        h: 1944,
        alt: "Wireframes for the CEO dashboard and the project-manager data-entry landing page, each alongside the delivered UI design."
      }
    ],
    client: "Leading energy provider in Saudi",
    year: "2026"
  },
  {
    slug: "dubainow-mobile-app",
    title: "DubaiNow Mobile App",
    metric: "+30%",
    metricLabel: "Service completion rate",
    chip: "Product design",
    summary: "Redesigned a large-scale government mobile app, simplifying complex service journeys to improve usability and completion across key citizen interactions.",
    overview: [
      "DubaiNow app serves residents of Dubai with access to more than 120 government services. It's a one stop shop for all government interactions. As a Customer Experience Designer, I optimize user experiences by analyzing app store feedback and designing innovative features for the DubaiNow app."
    ],
    facts: [
      {
        label: "Role",
        value: "CX Designer"
      },
      {
        label: "Services",
        value: "Mobile UX, Design system"
      }
    ],
    initialScreens: 2,
    screens: [
      {
        src: "/images/work/dubainow-mobile-app/banner.png",
        w: 2400,
        h: 1976,
        alt: "DubaiNow Mobile App"
      },
      {
        src: "/images/work/dubainow-mobile-app/detail-1.png",
        w: 1600,
        h: 1200,
        alt: "DubaiNow Mobile App — process detail 1"
      },
      {
        src: "/images/work/dubainow-mobile-app/detail-2.png",
        w: 1200,
        h: 675,
        alt: "DubaiNow Mobile App — process detail 2"
      }
    ],
    client: "Digital Dubai government",
    year: "2019 – 2022"
  },
  {
    slug: "secure-communication-app",
    title: "Secure Communication App",
    metric: "3 months",
    metricLabel: "Dev time saved",
    chip: "Design systems",
    summary: "Designed a secure enterprise communication platform with a scalable design system and reusable React components, standardizing complex workflows across products and platforms.",
    overview: [
      "SecureLink (name changed) is a custom-built enterprise communication platform that empowers high security government organizations to connect and collaborate securely. It enables employees to effortlessly schedule meetings, engage in instant messaging, and conduct high-quality voice and video conferences.",
      "This case study explores the journey of converting a one line sentence from leadership to a full scale enterprise application with a custom built design system to a highest level of security, highlighting the challenges faced, the approach taken to address them, and the results achieved."
    ],
    facts: [
      {
        label: "Role",
        value: "Senior Product Designer"
      },
      {
        label: "Services",
        value: "UX, Design system"
      }
    ],
    initialScreens: 2,
    screens: [
      {
        src: "/images/work/secure-communication-app/banner.png",
        w: 2560,
        h: 1440,
        alt: "Secure Communication App"
      },
      {
        src: "/images/work/secure-communication-app/detail-1.png",
        w: 1400,
        h: 866,
        alt: "Secure Communication App — process detail 1"
      },
      {
        src: "/images/work/secure-communication-app/detail-2.png",
        w: 1290,
        h: 740,
        alt: "Secure Communication App — process detail 2"
      }
    ],
    client: "Confidential",
    year: "2024"
  },
  {
    slug: "emirates-islamic-digital-ux",
    title: "Emirates Islamic Digital UX",
    metric: "+30%",
    metricLabel: "Task completion efficiency",
    chip: "UX/UI",
    summary: "Optimized digital banking experiences by simplifying key financial workflows, reducing task time, and improving adoption across core user journeys.",
    overview: [
      "Emirates Islamic Bank (EIB) is a United Arab Emirates based bank engaged in the provision of Sharia-compliant banking solutions.",
      "This is one of the premium Islamic banks in the market, and as it's connected to Emirates NBD, it has its own set of premium and loyal customers."
    ],
    facts: [
      {
        label: "Role",
        value: "UX designer"
      },
      {
        label: "Services",
        value: "Digital banking UX/UI"
      }
    ],
    initialScreens: 2,
    screens: [
      {
        src: "/images/work/emirates-islamic-digital-ux/banner.png",
        w: 2560,
        h: 1440,
        alt: "Emirates Islamic Digital UX"
      },
      {
        src: "/images/work/emirates-islamic-digital-ux/detail-1.png",
        w: 1260,
        h: 648,
        alt: "Emirates Islamic Digital UX — process detail 1"
      },
      {
        src: "/images/work/emirates-islamic-digital-ux/detail-2.png",
        w: 1260,
        h: 648,
        alt: "Emirates Islamic Digital UX — process detail 2"
      }
    ],
    client: "Emirates Islamic Bank",
    year: "2018"
  }
];

export const worksSection = {
  heading: ["Selected works", "Enterprise impact"], // 2nd line muted
  metricLabel: "Impact", // title of the metric square
  readCase: "Read the full case study ↗",
};

export const servicesSection = {
  heading: ["What I can do", "for you"], // 2nd line muted
  intro:
    "As a digital designer, with an empathetic, human-first mindset and a structured way of thinking, I translate real user needs and business goals into clear journeys and polished UI — reducing friction, making decisions easier, and helping teams ship with confidence.",
};

// Titles from the owner (2026-11-01). Descriptions reworded 2026-11-02 (owner asked) to claims the case studies support.
export const services = [
  {
    title: "Product Strategy & Growth Alignment",
    description: "Aligning user journeys and product data with business KPIs to prioritise what gets designed and built first.",
  },
  {
    title: "UX Research & Validation",
    description: "Uncovering real user friction through stakeholder workshops, usability testing and analytics, so design decisions are tested before development starts.",
  },
  {
    title: "Complex Interaction Design",
    description: "Turning dense data, multi-role approval workflows and edge-case states into clear, consistent patterns that people can work through with confidence.",
  },
  {
    title: "AI-Native & Conversational Experience",
    description: "Designing intent-driven AI flows that understand a goal, explain their reasoning and ask the user to confirm before acting, so people stay in control.",
  },
  {
    title: "Interactive Code Prototyping",
    description: "Building working prototypes with AI-assisted tools like Claude Code and Cursor, so flows can be tried and tested before full engineering investment.",
  },
  {
    title: "Scalable Design Systems & Token Ops",
    description: "Creating tokenised component libraries that keep products consistent across platforms and themes, and help design and engineering teams ship faster.",
  },
];

// Copy from the live site's AI projects section (owner, 2026-10-31: two cards); intro note from the owner (2026-11-02).
export const aiProjectsSection = {
  eyebrow: "AI projects",
  heading: ["AI projects", ""], // 2nd line muted, empty
  note: "I use AI-assisted tools to explore ideas and build working prototypes faster. The AI Banking Copilot shows how I moved from a banking concept to an interactive prototype.", // owner, 2026-11-02
  projects: [
    {
      tag: "Vibe coded",
      title: "AI Banking Copilot",
      summary: "An AI-native banking concept designed and vibe coded into a working React Native prototype in six days — intent-driven flows that end in a completed action, not a chat reply.",
      statLabel: "Concept to prototype",
      stat: "6 days",
      image: "/images/work/ai-banking-copilot/banner.png",
      alt: "AI Banking Copilot",
      href: "/work/ai-banking-copilot",
    },
    {
      tag: "Case study in development",
      title: "AI Banking App",
      summary: "A mobile banking concept currently being refined. The full case study will be published soon.",
      statLabel: "Status",
      stat: "Coming soon",
      image: "/images/work/ai-banking-app/tile.png",
      alt: "The app's home screen — total balance, send, transfer, pay and topup actions, and recent transactions — dimmed behind a lock.",
    },
  ],
};

// Copy from the owner's reference image (2026-11-03); Meta and Grok removed (owner, 2026-11-03). Logos are in components/ToolLogos.tsx, keyed by these names.
export const toolsSection = {
  heading: ["AI is part of how I", "design & build,", "every day."], // 2nd phrase muted
  intro: "Not a novelty — a daily practice. These are the tools I reach for to move from a rough idea to a shipped, working product.",
  tools: ["Claude", "Figma", "Cursor", "Supabase", "Vercel", "OpenAI", "GitHub", "Tailwind", "Adobe", "Notion", "Slack", "Miro", "SurveyMonkey", "ProtoPie"] as const, // last six added by the owner, 2026-11-03
};

export const testimonialsSection = {
  eyebrow: "Testimonials",
  heading: ["What clients", "say about me."], // 2nd line muted
  intro:
    "Here's what my clients have shared about their experiences working with me. Their trust and satisfaction motivate me to continue delivering designs that make an impact.",
};

// Title, intro, starter questions and footnote come from Figma 13:2. Card labels and the panel's button and status
// wording are placeholders in the reference's pattern, for the owner to confirm. The "messages left" line is dropped until there is a real limiter.
// From the owner's CV (2026-10-31). The AI twin answers from this and the works above (lib/twin.ts).
export const cv = {
  title: "Senior Product Designer and UX Lead",
  summary: "15+ years across fintech, enterprise, and government, combining product strategy, UX, design systems, and AI-native design.",
  handsOn: "Hands-on from discovery to prototyping, with a track record of measurable user and business impact.",
  experience: [
    {
      id: "horizontal",
      keywords: ["horizontal digital", "horizontal"],
      role: "Senior UX designer (contract)",
      company: "Horizontal Digital",
      place: "Remote, Dubai",
      dates: "July 2025 - Present",
      highlights: [
        "Led 0 to 1 MVP UX design for a Hajj live portal for KSA's largest utility, driving discovery, user research, stakeholder alignment, and prototype validation to accelerate partner onboarding and adoption.",
        "Designed an end-to-end project submission and review platform with contextual feedback and revision tracking, reducing review cycles by 35%.",
      ],
    },
    {
      id: "adcb",
      keywords: ["adcb", "abu dhabi commercial bank", "publicis( sapient)?", "sapient"],
      role: "Design lead - UX (contract)",
      company: "Abu Dhabi Commercial Bank - Publicis Sapient",
      place: "Abu Dhabi",
      dates: "Feb 2025 - July 2025",
      highlights: [
        "Led discovery and competitive benchmarking for ADCB's retail banking experience, translating insights into AI-powered banking concepts and UX solutions for mobile retail banking.",
        "Designed and AI-prototyped an intent-driven banking copilot, taking the concept to a working React Native prototype in 3 days using Claude Code and Cursor.",
      ],
    },
    {
      id: "katim",
      keywords: ["katim"],
      role: "Senior product designer - UX/UI",
      company: "Katim",
      place: "Abu Dhabi",
      dates: "Oct 2022 - Nov 2024",
      highlights: [
        "Built and scaled design systems across two product lines, integrating design tokens and automated workflows to improve consistency and accelerate design-to-development delivery.",
        "Saved 3 months of development time by establishing reusable components, tokenized foundations, and scalable design-system practices.",
      ],
    },
    {
      id: "digital-dubai",
      keywords: ["digital dubai", "invest in dubai"],
      role: "CX designer",
      company: "Digital Dubai Government",
      place: "Dubai",
      dates: "May 2019 - Sep 2022",
      highlights: [
        "Led the UX redesign of DubaiNow services, increasing conversion by 30% through user-centered design and journey optimization.",
        "Redesigned signup and verification flows for Invest in Dubai, increasing new-user onboarding by 20%.",
      ],
    },
    {
      id: "enbd",
      keywords: ["emirates nbd", "enbd"],
      role: "Senior UX designer",
      company: "Emirates NBD",
      place: "Dubai",
      dates: "Feb 2018 - March 2019",
      highlights: [
        "Reduced Emirates Islamic bill-payment task time from 5 minutes to under 2.5 minutes through usability testing and iterative UX improvements.",
        "Increased digital adoption to 55%, exceeding the target by 20% within two months of squad launch.",
      ],
    },
    { id: "cognizant", keywords: ["cognizant"], role: "UX design consultant - UX/UI", company: "Cognizant", place: "Chennai - Abu Dhabi", dates: "Feb 2013 - Feb 2018", highlights: [] },
    { id: "danube", keywords: ["danube"], role: "Customer research analyst", company: "Danube Retail chain", place: "Jeddah, KSA", dates: "Aug 2011 - Jan 2013", highlights: [] },
    { id: "bny", keywords: ["bny", "bny mellon", "new york mellon"], role: "Usability analyst", company: "Bank of New York Mellon", place: "Chennai, India", dates: "Jun 2008 - Aug 2009", highlights: [] },
  ],
  education: ["MBA in Product Development, UK", "Google UX Design Professional Certificate", "IDEO design Kit, HCD certified", "AI for visual design (Design lab)"],
  award: "ICXA award for the DubaiNow app, 2020",
  skills: {
    "Product & UX": ["Product strategy", "Product discovery", "UX research", "Usability testing", "Information architecture", "Stakeholder workshops", "Complex workflow design", "Journey mapping", "Conversational UX"],
    "Design systems": ["Design systems architecture", "Design tokens", "Component systems", "Design governance", "AI-ready design systems", "Motion & interaction"],
    "AI & prototyping": ["AI-native product design", "AI-assisted prototyping", "Design-to-code workflows", "Claude", "Cursor", "React Native", "TypeScript"],
    Tools: ["Figma", "Miro", "ChatGPT", "Hotjar", "Google Analytics", "Midjourney", "Ideogram"],
  },
};

export const aiTwin = {
  ask: "Ask my AI twin",
  title: "Rizwan's AI twin",
  subtitle: "Grounded on my real work",
  intro: "Hey, I'm an AI version of Rizwan, grounded on his real work. Ask me anything, or tap a starter below.",
  barQuestions: ["Do you work on banking apps?", "What have you built with AI?", "Where have you worked?", "Biggest enterprise win?", "How fast can you prototype?"],
  cards: [
    { label: "AI", question: "What have you built with AI?" },
    { label: "Experience", question: "Banking and government experience?" },
    { label: "Fit", question: "Fit for a senior product design role?" },
  ],
  starters: ["Biggest enterprise win?", "How do you approach design systems?", "How fast can you prototype?", "Where have you worked?", "Any awards or certifications?", "What tools do you use?"],
  placeholder: "Ask something…",
  footnote: "Grounded on my real work, not a guarantee of accuracy. For anything specific,",
  footnoteLink: "email me directly",
  noAnswer: "I only answer from my real work and CV, and that isn't covered there. For anything specific, email me directly.",
  error: "I couldn't answer that just now. For anything specific, email me directly.",
  thinking: "Thinking…",
  askNext: "Ask next",
  emailChat: "Email this chat to Rizwan",
  emailSubject: "My questions from your AI twin",
  newChat: "New chat",
  minimize: "Minimize",
  close: "Close",
  send: "Send",
  bookCall: "Book a call",
  seeWorks: "See works",
};

export const graphSection = {
  eyebrow: "Click any node to see how it connects",
  eyebrowMobile: "Tap any node to see how it connects",
  heading: ["Career", "knowledge graph"], // 2nd line muted
  intro: ["Click any node to see what it is, what it delivered, and everything it connects to. Try ", "Hajj platform", " or ", "AI Banking Copilot", "."],
  hint: "Drag to rotate · Drag a node to move it · Pinch, or click then scroll, to zoom · Click a node for details",
  searchLabel: "Search the graph",
  searchPlaceholder: "Search… e.g. KATIM, Claude",
  noMatches: "Nothing matches that.",
  viewLabel: "Graph or timeline view",
  rootTag: "Me",
  traceFrom: "bny",
  traceTo: "ai-copilot",
  categories: [
    { id: "companies", label: "Companies" },
    { id: "industries", label: "Industries" },
    { id: "skills", label: "Skills" },
    { id: "tools", label: "Tools" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "impact", label: "Impact" },
  ] as const,
  tour: [
    { node: "rizwan", title: "Everything connects to one career", body: "15+ years across fintech, enterprise and government. Each point on the sphere is a company, project, skill, tool or result from it." },
    { node: "hajj-platform", title: "Hajj operations platform", body: "A PowerPoint- and meeting-driven reporting process became a connected enterprise platform, with a 25% efficiency gain." },
    { node: "ai-copilot", title: "AI Banking Copilot", body: "An intent-driven banking copilot, from concept to a working React Native prototype in 3 days with Claude Code and Cursor." },
    { node: "dubainow", title: "DubaiNow", body: "A redesign of a large-scale government app raised service completion by 30% and won an ICXA award in 2020." },
    { node: "secure-comms", title: "Secure Communication App", body: "A scalable design system and reusable React components saved 3 months of development time." },
    { node: "ai-copilot", path: ["bny", "ai-copilot"], title: "Trace any path", body: "From usability analyst at BNY Mellon in 2008 to an AI copilot for ADCB in 2025, connected through banking. Pick any two points above to trace your own." },
  ] as { node: string; path?: [string, string]; title: string; body: string }[],
};

export const testimonials = [
  { name: "Jayakumar", role: "Manager - Design, KATIM", headline: "Proactive", sub: "a well-rounded product design skill set",
    quote: "Rizwan demonstrated exceptional dedication to designing our collaboration and file-sharing apps. His optimistic outlook and proactive approach to problem-solving have been instrumental in delivering innovative user experiences. He possesses a strong foundation in design systems and a well-rounded product design skill set, making him an ideal candidate for any design team.",
    highlights: ["exceptional dedication", "proactive approach to problem-solving", "strong foundation in design systems"] },
  { name: "Dr. Ali", role: "City Planning Advisor, Digital Dubai", headline: "Always curious", sub: "a clear professional attitude",
    quote: "Always smiling and always curious. Both are great traits of a good designer. Rizwan also has a clear professional attitude, and lovely to work with and I would certainly recommend him wholeheartedly.",
    highlights: ["Always smiling and always curious", "recommend him wholeheartedly"] },
  { name: "Sonali", role: "Product Designer, Smart Dubai", headline: "Iterates fast", sub: "takes feedback with humility",
    quote: "Rizwan is a thoughtful, detail-oriented and user-focused designer. He's inquisitive, curious and open to continuous learning. He takes in design feedback with humility and doesn't hesitate to iterate quickly to improve the work he produces. It was a good learning experience to work together with him in the CX team at SmartDubai and look forward to collaborating with him in the future.",
    highlights: ["thoughtful, detail-oriented and user-focused", "iterate quickly"] },
]; // headline/sub are my distilled wording, not on the original site

export const contact = {
  label: "LET'S TALK",
  heading: ["Let’s build something", "meaningful together."], // 2nd half muted; owner, 2026-11-02
  cta: "Let’s talk", // owner, 2026-11-02
  connectLabel: "Connect with me",
  copyright: "© Copyright 2026. Mohammed Rizwan",
};
