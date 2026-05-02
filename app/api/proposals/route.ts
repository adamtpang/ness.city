import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/proposals
 * { problemSlug, summary, body, authorDisplayName, authorHandle }
 *
 * Creates a solution proposal anchored to a problem. Awards no karma at
 * proposal time; karma flows when the proposal is shipped (via /api/documentation).
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
  const summary = clean(body.summary, 200);
  const proposalBody = clean(body.body, 6000);
  const authorDisplayName = clean(body.authorDisplayName, 80) ?? "Anonymous";
  const authorHandle = clean(body.authorHandle, 40) ?? "anon";

  if (!problemSlug || !summary || !proposalBody) {
    return NextResponse.json(
      { ok: false, error: "problemSlug, summary, body required" },
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
    .insert(schema.proposals)
    .values({
      problemId: problem.id,
      authorId: author.id,
      authorDisplayName: author.displayName,
      summary,
      body: proposalBody,
    })
    .returning();

  return NextResponse.json({ ok: true, proposal: inserted[0] });
}
