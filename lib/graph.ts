// Career knowledge graph. Every node comes from lib/content.ts (the CV and the works) or from the live site's About stats,
// and every cross-link is stated in those sources, so the graph can't claim anything they don't.
import { brands, cv, works } from "@/lib/content";

export type GraphCategory = "companies" | "industries" | "skills" | "tools" | "projects" | "certifications" | "impact";
export type GraphNode = {
  id: string;
  label: string; // short name on the sphere
  title: string; // full name in the panel
  cat: GraphCategory | "root";
  kind: "root" | "hub" | "leaf";
  detail?: string;
  when?: string;
  points?: string[];
  href?: string;
  x: number; y: number; z: number; // position on the unit sphere; the root sits at its centre
};
export type GraphLink = { a: string; b: string; kind: "spoke" | "structure" | "cross" };

type Seed = Pick<GraphNode, "id" | "label"> & Partial<Pick<GraphNode, "title" | "detail" | "when" | "points" | "href">>;

const job = (id: string) => cv.experience.find((e) => e.id === id)!;
const work = (slug: string) => works.find((w) => w.slug === slug)!;
const company = (id: string, label: string): Seed => {
  const e = job(id);
  return { id, label, title: e.company, detail: `${e.role}, ${e.place}.`, when: e.dates, points: e.highlights };
};
const project = (id: string, label: string, slug: string): Seed => {
  const w = work(slug);
  return { id, label, title: w.title, detail: w.summary, when: w.year, href: `/work/${slug}` };
};
const metric = (id: string, slug: string): Seed => {
  const w = work(slug);
  return { id, label: w.metric, title: `${w.metric} ${w.metricLabel.toLowerCase()}`, detail: `${w.title}.` };
};
const skills = (group: keyof typeof cv.skills, items: [string, string, string?][]): Seed[] =>
  items.map(([id, label, title]) => ({ id, label, title: title ?? label, detail: `Part of my ${group} practice.` }));
const tool = (id: string, label: string): Seed => ({ id, label, detail: "Part of my working toolkit." });
const credential = (id: string, label: string, title: string): Seed => ({ id, label, title, detail: "From my CV." });

const [hajjPortal, reviewPlatform] = job("horizontal").highlights;
const [bankingConcepts, copilot] = job("adcb").highlights;
const [billPayment, adoption] = job("enbd").highlights;
const [, investInDubai] = job("digital-dubai").highlights;
const etihad = brands.find((b) => b.name.startsWith("Etihad"))!;

const groups: Record<GraphCategory, { title: string; seeds: Seed[] }> = {
  companies: {
    title: "Companies",
    seeds: [
      company("horizontal", "Horizontal Digital"),
      company("adcb", "ADCB"),
      company("katim", "KATIM"),
      company("digital-dubai", "Digital Dubai"),
      company("enbd", "Emirates NBD"),
      company("cognizant", "Cognizant"),
      company("danube", "Danube"),
      company("bny", "BNY Mellon"),
      { id: "etihad", label: "Etihad", title: etihad.name, detail: "One of the brands I led initiatives for." },
    ],
  },
  industries: {
    title: "Industries",
    seeds: [
      { id: "banking", label: "Banking & fintech", detail: "A large part of my work, from Bank of New York Mellon to Emirates NBD and ADCB." },
      { id: "government", label: "Government", detail: "Citizen services and high-security government platforms." },
      { id: "enterprise", label: "Enterprise", detail: "Enterprise products, dashboards and operational workflows." },
      { id: "energy", label: "Energy & utilities", detail: "Hajj operations for KSA's largest utility." },
      { id: "aviation", label: "Aviation", detail: `${etihad.name}.` },
      { id: "retail", label: "Retail", detail: `Customer research at ${job("danube").company}.` },
    ],
  },
  skills: {
    title: "Skills",
    seeds: [
      ...skills("Product & UX", [
        ["product-strategy", "Product strategy"],
        ["product-discovery", "Product discovery"],
        ["ux-research", "UX research"],
        ["usability-testing", "Usability testing"],
        ["information-architecture", "Information architecture"],
        ["stakeholder-workshops", "Stakeholder workshops"],
        ["workflow-design", "Complex workflows", "Complex workflow design"],
        ["journey-mapping", "Journey mapping"],
      ]),
      ...skills("Design systems", [
        ["design-systems", "Design systems", "Design systems architecture"],
        ["design-tokens", "Design tokens"],
        ["component-systems", "Component systems"],
      ]),
      ...skills("AI & prototyping", [
        ["ai-native", "AI-native design", "AI-native product design"],
        ["ai-prototyping", "AI prototyping", "AI-assisted prototyping"],
      ]),
    ],
  },
  tools: {
    title: "Tools",
    seeds: [
      tool("figma", "Figma"),
      tool("claude", "Claude"),
      tool("cursor", "Cursor"),
      tool("react-native", "React Native"),
      tool("react", "React"),
      tool("typescript", "TypeScript"),
      tool("miro", "Miro"),
      tool("chatgpt", "ChatGPT"),
      tool("hotjar", "Hotjar"),
      tool("google-analytics", "Google Analytics"),
      tool("midjourney", "Midjourney"),
      tool("ideogram", "Ideogram"),
    ],
  },
  projects: {
    title: "Projects",
    seeds: [
      project("hajj-platform", "Hajj platform", "hajj-operations-platform"),
      { id: "review-platform", label: "Review platform", title: "Project submission and review platform", detail: reviewPlatform, when: job("horizontal").dates },
      { id: "ai-copilot", label: "AI Banking Copilot", detail: copilot, when: job("adcb").dates },
      { id: "banking-concepts", label: "AI banking concepts", title: "AI-powered banking concepts", detail: bankingConcepts, when: job("adcb").dates },
      project("secure-comms", "Secure comms", "secure-communication-app"),
      project("dubainow", "DubaiNow", "dubainow-mobile-app"),
      { id: "invest-in-dubai", label: "Invest in Dubai", detail: investInDubai, when: job("digital-dubai").dates },
      project("emirates-islamic", "Emirates Islamic", "emirates-islamic-digital-ux"),
    ],
  },
  certifications: {
    title: "Certifications",
    seeds: [
      credential("mba", "MBA", cv.education[0]),
      credential("google-ux", "Google UX", cv.education[1]),
      credential("ideo", "IDEO HCD", cv.education[2]),
      credential("design-lab", "AI for visual design", cv.education[3]),
    ],
  },
  impact: {
    title: "Impact",
    seeds: [
      metric("impact-hajj", "hajj-operations-platform"),
      { id: "impact-reviews", label: "-35%", title: "35% fewer review cycles", detail: reviewPlatform },
      { id: "impact-copilot", label: "3 days", title: "3 days from concept to prototype", detail: copilot },
      metric("impact-secure", "secure-communication-app"),
      metric("impact-dubainow", "dubainow-mobile-app"),
      { id: "impact-invest", label: "+20%", title: "+20% new-user onboarding", detail: investInDubai },
      metric("impact-islamic", "emirates-islamic-digital-ux"),
      { id: "impact-bills", label: "5 to 2.5 min", title: "Bill payment from 5 minutes to under 2.5", detail: billPayment },
      { id: "impact-adoption", label: "55%", title: "55% digital adoption", detail: adoption },
      { id: "icxa", label: "ICXA award", title: "ICXA award, 2020", detail: `${cv.award}.` },
      // Stats from the About section of the live site
      { id: "years", label: "15+ years", title: "15+ years of experience", detail: cv.summary },
      { id: "mobile-apps", label: "8+ apps", title: "8+ enterprise mobile apps" },
      { id: "enterprise-projects", label: "20+ projects", title: "20+ total enterprise projects" },
    ],
  },
};

