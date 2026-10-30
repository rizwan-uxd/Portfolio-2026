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
  headline: ["Designing enterprise products that ", "create measurable business impact."], // 2nd part is muted (wraps mid-line in Figma)
  subline:
    "15+ years designing banking, government and enterprise platforms. AI accelerates my design process — enabling faster delivery, broader exploration and uncompromising quality.",
  cta: "Let's connect",
};

export const brands = ["KATIM", "Digital Dubai", "Emirates NBD", "Etihad Airways"]; // Figma shows text names

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
  intro: "Every project opens on its finished screens. Switch any one to its case study for the problem, process and outcome.",
  cta: "Case studies instead ↙",
};

export const capabilities = ["Product/UX design", "Design systems/strategy", "Vibe coding and prototyping", "Discovery and user testing"]; // no numbering

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
