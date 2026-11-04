// Three highlight squares, each with a line icon (components/WorkIcons.tsx), per project in Selected works, next to the metric square (owner, 2026-11-01).
// Each label is the owner's own bold lead from the case study (lib/case-studies.ts, from the live /work/<slug> pages).
// Bodies are the case study sentence, shortened where it ran long; the owner reviews the wording.
import type { WorkIconName } from "@/components/WorkIcons";

export type Highlight = { icon: WorkIconName; label: string; body: string };

export const workHighlights: Record<string, Highlight[]> = {
  "hajj-operations-platform": [
    { icon: "git-branch", label: "Governance decision", body: "The validated model inverted the first assumption: the project manager reports reality, the Mecca team reviews, then approves or sends it back." },
    { icon: "clipboard-list", label: "Data-entry platform", body: "A separate product surface, deliberately not part of the CEO portal: login, project list, add or update, approval, reporting." },
    { icon: "layers", label: "States as reusable patterns", body: "On Track, Delayed, Completed Early, Completed Late and Not Started, authored as reusable patterns rather than one-off screens." },
  ],
  "dubainow-mobile-app": [
    { icon: "component", label: "Design System Approach", body: "Reusable components to establish consistency in all services." },
    { icon: "users", label: "Design Workshop", body: "A week-long collaborative design workshop and user testing established a unified visual style and brand identity for the app." },
    { icon: "timer", label: "57 services in a year", body: "28 new and 29 enhanced services shipped on the design system within a year, with CSAT at 70%." },
  ],
  "secure-communication-app": [
    { icon: "search", label: "Competitor analysis", body: "Defined primary features to build through secondary research & competitor analysis." },
    { icon: "layout-grid", label: "Design system", body: "Leveraging a design system framework and prioritizing frequently used components, able to meet deadlines." },
    { icon: "user-check", label: "Iterative guerilla testing", body: "Conducted guerilla testing for validation to identify usability issues and test design assumptions." },
  ],
  "emirates-islamic-digital-ux": [
    { icon: "compass", label: "UX discovery in grooming", body: "Story mapping prioritised every user story against the squad’s objectives, with a user survey when a story needed more evidence." },
    { icon: "users", label: "NPS above 85", body: "Customer advocacy exceeded 85, and complaints fell to fewer than 3 a week by sprint 18." },
    { icon: "smartphone", label: "Customer-requested features", body: "New features such as ATM self-withdrawal met unmet needs, and customers returned to use them regularly." },
  ],
};
