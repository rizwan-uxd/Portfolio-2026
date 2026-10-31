// Answers for the AI twin. No model yet (CLAUDE.md, out of scope for v1): a question is matched to a topic by
// keywords, and every answer is built from the works and the CV in lib/content.ts, so it can't say anything they don't.
// The chat only talks to /api/twin, so a real model can replace answer() without touching the UI.
import { aiTwin, cv, liveSite, person, services, works, worksSection } from "@/lib/content";

export type TwinLink = { href: string; label: string };
export type TwinAnswer = { lead: string; points?: string[]; link?: TwinLink };

const emailLink: TwinLink = { href: `mailto:${person.email}`, label: person.email };
const callLink: TwinLink = { href: person.calendly, label: aiTwin.bookCall };

const job = (id: string) => cv.experience.find((e) => e.id === id)!;
const work = (slug: string) => works.find((w) => w.slug === slug)!;
const service = (title: string) => services.find((s) => s.title === title)!;
const result = (slug: string) => {
  const w = work(slug);
  return `${w.title}: ${w.metric} ${w.metricLabel.toLowerCase()}`;
};
const caseStudy = (slug: string): TwinLink => ({ href: `${liveSite}/work/${slug}`, label: worksSection.readCase });

const [portal, reviewPlatform] = job("horizontal").highlights;
const [bankingConcepts, copilot] = job("adcb").highlights;
const [billPayment, adoption] = job("enbd").highlights;
const [dubaiNow, investInDubai] = job("digital-dubai").highlights;
const [systemsAcrossProducts, systemFoundations] = job("katim").highlights;

// Keywords are regex sources, matched on whole words. The topic with the most hits wins, the earlier one on a tie.
const topics: { keywords: string[]; answer: TwinAnswer }[] = [
  {
    keywords: ["ai", "cursor", "claude", "vibe coding", "copilot", "chatgpt", "llm"],
    answer: { lead: copilot, points: [bankingConcepts, service("Vibe coding and prototyping").description] },
  },
  {
    keywords: ["prototyp\\w*", "how fast", "speed", "quick\\w*", "design to code", "react native"],
    answer: { lead: "I took a banking copilot from concept to a working React Native prototype in 3 days, using Claude Code and Cursor.", points: [service("Vibe coding and prototyping").description, ...cv.skills["AI & prototyping"].slice(0, 3)] },
  },
  {
    keywords: ["bank\\w*.*government\\w*", "government\\w*.*bank\\w*"],
    answer: { lead: cv.summary, points: [copilot, billPayment, dubaiNow, investInDubai, cv.award] },
  },
  {
    keywords: ["bank\\w*", "fintech", "financ\\w*", "payments?"],
    answer: { lead: "Yes. Banking is a large part of my work, from Bank of New York Mellon to Emirates NBD and ADCB.", points: [bankingConcepts, copilot, billPayment, adoption, result("emirates-islamic-digital-ux")] },
  },
  {
    keywords: ["government\\w*", "gov", "public sector", "citizen\\w*"],
    answer: { lead: `I spent ${job("digital-dubai").dates} at ${job("digital-dubai").company} as a ${job("digital-dubai").role}.`, points: [dubaiNow, investInDubai, cv.award] },
  },
  {
    keywords: ["fit", "senior", "role", "hire", "hiring", "job", "recruit\\w*", "candidate", "lead(ership)?"],
    answer: {
      lead: `${cv.title} with ${cv.summary}`,
      points: [cv.handsOn, reviewPlatform, dubaiNow, copilot],
      link: callLink,
    },
  },
  {
    keywords: ["biggest", "wins?", "impact", "results?", "metrics?", "achievement\\w*", "enterprise"],
    answer: {
      lead: "These are the measured results from my work:",
      points: [...works.map((w) => result(w.slug)), "Project submission and review platform: review cycles reduced by 35%", "Emirates Islamic bill payment: task time from 5 minutes to under 2.5 minutes", "Invest in Dubai: new-user onboarding up 20%"],
    },
  },
  {
    keywords: ["design systems?", "components?", "tokens?", "governance"],
    answer: { lead: service("Design systems/strategy").description, points: [systemsAcrossProducts, systemFoundations, result("secure-communication-app")] },
  },
  {
    keywords: ["services?", "offer", "what (do|can) you do", "research", "discovery", "usability", "user testing", "process", "approach", "ux"],
    answer: { lead: `${cv.handsOn} Here's what I can do for you:`, points: services.map((s) => `${s.title}: ${s.description}`) },
  },
  // One topic per employer, ahead of the career list, so "did you work at ADCB?" gets the ADCB answer.
  ...cv.experience.map((e) => ({
    keywords: e.keywords,
    answer: { lead: `${e.role} at ${e.company}, ${e.place}, ${e.dates}.`, points: e.highlights.length ? e.highlights : undefined },
  })),
  {
    keywords: ["clients?", "compan(y|ies)", "brands?", "worked", "work history", "career", "employers?", "cv", "resume"],
    answer: { lead: `${cv.title} with ${cv.summary}`, points: cv.experience.map((e) => `${e.company}: ${e.role}, ${e.dates}`) },
  },
  {
    keywords: ["education", "degree", "mba", "stud(y|ied)", "certif\\w*", "awards?", "icxa", "ideo", "qualifications?"],
    answer: { lead: "My education, awards and certifications:", points: [...cv.education, cv.award] },
  },
  {
    keywords: ["tools?", "figma", "stack", "software", "skills?", "miro", "typescript"],
    answer: { lead: "What I work with:", points: Object.entries(cv.skills).map(([group, items]) => `${group}: ${items.join(", ")}`) },
  },
  {
    keywords: ["contact", "email", "call", "book", "meet\\w*", "phone", "linkedin", "reach", "talk", "connect"],
    answer: { lead: `Email ${person.email} or call ${person.phone}. You can also book a call:`, link: callLink },
  },
  {
    keywords: ["who", "about you", "where", "based", "location", "experience", "years", "background"],
    answer: { lead: `I'm ${person.name}, a ${cv.title} in ${person.location}, with ${cv.summary}`, points: [cv.handsOn] },
  },
  {
    keywords: ["hajj", "saudi", "ksa", "energy", "utility"],
    answer: { lead: work("hajj-operations-platform").summary, points: [portal, reviewPlatform, result("hajj-operations-platform")], link: caseStudy("hajj-operations-platform") },
  },
  {
    keywords: ["dubainow", "dubai now"],
    answer: { lead: work("dubainow-mobile-app").summary, points: [dubaiNow, result("dubainow-mobile-app"), cv.award], link: caseStudy("dubainow-mobile-app") },
  },
  {
    keywords: ["secure", "securelink", "communication"],
    answer: { lead: work("secure-communication-app").summary, points: [result("secure-communication-app")], link: caseStudy("secure-communication-app") },
  },
  {
    keywords: ["emirates islamic", "eib", "islamic"],
    answer: { lead: work("emirates-islamic-digital-ux").summary, points: [billPayment, adoption, result("emirates-islamic-digital-ux")], link: caseStudy("emirates-islamic-digital-ux") },
  },
];

export function answer(question: string): TwinAnswer {
  const text = question.toLowerCase();
  let best: TwinAnswer | null = null;
  let bestHits = 0;
  for (const topic of topics) {
    const hits = topic.keywords.filter((k) => new RegExp(`\\b(${k})\\b`).test(text)).length;
    if (hits > bestHits) {
      best = topic.answer;
      bestHits = hits;
    }
  }
  return best ?? { lead: aiTwin.noAnswer, link: emailLink };
}
