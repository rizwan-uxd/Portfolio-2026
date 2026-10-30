// Node positions, structure edges and the 28 cross-links are read from Figma node 14:113.
// Cross-links are inferred, not stated on the live site: confirm before shipping.
export type GraphCategory = "companies" | "tools" | "impact" | "industries" | "projects" | "skills";
export type GraphNode = {
  id: string; label: string; title: string; cat: GraphCategory | "root";
  x: number; y: number; r: number; abbr?: string; lx?: number; ly?: number;
};

export const graphNodes: GraphNode[] = [
  {
    "id": "rizwan",
    "label": "RIZWAN",
    "title": "Mohammed Rizwan",
    "cat": "root",
    "x": 436,
    "y": 300,
    "r": 32,
    "lx": 415.5,
    "ly": 347,
    "abbr": "R"
  },
  {
    "id": "companies",
    "label": "Companies",
    "title": "Companies",
    "cat": "companies",
    "x": 249.23,
    "y": 208.23,
    "r": 20,
    "abbr": "CO"
  },
  {
    "id": "tools",
    "label": "Tools",
    "title": "Tools",
    "cat": "tools",
    "x": 436.0,
    "y": 140.0,
    "r": 20,
    "abbr": "TO"
  },
  {
    "id": "impact",
    "label": "Impact",
    "title": "Impact",
    "cat": "impact",
    "x": 622.77,
    "y": 208.23,
    "r": 20,
    "abbr": "IM"
  },
  {
    "id": "industries",
    "label": "Industries",
    "title": "Industries",
    "cat": "industries",
    "x": 642.64,
    "y": 367.62,
    "r": 20,
    "abbr": "IN"
  },
  {
    "id": "projects",
    "label": "Projects",
    "title": "Projects",
    "cat": "projects",
    "x": 436.0,
    "y": 460.0,
    "r": 20,
    "abbr": "PR"
  },
  {
    "id": "skills",
    "label": "Skills",
    "title": "Skills",
    "cat": "skills",
    "x": 229.36,
    "y": 367.62,
    "r": 20,
    "abbr": "SK"
  },
  {
    "id": "katim",
    "label": "KATIM",
    "title": "KATIM",
    "cat": "companies",
    "x": 172.56,
    "y": 266.0,
    "r": 7,
    "lx": 126.56,
    "ly": 269.0
  },
  {
    "id": "digital-dubai",
    "label": "DIGITAL DUBAI",
    "title": "Digital Dubai",
    "cat": "companies",
    "x": 153.25,
    "y": 209.9,
    "r": 7,
    "lx": 51.25,
    "ly": 212.9
  },
  {
    "id": "emirates-nbd",
    "label": "EMIRATES NBD",
    "title": "Emirates NBD",
    "cat": "companies",
    "x": 170.59,
    "y": 153.16,
    "r": 7,
    "lx": 75.59,
    "ly": 156.16
  },
  {
    "id": "etihad",
    "label": "ETIHAD",
    "title": "Etihad",
    "cat": "companies",
    "x": 217.98,
    "y": 117.46,
    "r": 7,
    "lx": 164.98,
    "ly": 120.46
  },
  {
    "id": "smart-dubai",
    "label": "SMART DUBAI",
    "title": "Smart Dubai",
    "cat": "companies",
    "x": 277.3,
    "y": 116.42,
    "r": 7,
    "lx": 239.3,
    "ly": 101.42
  },
  {
    "id": "cursor",
    "label": "CURSOR",
    "title": "Cursor",
    "cat": "tools",
    "x": 352.86,
    "y": 92.0,
    "r": 7,
    "lx": 332.36,
    "ly": 77.0
  },
  {
    "id": "claude",
    "label": "CLAUDE",
    "title": "Claude",
    "cat": "tools",
    "x": 403.17,
    "y": 49.79,
    "r": 7,
    "lx": 382.67,
    "ly": 34.79
  },
  {
    "id": "react",
    "label": "REACT",
    "title": "React",
    "cat": "tools",
    "x": 468.83,
    "y": 49.79,
    "r": 7,
    "lx": 451.83,
    "ly": 34.79
  },
  {
    "id": "react-native",
    "label": "REACT NATIVE",
    "title": "React Native",
    "cat": "tools",
    "x": 519.14,
    "y": 92.0,
    "r": 7,
    "lx": 477.64,
    "ly": 77.0
  },
  {
    "id": "25-hajj",
    "label": "+25%",
    "title": "+25%",
    "cat": "impact",
    "x": 594.7,
    "y": 116.42,
    "r": 7,
    "lx": 581.2,
    "ly": 101.42
  },
  {
    "id": "30-dubainow",
    "label": "+30%",
    "title": "+30%",
    "cat": "impact",
    "x": 654.02,
    "y": 117.46,
    "r": 7,
    "lx": 640.52,
    "ly": 102.46
  },
  {
    "id": "3-months-secure",
    "label": "3 MONTHS",
    "title": "3 MONTHS",
    "cat": "impact",
    "x": 701.41,
    "y": 153.16,
    "r": 7,
    "lx": 713.41,
    "ly": 156.16
  },
  {
    "id": "30-emirates-islamic",
    "label": "+30%",
    "title": "+30%",
    "cat": "impact",
    "x": 718.75,
    "y": 209.9,
    "r": 7,
    "lx": 730.75,
    "ly": 212.9
  },
  {
    "id": "6-days-copilot",
    "label": "6 DAYS",
    "title": "6 DAYS",
    "cat": "impact",
    "x": 699.44,
    "y": 266.0,
    "r": 7,
    "lx": 711.44,
    "ly": 269.0
  },
  {
    "id": "banking",
    "label": "BANKING",
    "title": "Banking",
    "cat": "industries",
    "x": 721.28,
    "y": 312.56,
    "r": 7,
    "lx": 733.28,
    "ly": 315.56
  },
  {
    "id": "government",
    "label": "GOVERNMENT",
    "title": "Government",
    "cat": "industries",
    "x": 738.27,
    "y": 375.99,
    "r": 7,
    "lx": 750.27,
    "ly": 378.99
  },
  {
    "id": "enterprise-ops",
    "label": "ENTERPRISE OPS",
    "title": "Enterprise Ops",
    "cat": "industries",
    "x": 710.52,
    "y": 435.5,
    "r": 7,
    "lx": 722.52,
    "ly": 438.5
  },
  {
    "id": "aviation",
    "label": "AVIATION",
    "title": "Aviation",
    "cat": "industries",
    "x": 651.01,
    "y": 463.25,
    "r": 7,
    "lx": 623.51,
    "ly": 484.25
  },
  {
    "id": "hajj-platform",
    "label": "HAJJ PLATFORM",
    "title": "Hajj Platform",
    "cat": "projects",
    "x": 527.3,
    "y": 489.67,
    "r": 7,
    "lx": 539.3,
    "ly": 492.67
  },
  {
    "id": "dubainow",
    "label": "DUBAINOW",
    "title": "DubaiNow",
    "cat": "projects",
    "x": 492.43,
    "y": 537.67,
    "r": 7,
    "lx": 504.43,
    "ly": 540.67
  },
  {
    "id": "secure-comms",
    "label": "SECURE COMMS",
    "title": "Secure Communication App",
    "cat": "projects",
    "x": 436.0,
    "y": 556.0,
    "r": 7,
    "lx": 394.5,
    "ly": 577.0
  },
  {
    "id": "emirates-islamic",
    "label": "EMIRATES ISLAMIC",
    "title": "Emirates Islamic",
    "cat": "projects",
    "x": 379.57,
    "y": 537.67,
    "r": 7,
    "lx": 256.57,
    "ly": 540.67
  },
  {
    "id": "ai-copilot",
    "label": "AI COPILOT",
    "title": "AI Banking Copilot",
    "cat": "projects",
    "x": 344.7,
    "y": 489.67,
    "r": 7,
    "lx": 263.7,
    "ly": 492.67
  },
  {
    "id": "product-ux",
    "label": "PRODUCT/UX",
    "title": "Product/UX",
    "cat": "skills",
    "x": 220.99,
    "y": 463.25,
    "r": 7,
    "lx": 186.49,
    "ly": 484.25
  },
  {
    "id": "design-systems",
    "label": "DESIGN SYSTEMS",
    "title": "Design Systems",
    "cat": "skills",
    "x": 161.48,
    "y": 435.5,
    "r": 7,
    "lx": 52.48,
    "ly": 438.5
  },
  {
    "id": "vibe-coding",
    "label": "VIBE CODING",
    "title": "Vibe Coding",
    "cat": "skills",
    "x": 133.73,
    "y": 375.99,
    "r": 7,
    "lx": 45.73,
    "ly": 378.99
  },
  {
    "id": "discovery",
    "label": "DISCOVERY",
    "title": "Discovery",
    "cat": "skills",
    "x": 150.72,
    "y": 312.56,
    "r": 7,
    "lx": 76.72,
    "ly": 315.56
  }
];

