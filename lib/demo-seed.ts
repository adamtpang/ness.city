import type { EngineStats, LeaderEntry, ProblemWithCounts } from "@/lib/db/queries";

/**
 * Curated showcase dataset. The home board renders this when the database
 * has no problems yet, so the engine reads full for a demo without any DB
 * wiring. The moment real problems exist, the board switches to live data.
 *
 * Each problem carries community importance + urgency (for the Eisenhower
 * sort), an emoji, a leading solution, a claiming solver with progress, and
 * a surfaced time. Mixes community problems with meta problems (Ness on Ness).
 */

export type DemoSolver = { name: string; handle: string; progress: number };

export type DemoProblem = ProblemWithCounts & {
  urgency: number;
  emoji: string;
  solution: string | null;
  solver: DemoSolver | null;
  surfaced: string;
};

type Seed = {
  slug: string;
  emoji: string;
  title: string;
  category: ProblemWithCounts["category"];
  status: ProblemWithCounts["status"];
  importance: number;
  urgency: number;
  affected: number;
  surfaced: string;
  solution: string | null;
  solver: DemoSolver | null;
};

const SEED: Seed[] = [
  // Ness on Ness: the platform improving itself, in the open.
  { slug: "ness-usdc-escrow-base", emoji: "🏦", title: "Ness needs USDC escrow on Base for bounties", category: "infra", status: "in-progress", importance: 41, urgency: 30, affected: 130, surfaced: "5d ago", solution: "Audited Base escrow that releases USDC on patron sign-off", solver: { name: "Sol", handle: "sol", progress: 40 } },
  { slug: "per-problem-discussion-threads", emoji: "💬", title: "Per-problem discussion threads (WhatsApp and Discord style)", category: "social", status: "investigating", importance: 33, urgency: 16, affected: 110, surfaced: "4d ago", solution: "A lightweight thread embedded under each problem", solver: null },
  { slug: "nessie-auto-tag-importance-urgency", emoji: "🤖", title: "Nessie should auto-tag importance and urgency on new problems", category: "policy", status: "in-progress", importance: 30, urgency: 19, affected: 95, surfaced: "3d ago", solution: "Nessie scores each new problem on submit via the agent API", solver: { name: "Jin", handle: "jin", progress: 25 } },
  { slug: "campus-business-directory", emoji: "🏢", title: "Campus business directory: on-land vs cloud companies", category: "operations", status: "open", importance: 24, urgency: 12, affected: 70, surfaced: "6d ago", solution: null, solver: null },

  // Community problems from the floor.
  { slug: "gym-overcrowded-6pm", emoji: "🏋️", title: "Gym is overcrowded at 6pm", category: "wellbeing", status: "open", importance: 38, urgency: 34, affected: 51, surfaced: "2d ago", solution: "Add a second 6 to 8pm coach-led slot + rack booking", solver: { name: "Sol", handle: "sol", progress: 60 } },
  { slug: "coworking-wifi-drops", emoji: "📶", title: "Coworking wifi drops during calls", category: "infra", status: "in-progress", importance: 31, urgency: 33, affected: 44, surfaced: "2d ago", solution: "Two mesh APs in the east wing, segment the call traffic", solver: { name: "Remy", handle: "remy", progress: 30 } },
  { slug: "no-quiet-deep-work-room", emoji: "🤫", title: "No quiet room for deep work", category: "infra", status: "investigating", importance: 28, urgency: 17, affected: 42, surfaced: "4d ago", solution: "Convert the east corner into a phones-off quiet zone", solver: null },
  { slug: "onboarding-new-arrivals", emoji: "🧭", title: "No clear onboarding for week-one arrivals", category: "social", status: "solved", importance: 26, urgency: 14, affected: 47, surfaced: "8d ago", solution: "Week-one checklist + a Sunday walkthrough", solver: { name: "Sol", handle: "sol", progress: 100 } },
  { slug: "visa-run-logistics", emoji: "🛂", title: "Visa run logistics are confusing for newcomers", category: "operations", status: "open", importance: 22, urgency: 24, affected: 33, surfaced: "6d ago", solution: null, solver: null },
  { slug: "find-training-partners", emoji: "🤝", title: "Hard to find people to train with", category: "social", status: "open", importance: 14, urgency: 9, affected: 21, surfaced: "7d ago", solution: null, solver: null },
];

const SEED_DATE = new Date("2026-06-01T00:00:00.000Z");

export const demoProblems: DemoProblem[] = SEED.map((s, i) => ({
  id: `demo-${i}`,
  slug: s.slug,
  title: s.title,
  summary: s.title,
  rootCause: "To be diagnosed by the community.",
  category: s.category,
  status: s.status,
  reporterId: null,
  reporterDisplayName: "NS member",
  affected: s.affected,
  upvotes: s.importance,
  urgency: s.urgency,
  emoji: s.emoji,
  solution: s.solution,
  solver: s.solver,
  surfaced: s.surfaced,
  createdAt: SEED_DATE,
  updatedAt: SEED_DATE,
  commentCount: 0,
  proposalCount: s.solution ? 1 : 0,
}));

// Patrons by USDC contributed (sums to the Bounty value KPI). Solvers by
// USDC earned from shipped bounties.
export const demoBoards: { patrons: LeaderEntry[]; fixers: LeaderEntry[] } = {
  patrons: [
    { name: "Maya", handle: "maya", value: 1500 },
    { name: "Ari", handle: "ari", value: 1100 },
    { name: "Devon", handle: "devon", value: 800 },
    { name: "Priya", handle: "priya", value: 500 },
    { name: "Theo", handle: "theo", value: 300 },
  ],
  fixers: [
    { name: "Sol", handle: "sol", value: 900 },
    { name: "Jin", handle: "jin", value: 620 },
    { name: "Remy", handle: "remy", value: 380 },
    { name: "Kabir", handle: "kabir", value: 250 },
    { name: "Lena", handle: "lena", value: 150 },
  ],
};

export const demoStats: EngineStats = {
  open: demoProblems.filter((p) => p.status !== "solved").length,
  solved: demoProblems.filter((p) => p.status === "solved").length,
  pledgedUsd: 4200,
  fixers: demoBoards.fixers.length,
};
