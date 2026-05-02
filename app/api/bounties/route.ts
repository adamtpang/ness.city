import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, intInRange } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/bounties
 * { problemSlug, proposalId, goalUsd }
 *
 * Anchors a bounty to a specific proposal of a specific problem.
 * One bounty per problem (enforced by unique constraint on problem_id).
 */
export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const problemSlug = clean(body.problemSlug, 100);
  const proposalId = clean(body.proposalId, 100);
  const goalUsd = intInRange(body.goalUsd, 5, 50_000);

  if (!problemSlug || !proposalId || goalUsd === null) {
    return NextResponse.json(
      { ok: false, error: "problemSlug, proposalId, goalUsd (5-50000) required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const problem = await db.query.problems.findFirst({
    where: eq(schema.problems.slug, problemSlug),
  });
  if (!problem) {
    return NextResponse.json({ ok: false, error: "problem not found" }, { status: 404 });
  }

  const proposal = await db.query.proposals.findFirst({
    where: eq(schema.proposals.id, proposalId),
  });
  if (!proposal || proposal.problemId !== problem.id) {
    return NextResponse.json(
      { ok: false, error: "proposal not found or doesn't match problem" },
      { status: 404 },
    );
  }

  const inserted = await db
    .insert(schema.bounties)
    .values({
      problemId: problem.id,
      proposalId: proposal.id,
      goalCents: goalUsd * 100,
      state: "collecting",
    })
    .returning();

  // Mark problem as in-progress
  await db
    .update(schema.problems)
    .set({ status: "investigating" })
    .where(eq(schema.problems.id, problem.id));

  return NextResponse.json({ ok: true, bounty: inserted[0] });
}
