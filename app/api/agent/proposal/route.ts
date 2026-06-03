import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen } from "@/lib/api-helpers";
import { agentAuthorized, NESSIE_IDENTITY } from "@/lib/agent-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/agent/proposal  { problemSlug, summary, body }
 *
 * The 24/7 worker proposes a concrete solution on a problem, attributed to
 * @nessie. Bearer-token gated. A proposal is a candidate fix for humans to
 * weigh, fund, and ship; the agent never marks it done or releases a bounty.
 */
export async function POST(req: Request) {
  if (!agentAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = clean(body.problemSlug, 100);
  const summary = clean(body.summary, 200);
  const proposalBody = clean(body.body, 6000);
  if (!slug || !summary || !proposalBody) {
    return NextResponse.json(
      { ok: false, error: "problemSlug, summary, body required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const problem = await db.query.problems.findFirst({
    where: eq(schema.problems.slug, slug),
  });
  if (!problem) {
    return NextResponse.json({ ok: false, error: "problem not found" }, { status: 404 });
  }

  const author = await ensureCitizen(NESSIE_IDENTITY);
  const inserted = await db
    .insert(schema.proposals)
    .values({
      problemId: problem.id,
      authorId: author.id,
      authorDisplayName: author.displayName,
      summary,
      body: proposalBody,
    })
    .returning();

  return NextResponse.json({
    ok: true,
    proposal: { id: inserted[0].id, url: `https://ness.city/townhall/${slug}` },
  });
}
