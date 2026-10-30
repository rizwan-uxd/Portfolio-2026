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
  eyebrow: "Senior UX/Product Designer · Dubai",
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

export type Work = {
  slug: string; title: string; metric: string; metricLabel: string;
  chip?: string; client?: string; year?: string; summary?: string;
};

export const works: Work[] = [
  {
    slug: "hajj-operations-platform",
    title: "Hajj Enterprise Operations Platform",
    metric: "+25%",
    metricLabel: "efficiency",
    // Only the Hajj project has detail copy in Figma; add the rest as it is finalised.
    chip: "Enterprise UX",
    client: "Horizontal Digital",
    year: "2026",
    summary:
      "Led the UX transformation of a PowerPoint- and meeting-driven Hajj reporting process into a connected enterprise platform for operational data capture, validation, reporting and executive decision-making.",
  },
  { slug: "dubainow-mobile-app", title: "DubaiNow Mobile App", metric: "+30%", metricLabel: "service completion" },
  { slug: "secure-communication-app", title: "Secure Communication App", metric: "3 months", metricLabel: "dev time saved" },
  { slug: "emirates-islamic-digital-ux", title: "Emirates Islamic Digital UX", metric: "+30%", metricLabel: "task completion" },
  { slug: "ai-banking-copilot", title: "AI Banking Copilot", metric: "6 days", metricLabel: "concept to prototype" },
];

export const worksSection = {
  heading: ["Selected works", "Enterprise impact"], // 2nd line muted
  screenLabel: "Screen 0%n — drop final design here", // Figma placeholder until the final screens are added
  showMore: "Show the other screens ↓",
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
