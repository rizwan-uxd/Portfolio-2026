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
export const liveSite = "https://www.rizwanux.work";
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
  showMore: "Show the other %n screens ↓",
  caseLabel: "Case study",
  readCase: "Read the full case study ↗",
};

export const servicesSection = {
  heading: ["What I can do", "for you"], // 2nd line muted
  intro:
    "As a digital designer, with an empathetic, human-first mindset and a structured way of thinking, I translate real user needs and business goals into clear journeys and polished UI — reducing friction, making decisions easier, and helping teams ship with confidence.",
};

// Description and bullets come from the Figma cells; titles match the live site.
export const services = [
  {
    title: "Product/UX design",
    description: "End-to-end product design — research, journey mapping, wireframes, and polished UI that reduces friction and helps teams ship with confidence.",
    items: ["Research", "Journey mapping", "Wireframes", "Polished UI"],
  },
  {
    title: "Design systems/strategy",
    description: "Building and scaling reusable design systems and component libraries so product teams move faster without sacrificing quality or consistency.",
    items: ["Reusable design systems", "Component libraries", "Faster product teams", "Consistent quality"],
  },
  {
    title: "Vibe coding and prototyping",
    description: "Turning intent into working prototypes with Cursor and Claude — fast, AI-assisted builds that validate flows before full engineering investment.",
    items: ["Cursor", "Claude", "Working prototypes", "Validated flows"],
  },
  {
    title: "Discovery and user testing",
    description: "Structured discovery and usability testing that turns real user behavior into clear, actionable direction for product decisions.",
    items: ["Structured discovery", "Usability testing", "Real user behavior", "Actionable direction"],
  },
];

export const testimonialsSection = {
  eyebrow: "Testimonials",
  heading: ["What clients", "say about me."], // 2nd line muted
  intro:
    "Here's what my clients have shared about their experiences working with me. Their trust and satisfaction motivate me to continue delivering designs that make an impact.",
};

export const aiTwin = {
  placeholder: "Do you work on banking apps?",
  tagline: "Ask my AI twin anything about my work before you email.",
  status: "AI TWIN ONLINE  ·  5 MESSAGES LEFT THIS HOUR", // rate-limit number is a design placeholder, wire to real limiter
};

export const graph = {
  hubs: {
    Companies: ["KATIM", "DIGITAL DUBAI", "EMIRATES NBD", "ETIHAD", "SMART DUBAI"],
    Tools: ["CURSOR", "CLAUDE", "REACT", "REACT NATIVE"],
    Impact: ["+25%", "+30%", "3 MONTHS", "+30%", "6 DAYS"],
    Industries: ["BANKING", "GOVERNMENT", "ENTERPRISE OPS", "AVIATION"],
    Projects: ["HAJJ PLATFORM", "DUBAINOW", "SECURE COMMS", "EMIRATES ISLAMIC", "AI COPILOT"],
    Skills: ["PRODUCT/UX", "DESIGN SYSTEMS", "VIBE CODING", "DISCOVERY"],
  },
  stats: "27 nodes · 61 connections.", // 28 cross-links are inferred by me, confirm or edit
};

export const graphSection = {
  eyebrow: "Click any node to see how it connects",
  eyebrowMobile: "Tap a category to see how it connects",
  heading: ["Career", "knowledge graph"], // 2nd line muted
  intro: "Click any node to see what it is, what it delivered, and everything it connects to. Try Hajj platform or AI Banking Copilot.",
  hint: "Drag nodes · Scroll or pinch to zoom · Click a node for details · Dashed lines are cross-links",
  searchPlaceholder: "Search… e.g. KATIM, Claude",
  traceFrom: "KATIM",
  traceTo: "AI Banking Copilot",
  openGraph: "Open interactive graph ↗",
  categories: [
    { id: "companies", label: "Companies", preview: "KATIM · Digital Dubai · Emirates NBD" },
    { id: "industries", label: "Industries", preview: "Banking · Government · Aviation" },
    { id: "skills", label: "Skills", preview: "Product/UX · Design systems" },
    { id: "tools", label: "Tools", preview: "Cursor · Claude · React" },
    { id: "projects", label: "Projects", preview: "Hajj platform · DubaiNow" },
    { id: "impact", label: "Impact", preview: "+25% · +30% · 3 months" },
  ],
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
  heading: ["Start your new project", "in just a few clicks."], // 2nd half muted
  cta: "Book a free call",
  connectLabel: "Connect with me",
  copyright: "© Copyright 2026. Mohammed Rizwan",
};