export const categoryIds = Object.keys(groups) as GraphCategory[];

const seedNode = (s: Seed, cat: GraphNode["cat"], kind: GraphNode["kind"]): GraphNode => ({ ...s, title: s.title ?? s.label, cat, kind, x: 0, y: 0, z: 0 });

export const graphNodes: GraphNode[] = [
  seedNode({ id: "rizwan", label: "Rizwan", title: "Mohammed Rizwan", detail: `${cv.title} with ${cv.summary}`, points: [cv.handsOn] }, "root", "root"),
  ...categoryIds.map((c) => seedNode({ id: c, label: groups[c].title }, c, "hub")),
  ...categoryIds.flatMap((c) => groups[c].seeds.map((s) => seedNode(s, c, "leaf"))),
];

// Each link below is stated in a CV highlight, a work's summary or facts, or the live site.
// The Secure Communication App has no employer link because its client is confidential (components.md).
const crossLinks: [string, string][] = [
  // Where each project happened
  ["horizontal", "hajj-platform"], ["horizontal", "review-platform"],
  ["adcb", "ai-copilot"], ["adcb", "banking-concepts"],
  ["digital-dubai", "dubainow"], ["digital-dubai", "invest-in-dubai"],
  ["enbd", "emirates-islamic"], ["enbd", "impact-adoption"],
  // Industries
  ["bny", "banking"], ["enbd", "banking"], ["adcb", "banking"], ["digital-dubai", "government"], ["horizontal", "energy"],
  ["etihad", "aviation"], ["danube", "retail"],
  ["hajj-platform", "energy"], ["hajj-platform", "enterprise"], ["secure-comms", "enterprise"], ["secure-comms", "government"],
  ["dubainow", "government"], ["invest-in-dubai", "government"], ["emirates-islamic", "banking"], ["ai-copilot", "banking"], ["banking-concepts", "banking"],
  // What each project delivered
  ["hajj-platform", "impact-hajj"], ["review-platform", "impact-reviews"], ["ai-copilot", "impact-copilot"], ["secure-comms", "impact-secure"],
  ["dubainow", "impact-dubainow"], ["dubainow", "icxa"], ["invest-in-dubai", "impact-invest"], ["emirates-islamic", "impact-islamic"], ["emirates-islamic", "impact-bills"],
  // Skills used
  ["product-discovery", "hajj-platform"], ["product-discovery", "banking-concepts"], ["ux-research", "hajj-platform"], ["usability-testing", "emirates-islamic"],
  ["information-architecture", "hajj-platform"], ["stakeholder-workshops", "hajj-platform"], ["workflow-design", "secure-comms"], ["journey-mapping", "dubainow"],
  ["design-systems", "katim"], ["design-systems", "secure-comms"], ["design-systems", "dubainow"], ["design-tokens", "katim"], ["component-systems", "katim"], ["component-systems", "secure-comms"],
  ["ai-native", "ai-copilot"], ["ai-native", "banking-concepts"], ["ai-prototyping", "ai-copilot"],
  // Tools used
  ["claude", "ai-copilot"], ["cursor", "ai-copilot"], ["react-native", "ai-copilot"], ["react", "secure-comms"], ["claude", "ai-prototyping"], ["cursor", "ai-prototyping"],
];

