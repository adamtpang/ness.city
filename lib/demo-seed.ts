import type { EngineStats, LeaderEntry, ProblemWithCounts } from "@/lib/db/queries";

/**
 * Curated showcase dataset. The home board renders this when the database
 * has no problems yet, so the engine reads full without any DB wiring. The
 * moment real problems exist, the board switches to live data.
 *
 * Problems are seeded from the real Network School community: the most
 * requested features and most persistent gaps from Ramesh Nair's analysis of
 * the #build-log (Aug 2024 to Feb 2026), plus a few meta problems (Ness on
 * Ness). Member directory with skills search was the single most requested
 * thing across all of NS, so it leads the board. Per-problem bounties sum to
 * the Bounty value KPI.
 */

export type DemoSolver = { name: string; handle: string; progress: number };

export type DemoProblem = ProblemWithCounts & {
  urgency: number;
  emoji: string;
  solution: string | null;
  solver: DemoSolver | null;
  surfaced: string;
  bountyUsd: number;
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
  bountyUsd: number;
};

const SEED: Seed[] = [
  { slug: "member-directory-skills-search", emoji: "📒", title: "Member directory with skills search", category: "social", status: "in-progress", importance: 44, urgency: 26, affected: 180, surfaced: "since cohort 1", solution: "A searchable directory: skills, projects, what each member is building", solver: { name: "Jin", handle: "jin", progress: 35 }, bountyUsd: 1500 },
  { slug: "coworking-wifi-drops", emoji: "📶", title: "Coworking wifi drops during calls", category: "infra", status: "in-progress", importance: 38, urgency: 33, affected: 90, surfaced: "2d ago", solution: "Two mesh APs in the east wing, segment the call traffic", solver: { name: "Remy", handle: "remy", progress: 30 }, bountyUsd: 800 },
  { slug: "flexible-meal-credits", emoji: "🍽️", title: "Meal credits should be flexible", category: "operations", status: "open", importance: 34, urgency: 28, affected: 140, surfaced: "4d ago", solution: "Roll over unused credits and allow nearby partner cafes", solver: null, bountyUsd: 0 },
  { slug: "gym-overcrowded-6pm", emoji: "🏋️", title: "Gym is overcrowded at 6pm", category: "wellbeing", status: "open", importance: 32, urgency: 30, affected: 51, surfaced: "2d ago", solution: "Add a second 6 to 8pm coach-led slot + rack booking", solver: { name: "Sol", handle: "sol", progress: 60 }, bountyUsd: 600 },

  { slug: "ness-usdc-escrow-base", emoji: "🏦", title: "Ness needs USDC escrow on Base for bounties", category: "infra", status: "in-progress", importance: 31, urgency: 20, affected: 130, surfaced: "5d ago", solution: "Audited Base escrow that releases USDC on patron sign-off", solver: { name: "Sol", handle: "sol", progress: 40 }, bountyUsd: 900 },
  { slug: "unified-event-calendar", emoji: "🗓️", title: "No unified event calendar", category: "social", status: "investigating", importance: 30, urgency: 18, affected: 120, surfaced: "5d ago", solution: "One calendar that aggregates every NS event with RSVPs", solver: { name: "Sol", handle: "sol", progress: 20 }, bountyUsd: 400 },
  { slug: "governance-model", emoji: "🏛️", title: "We need a clear governance model", category: "policy", status: "open", importance: 28, urgency: 14, affected: 110, surfaced: "6d ago", solution: "Draft a lightweight charter the community ratifies", solver: null, bountyUsd: 0 },
  { slug: "nessie-auto-tag-importance-urgency", emoji: "🤖", title: "Nessie should auto-tag importance and urgency on new problems", category: "policy", status: "in-progress", importance: 27, urgency: 16, affected: 95, surfaced: "3d ago", solution: "Nessie scores each new problem on submit via the agent API", solver: { name: "Jin", handle: "jin", progress: 25 }, bountyUsd: 0 },

  { slug: "more-nature-outdoor-space", emoji: "🌳", title: "More nature and outdoor green space", category: "wellbeing", status: "open", importance: 22, urgency: 12, affected: 80, surfaced: "7d ago", solution: null, solver: null, bountyUsd: 0 },
  { slug: "standing-desks", emoji: "🪑", title: "Standing desks in the coworking space", category: "operations", status: "open", importance: 16, urgency: 10, affected: 40, surfaced: "8d ago", solution: null, solver: null, bountyUsd: 0 },
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
  bountyUsd: s.bountyUsd,
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
