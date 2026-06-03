import type { EngineStats, LeaderEntry, ProblemWithCounts } from "@/lib/db/queries";

/**
 * Curated showcase dataset. The home board renders this when the database
 * has no problems yet, so the engine reads full for a demo without any DB
 * wiring. The moment real problems exist, the board switches to live data.
 *
 * Each problem carries a community importance (upvotes) and urgency score,
 * which the board uses to sort into Eisenhower quadrants. The set mixes
 * community problems with meta problems (Ness improving Ness).
 */

export type DemoProblem = ProblemWithCounts & { urgency: number };

type Seed = {
  slug: string;
  title: string;
  category: ProblemWithCounts["category"];
  status: ProblemWithCounts["status"];
  importance: number;
  urgency: number;
  affected: number;
  commentCount: number;
  proposalCount: number;
  reporter: string;
};

const SEED: Seed[] = [
  // Ness on Ness: the platform improving itself, in the open.
  { slug: "ness-usdc-escrow-base", title: "Ness needs USDC escrow on Base for bounties", category: "infra", status: "in-progress", importance: 41, urgency: 30, affected: 130, commentCount: 7, proposalCount: 3, reporter: "Open sourcerers" },
  { slug: "per-problem-discussion-threads", title: "Per-problem discussion threads (WhatsApp and Discord style)", category: "social", status: "investigating", importance: 33, urgency: 16, affected: 110, commentCount: 5, proposalCount: 2, reporter: "Open sourcerers" },
  { slug: "nessie-auto-tag-importance-urgency", title: "Nessie should auto-tag importance and urgency on new problems", category: "policy", status: "in-progress", importance: 30, urgency: 19, affected: 95, commentCount: 6, proposalCount: 2, reporter: "Nessie" },
  { slug: "campus-business-directory", title: "Campus business directory: on-land vs cloud companies", category: "operations", status: "open", importance: 24, urgency: 12, affected: 70, commentCount: 3, proposalCount: 1, reporter: "Open sourcerers" },

  // Community problems from the floor.
  { slug: "gym-overcrowded-6pm", title: "Gym is overcrowded at 6pm", category: "wellbeing", status: "open", importance: 38, urgency: 34, affected: 51, commentCount: 4, proposalCount: 2, reporter: "Anonymous" },
  { slug: "coworking-wifi-drops", title: "Coworking wifi drops during calls", category: "infra", status: "in-progress", importance: 31, urgency: 33, affected: 44, commentCount: 3, proposalCount: 2, reporter: "Remy" },
  { slug: "no-quiet-deep-work-room", title: "No quiet room for deep work", category: "infra", status: "investigating", importance: 28, urgency: 17, affected: 42, commentCount: 3, proposalCount: 1, reporter: "Jin" },
  { slug: "onboarding-new-arrivals", title: "No clear onboarding for week-one arrivals", category: "social", status: "solved", importance: 26, urgency: 14, affected: 47, commentCount: 5, proposalCount: 3, reporter: "Sol" },
  { slug: "visa-run-logistics", title: "Visa run logistics are confusing for newcomers", category: "operations", status: "open", importance: 22, urgency: 24, affected: 33, commentCount: 2, proposalCount: 1, reporter: "Anonymous" },
  { slug: "find-training-partners", title: "Hard to find people to train with", category: "social", status: "open", importance: 14, urgency: 9, affected: 21, commentCount: 1, proposalCount: 1, reporter: "Anonymous" },
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
  reporterDisplayName: s.reporter,
  affected: s.affected,
  upvotes: s.importance,
  urgency: s.urgency,
  createdAt: SEED_DATE,
  updatedAt: SEED_DATE,
  commentCount: s.commentCount,
  proposalCount: s.proposalCount,
}));

export const demoBoards: { patrons: LeaderEntry[]; fixers: LeaderEntry[] } = {
  patrons: [
    { name: "Maya", handle: "maya", value: 600 },
    { name: "Ari", handle: "ari", value: 450 },
    { name: "Devon", handle: "devon", value: 300 },
    { name: "Priya", handle: "priya", value: 250 },
    { name: "Theo", handle: "theo", value: 150 },
  ],
  fixers: [
    { name: "Sol", handle: "sol", value: 120 },
    { name: "Jin", handle: "jin", value: 95 },
    { name: "Remy", handle: "remy", value: 70 },
    { name: "Kabir", handle: "kabir", value: 55 },
    { name: "Lena", handle: "lena", value: 40 },
  ],
};

export const demoStats: EngineStats = {
  open: demoProblems.filter((p) => p.status !== "solved").length,
  solved: demoProblems.filter((p) => p.status === "solved").length,
  pledgedUsd: 1750,
  fixers: demoBoards.fixers.length,
};
