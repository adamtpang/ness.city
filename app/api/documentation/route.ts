import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen, intInRange } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/documentation
 * { problemSlug, body, costUsd?, authorDisplayName, authorHandle }
 *
 * Records the shipped documentation for a problem. Marks the problem
 * "solved", flips the bounty (if any) to "paid", and awards +25 karma
 * to the solver.
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
  const docBody = clean(body.body, 8000);
  const costUsd = body.costUsd === undefined ? null : intInRange(body.costUsd, 0, 50_000);
  const authorDisplayName = clean(body.authorDisplayName, 80) ?? "Anonymous";
  const authorHandle = clean(body.authorHandle, 40) ?? "anon";

  if (!problemSlug || !docBody) {
    return NextResponse.json(
      { ok: false, error: "problemSlug, body required" },
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

  const author = await ensureCitizen({ handle: authorHandle, displayName: authorDisplayName });

  const inserted = await db
    .insert(schema.documentation)
    .values({
      problemId: problem.id,
      authorId: author.id,
      authorDisplayName: author.displayName,
      body: docBody,
      costCents: costUsd === null || costUsd === undefined ? null : costUsd * 100,
    })
    .returning();

  // Mark problem solved
  await db
    .update(schema.problems)
    .set({ status: "solved" })
    .where(eq(schema.problems.id, problem.id));

  // Mark bounty paid if it exists
  const bounty = await db.query.bounties.findFirst({
    where: eq(schema.bounties.problemId, problem.id),
  });
  if (bounty && bounty.state !== "paid") {
    await db
      .update(schema.bounties)
      .set({ state: "paid", claimedById: author.id, paidAt: new Date() })
      .where(eq(schema.bounties.id, bounty.id));
  }

  // +25 karma to the solver
  const KARMA_AWARD = 25;
  await db
    .update(schema.citizens)
    .set({ karma: (author.karma ?? 0) + KARMA_AWARD })
    .where(eq(schema.citizens.id, author.id));

  return NextResponse.json({
    ok: true,
    documentation: inserted[0],
    karmaAwarded: KARMA_AWARD,
    bountyPaid: !!bounty,
  });
}
