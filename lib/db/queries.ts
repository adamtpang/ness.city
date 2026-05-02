import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import type { Problem as TownhallProblem } from "@/lib/types";

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
