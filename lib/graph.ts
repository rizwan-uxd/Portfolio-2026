// Career knowledge graph data. Positions are the fixed layout from Figma
// (canvas 872x600, node centres); stats are computed from the data below.

export type Category = "companies" | "industries" | "skills" | "tools" | "projects" | "impact";

export type GraphNode = {
  id: string;
  label: string;
  category: Category;
  kind: "root" | "hub" | "leaf";
  x: number;
  y: number;
};

export const categoryMeta: Record<Category, { label: string; abbr: string; color: string }> = {
  companies: { label: "Companies", abbr: "CO", color: "var(--graph-companies)" },
  industries: { label: "Industries", abbr: "IN", color: "var(--graph-industries)" },
  skills: { label: "Skills", abbr: "SK", color: "var(--graph-skills)" },
  tools: { label: "Tools", abbr: "TO", color: "var(--graph-tools)" },
  projects: { label: "Projects", abbr: "PR", color: "var(--graph-projects)" },
  impact: { label: "Impact", abbr: "IM", color: "var(--graph-impact)" },
};

export const categoryOrder: Category[] = ["companies", "industries", "skills", "tools", "projects", "impact"];

const ROOT = { id: "root", label: "RIZWAN", category: "projects" as Category, kind: "root" as const, x: 436, y: 300 };

const hubPos: Record<Category, [number, number]> = {
  companies: [249.2, 208.2],
  tools: [436, 140],
  impact: [622.8, 208.2],
  industries: [642.6, 367.6],
  projects: [436, 460],
  skills: [229.4, 367.6],
};

// [id, label, x, y] per category, in Figma order
const leaves: Record<Category, [string, string, number, number][]> = {
  companies: [
    ["katim", "KATIM", 172.6, 266],
    ["digital-dubai", "DIGITAL DUBAI", 153.2, 209.9],
    ["emirates-nbd", "EMIRATES NBD", 170.6, 153.2],
    ["etihad", "ETIHAD", 218, 117.5],
    ["smart-dubai", "SMART DUBAI", 277.3, 116.4],
  ],
  tools: [
    ["cursor", "CURSOR", 352.9, 92],
    ["claude", "CLAUDE", 403.2, 49.8],
    ["react", "REACT", 468.8, 49.8],
    ["react-native", "REACT NATIVE", 519.1, 92],
  ],
  impact: [
    ["impact-25", "+25%", 594.7, 116.4],
    ["impact-30a", "+30%", 654, 117.5],
    ["impact-3m", "3 MONTHS", 701.4, 153.2],
    ["impact-30b", "+30%", 718.8, 209.9],
    ["impact-6d", "6 DAYS", 699.4, 266],
  ],
  industries: [
    ["banking", "BANKING", 721.3, 312.6],
    ["government", "GOVERNMENT", 738.3, 376],
    ["enterprise-ops", "ENTERPRISE OPS", 710.5, 435.5],
    ["aviation", "AVIATION", 651, 463.3],
  ],
  projects: [
    ["hajj", "HAJJ PLATFORM", 527.3, 489.7],
    ["dubainow", "DUBAINOW", 492.4, 537.7],
    ["secure-comms", "SECURE COMMS", 436, 556],
    ["emirates-islamic", "EMIRATES ISLAMIC", 379.6, 537.7],
    ["ai-copilot", "AI COPILOT", 344.7, 489.7],
  ],
  skills: [
    ["product-ux", "PRODUCT/UX", 221, 463.3],
    ["design-systems", "DESIGN SYSTEMS", 161.5, 435.5],
    ["vibe-coding", "VIBE CODING", 133.7, 376],
    ["discovery", "DISCOVERY", 150.7, 312.6],
  ],
};

// INFERRED cross-links (28): each project to the companies, industries, impact,
// skills and tools it plausibly touches, plus a few extras. Confirm or edit.
const crossPairs: [string, string][] = [
  ["hajj", "government"], ["hajj", "enterprise-ops"], ["hajj", "impact-25"], ["hajj", "product-ux"], ["hajj", "discovery"],
  ["dubainow", "smart-dubai"], ["dubainow", "digital-dubai"], ["dubainow", "government"], ["dubainow", "impact-30a"], ["dubainow", "product-ux"],
  ["secure-comms", "katim"], ["secure-comms", "enterprise-ops"], ["secure-comms", "impact-3m"], ["secure-comms", "design-systems"], ["secure-comms", "react"],
  ["emirates-islamic", "emirates-nbd"], ["emirates-islamic", "banking"], ["emirates-islamic", "impact-30b"], ["emirates-islamic", "product-ux"], ["emirates-islamic", "discovery"],
  ["ai-copilot", "banking"], ["ai-copilot", "impact-6d"], ["ai-copilot", "vibe-coding"], ["ai-copilot", "cursor"], ["ai-copilot", "claude"], ["ai-copilot", "react-native"],
  ["etihad", "aviation"], ["secure-comms", "product-ux"],
];

export const nodes: GraphNode[] = [
  ROOT,
  ...categoryOrder.map<GraphNode>((c) => ({
    id: `hub-${c}`, label: categoryMeta[c].abbr, category: c, kind: "hub", x: hubPos[c][0], y: hubPos[c][1],
  })),
  ...categoryOrder.flatMap((c) =>
    leaves[c].map<GraphNode>(([id, label, x, y]) => ({ id, label, category: c, kind: "leaf", x, y })),
  ),
];

export type Edge = { a: string; b: string; cross: boolean };

export const edges: Edge[] = [
  ...categoryOrder.map<Edge>((c) => ({ a: "root", b: `hub-${c}`, cross: false })),
  ...categoryOrder.flatMap((c) => leaves[c].map<Edge>(([id]) => ({ a: `hub-${c}`, b: id, cross: false }))),
  ...crossPairs.map<Edge>(([a, b]) => ({ a, b, cross: true })),
];

export const leafNodes = nodes.filter((n) => n.kind === "leaf");
export const nodeById = new Map(nodes.map((n) => [n.id, n]));

export const counts = Object.fromEntries(
  categoryOrder.map((c) => [c, leafNodes.filter((n) => n.category === c).length]),
) as Record<Category, number>;

export const stats = `${leafNodes.length} nodes · ${edges.length} connections.`;

export function neighbors(id: string): string[] {
  return edges.flatMap((e) => (e.a === id ? [e.b] : e.b === id ? [e.a] : []));
}

// Breadth-first shortest path across every edge
export function shortestPath(from: string, to: string): string[] {
  if (from === to) return [from];
  const prev = new Map<string, string>();
  const queue = [from];
  const seen = new Set([from]);
  while (queue.length) {
    const cur = queue.shift()!;
    for (const n of neighbors(cur)) {
      if (seen.has(n)) continue;
      seen.add(n);
      prev.set(n, cur);
      if (n === to) {
        const path = [to];
        while (path[0] !== from) path.unshift(prev.get(path[0])!);
        return path;
      }
      queue.push(n);
    }
  }
  return [];
}
