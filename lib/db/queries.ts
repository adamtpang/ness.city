import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import type { Problem as TownhallProblem } from "@/lib/types";

/**
 * Engine vital signs for the home KPI strip. Real counts from the DB:
 * open problems, solved problems, total pledged (USD), active Fixers.
 */
export type EngineStats = {
  open: number;
  solved: number;
  pledgedUsd: number;
  fixers: number;
};

export async function getEngineStats(): Promise<EngineStats> {
  if (!isDbConfigured) return { open: 0, solved: 0, pledgedUsd: 0, fixers: 0 };
  const db = getDb();
  const [probRows, pledgeRow, fixerRow] = await Promise.all([
    db.select({ status: schema.problems.status }).from(schema.problems),
    db
      .select({
        cents: sql<number>`coalesce(sum(${schema.pledges.amountCents}), 0)::int`,
      })
      .from(schema.pledges),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.citizens)
      .where(sql`${schema.citizens.karma} > 0`),
  ]);
  const open = probRows.filter((p) => p.status !== "solved").length;
  const solved = probRows.filter((p) => p.status === "solved").length;
  return {
    open,
    solved,
    pledgedUsd: Math.round((pledgeRow[0]?.cents ?? 0) / 100),
    fixers: fixerRow[0]?.n ?? 0,
  };
}

export type DbProblem = typeof schema.problems.$inferSelect;
export type DbProposal = typeof schema.proposals.$inferSelect;
export type DbBounty = typeof schema.bounties.$inferSelect;
export type DbPledge = typeof schema.pledges.$inferSelect;
export type DbDocumentation = typeof schema.documentation.$inferSelect;

export async function listProblems() {
  if (!isDbConfigured) return [];
  const db = getDb();
  return db
    .select()
    .from(schema.problems)
    .orderBy(desc(schema.problems.createdAt))
    .limit(100);
}

/**
 * All proposals across all problems, the "Pull Requests" tab on /townhall.
 * Joined with the parent problem so the row can link back.
 */
export type ProposalRow = {
  id: string;
  summary: string;
  authorDisplayName: string;
  createdAt: string;
  upvotes: number;
  problemSlug: string;
  problemTitle: string;
  problemStatus: string;
};

export async function listAllProposals(): Promise<ProposalRow[]> {
  if (!isDbConfigured) return [];
  const db = getDb();
  const rows = await db
    .select({
      id: schema.proposals.id,
      summary: schema.proposals.summary,
      authorDisplayName: schema.proposals.authorDisplayName,
      createdAt: schema.proposals.createdAt,
      upvotes: schema.proposals.upvotes,
      problemSlug: schema.problems.slug,
      problemTitle: schema.problems.title,
      problemStatus: schema.problems.status,
    })
    .from(schema.proposals)
    .innerJoin(schema.problems, eq(schema.proposals.problemId, schema.problems.id))
    .orderBy(desc(schema.proposals.createdAt))
    .limit(100);
  return rows.map((r) => ({
    id: r.id,
    summary: r.summary,
    authorDisplayName: r.authorDisplayName,
    createdAt: r.createdAt.toISOString(),
    upvotes: r.upvotes,
    problemSlug: r.problemSlug,
    problemTitle: r.problemTitle,
    problemStatus: r.problemStatus as string,
  }));
}

export async function getProblemBySlug(slug: string) {
  if (!isDbConfigured) return null;
  const db = getDb();
  return (
    (await db.query.problems.findFirst({
      where: eq(schema.problems.slug, slug),
      with: {
        proposals: { orderBy: desc(schema.proposals.createdAt) },
        bounty: { with: { pledges: true } },
        documentation: true,
      },
    })) ?? null
  );
}

/**
 * Adapter from DB row shape into the UI Problem shape used by ProblemCard
 * and the existing detail page. Keeps the existing components unchanged
 * while we migrate.
 */
