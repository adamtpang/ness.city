import type { Citizen, Problem } from "./types";

/**
 * Real data for the live platform. Empty until citizens start using ness.city.
 * The worked example used in /about lives in lib/sample.ts.
 */

export const citizens: Citizen[] = [];

export const problems: Problem[] = [];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getCitizen(id: string): Citizen | undefined {
  return citizens.find((c) => c.id === id);
}

export function topSolvers(): Citizen[] {
  return [...citizens]
    .filter((c) => c.karma > 0)
    .sort((a, b) => b.karma - a.karma);
}

export function topPatrons(): Citizen[] {
  return [...citizens]
    .filter((c) => c.patronage > 0)
    .sort((a, b) => b.patronage - a.patronage);
}

export function bountyTotal(p: Problem): number {
  return p.bounty?.pledges.reduce((s, x) => s + x.amount, 0) ?? 0;
}

export function activeBounties(): Problem[] {
  return problems
    .filter((p) => p.bounty && p.bounty.state !== "paid")
    .sort((a, b) => bountyTotal(b) - bountyTotal(a));
}

export const stats = {
  problemsOpen: problems.filter((p) => p.status !== "solved").length,
  problemsSolved: problems.filter((p) => p.status === "solved").length,
  totalKarma: citizens.reduce((s, c) => s + c.karma, 0),
  totalPledged: problems.reduce((s, p) => s + bountyTotal(p), 0),
  citizens: citizens.length,
  activeBounties: problems.filter((p) => p.bounty && p.bounty.state === "collecting").length,
};