export const graphLinks: GraphLink[] = [
  ...categoryIds.map((c): GraphLink => ({ a: "rizwan", b: c, kind: "spoke" })),
  ...categoryIds.flatMap((c) => groups[c].seeds.map((s): GraphLink => ({ a: c, b: s.id, kind: "structure" }))),
  ...crossLinks.map(([a, b]): GraphLink => ({ a, b, kind: "cross" })),
];

export const nodeById = new Map(graphNodes.map((n) => [n.id, n]));

const adjacency = new Map<string, string[]>(graphNodes.map((n) => [n.id, []]));
for (const { a, b } of graphLinks) {
  adjacency.get(a)!.push(b);
  adjacency.get(b)!.push(a);
}
export const neighbours = (id: string) => adjacency.get(id) ?? [];
export const leafCount = (cat: GraphCategory) => groups[cat].seeds.length;
export const graphStats = `${graphNodes.length} nodes · ${graphLinks.length} connections.`;

// Shortest path. Going through a hub would connect anything in two steps and say nothing, so hubs are only used when there is no other way.
export function shortestPath(from: string, to: string): string[] | null {
  const search = (skipHubs: boolean) => {
    const previous = new Map<string, string | null>([[from, null]]);
    const queue = [from];
    while (queue.length) {
      const id = queue.shift()!;
      if (id === to) {
        const path = [id];
        for (let p = previous.get(id); p; p = previous.get(p)) path.unshift(p);
        return path;
      }
      for (const next of neighbours(id)) {
        if (previous.has(next) || (skipHubs && next !== to && nodeById.get(next)!.kind !== "leaf")) continue;
        previous.set(next, id);
        queue.push(next);
      }
    }
    return null;
  };
  return search(true) ?? search(false);
}

// Ball layout: hubs spread evenly, each category's nodes in a cap around its hub, then a few rounds of repulsion so no two sit on top of each other.
function layout() {
  const unit = (v: number[]) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const golden = Math.PI * (3 - Math.sqrt(5));
  const leaves: { n: GraphNode; p: number[] }[] = [];
  categoryIds.forEach((c, i) => {
    const y = 1 - ((i + 0.5) / categoryIds.length) * 2;
    const ring = Math.sqrt(1 - y * y);
    const hub = [Math.cos(i * golden) * ring, y, Math.sin(i * golden) * ring];
    leaves.push({ n: nodeById.get(c)!, p: hub });
    const u = unit([-hub[2], 0.31, hub[0]]);
    const v = [hub[1] * u[2] - hub[2] * u[1], hub[2] * u[0] - hub[0] * u[2], hub[0] * u[1] - hub[1] * u[0]];
    const seeds = groups[c].seeds;
    seeds.forEach((s, k) => {
      const a = (k + 1) * golden + i;
      const r = 0.2 + 0.46 * Math.sqrt((k + 0.5) / seeds.length);
      const p = unit([0, 1, 2].map((d) => hub[d] + (Math.cos(a) * u[d] + Math.sin(a) * v[d]) * r));
      leaves.push({ n: nodeById.get(s.id)!, p });
    });
  });
  for (let round = 0; round < 60; round++) {
    const push = leaves.map(() => [0, 0, 0]);
    for (let i = 0; i < leaves.length; i++) {
      for (let j = i + 1; j < leaves.length; j++) {
        const d = [0, 1, 2].map((k) => leaves[i].p[k] - leaves[j].p[k]);
        const dist = Math.hypot(d[0], d[1], d[2]) || 0.001;
        if (dist > 0.34) continue;
        const f = ((0.34 - dist) / dist) * 0.25;
        for (let k = 0; k < 3; k++) {
          push[i][k] += d[k] * f;
          push[j][k] -= d[k] * f;
        }
      }
    }
    leaves.forEach((l, i) => { l.p = unit(l.p.map((v, k) => v + push[i][k])); });
  }
  // Depth, as on poulo.site: hubs sit part-way out and their nodes scatter in and out around them, so the graph is a ball and not a shell
  const spread = (i: number) => {
    const h = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
    return h - Math.floor(h);
  };
  leaves.forEach((l, i) => {
    const f = l.n.kind === "hub" ? 0.82 : 0.58 + 0.5 * spread(i);
    l.p = l.p.map((v) => v * f);
  });
  for (const { n, p } of leaves) [n.x, n.y, n.z] = p;
}
layout();