export function dbProblemToTownhall(
  p: DbProblem & {
    proposals?: DbProposal[];
    bounty?: (DbBounty & { pledges?: DbPledge[] }) | null;
    documentation?: DbDocumentation | null;
  },
): TownhallProblem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    rootCause: p.rootCause,
    category: p.category as TownhallProblem["category"],
    status: p.status as TownhallProblem["status"],
    reporterId: p.reporterId ?? p.id,
    createdAt: p.createdAt.toISOString(),
    upvotes: p.upvotes,
    affected: p.affected,
    proposals: (p.proposals ?? []).map((pr) => ({
      id: pr.id,
      authorId: pr.authorId ?? pr.id,
      summary: pr.summary,
      body: pr.body,
      createdAt: pr.createdAt.toISOString(),
      upvotes: pr.upvotes,
    })),
    bounty: p.bounty
      ? {
          proposalId: p.bounty.proposalId ?? "",
          goal: p.bounty.goalCents / 100,
          state: p.bounty.state,
          claimedBy: p.bounty.claimedById ?? undefined,
          paidAt: p.bounty.paidAt
            ? p.bounty.paidAt.toISOString()
            : undefined,
          pledges: (p.bounty.pledges ?? []).map((pl) => ({
            patronId: pl.patronId ?? pl.id,
            amount: pl.amountCents / 100,
            pledgedAt: pl.pledgedAt.toISOString(),
            note: pl.note ?? undefined,
          })),
        }
      : undefined,
    documentation: p.documentation
      ? {
          authorId: p.documentation.authorId ?? p.documentation.id,
          body: p.documentation.body,
          cost:
            p.documentation.costCents == null
              ? undefined
              : p.documentation.costCents / 100,
          shippedAt: p.documentation.shippedAt.toISOString(),
          upvotes: p.documentation.upvotes,
        }
      : undefined,
  };
}

/**
 * Light citizen lookup. The detail page renders avatars + names from
 * the citizens table when a problem is from the DB, falls back to
 * sample citizens when the slug points at a sample worked example.
 */
export async function getCitizensByIds(ids: string[]) {
  if (!isDbConfigured || ids.length === 0) return [];
  const db = getDb();
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (unique.length === 0) return [];
  return db
    .select()
    .from(schema.citizens)
    .where(eq(schema.citizens.id, unique[0])); // simple case for now
}

/** Problems + per-problem explanation (comment) and solution (proposal)
 *  counts, for the dashboard table. Sorted by votes desc. */
export type ProblemWithCounts = DbProblem & {
  commentCount: number;
  proposalCount: number;
};

export async function listProblemsWithCounts(): Promise<ProblemWithCounts[]> {
  if (!isDbConfigured) return [];
  const db = getDb();
  const problems = await db
    .select()
    .from(schema.problems)
    .orderBy(desc(schema.problems.upvotes), desc(schema.problems.createdAt))
    .limit(100);
  if (problems.length === 0) return [];
  const [comments, proposals] = await Promise.all([
    db
      .select({
        pid: schema.problemComments.problemId,
        n: sql<number>`count(*)::int`,
      })
      .from(schema.problemComments)
      .groupBy(schema.problemComments.problemId),
    db
      .select({
        pid: schema.proposals.problemId,
        n: sql<number>`count(*)::int`,
      })
      .from(schema.proposals)
      .groupBy(schema.proposals.problemId),
  ]);
  const cmap = new Map(comments.map((r) => [r.pid, r.n]));
  const pmap = new Map(proposals.map((r) => [r.pid, r.n]));
  return problems.map((p) => ({
    ...p,
    commentCount: cmap.get(p.id) ?? 0,
    proposalCount: pmap.get(p.id) ?? 0,
  }));
}

/** Top Patrons (by $ pledged) and Fixers (by karma) for the side rails. */
export type LeaderEntry = { name: string; handle: string; value: number };
export async function getLeaderboards(): Promise<{
  patrons: LeaderEntry[];
  fixers: LeaderEntry[];
}> {
  if (!isDbConfigured) return { patrons: [], fixers: [] };
  const db = getDb();
  const [fixers, patrons] = await Promise.all([
    db
      .select({
        name: schema.citizens.displayName,
        handle: schema.citizens.handle,
        karma: schema.citizens.karma,
      })
      .from(schema.citizens)
      .where(sql`${schema.citizens.karma} > 0`)
      .orderBy(desc(schema.citizens.karma))
      .limit(6),
    db
      .select({
        name: schema.citizens.displayName,
        handle: schema.citizens.handle,
        cents: schema.citizens.patronageCents,
      })
      .from(schema.citizens)
      .where(sql`${schema.citizens.patronageCents} > 0`)
      .orderBy(desc(schema.citizens.patronageCents))
      .limit(6),
  ]);
  return {
    fixers: fixers.map((f) => ({ name: f.name, handle: f.handle, value: f.karma })),
    patrons: patrons.map((p) => ({
      name: p.name,
      handle: p.handle,
      value: Math.round(p.cents / 100),
    })),
  };
}