export const structureEdges: [string, string][] = [["rizwan", "companies"], ["rizwan", "tools"], ["rizwan", "impact"], ["rizwan", "industries"], ["rizwan", "projects"], ["rizwan", "skills"], ["companies", "katim"], ["companies", "digital-dubai"], ["companies", "emirates-nbd"], ["companies", "etihad"], ["companies", "smart-dubai"], ["tools", "cursor"], ["tools", "claude"], ["tools", "react"], ["tools", "react-native"], ["impact", "25-hajj"], ["impact", "30-dubainow"], ["impact", "3-months-secure"], ["impact", "30-emirates-islamic"], ["impact", "6-days-copilot"], ["industries", "banking"], ["industries", "government"], ["industries", "enterprise-ops"], ["industries", "aviation"], ["projects", "hajj-platform"], ["projects", "dubainow"], ["projects", "secure-comms"], ["projects", "emirates-islamic"], ["projects", "ai-copilot"], ["skills", "product-ux"], ["skills", "design-systems"], ["skills", "vibe-coding"], ["skills", "discovery"]];

export const crossEdges: [string, string][] = [["katim", "enterprise-ops"], ["katim", "secure-comms"], ["digital-dubai", "government"], ["digital-dubai", "dubainow"], ["emirates-nbd", "banking"], ["emirates-nbd", "emirates-islamic"], ["etihad", "aviation"], ["smart-dubai", "government"], ["smart-dubai", "dubainow"], ["cursor", "ai-copilot"], ["claude", "ai-copilot"], ["react", "secure-comms"], ["react-native", "ai-copilot"], ["25-hajj", "hajj-platform"], ["30-dubainow", "dubainow"], ["3-months-secure", "secure-comms"], ["30-emirates-islamic", "emirates-islamic"], ["6-days-copilot", "ai-copilot"], ["banking", "emirates-islamic"], ["banking", "ai-copilot"], ["government", "dubainow"], ["enterprise-ops", "hajj-platform"], ["enterprise-ops", "secure-comms"], ["hajj-platform", "product-ux"], ["dubainow", "product-ux"], ["secure-comms", "design-systems"], ["emirates-islamic", "product-ux"], ["ai-copilot", "vibe-coding"]];
