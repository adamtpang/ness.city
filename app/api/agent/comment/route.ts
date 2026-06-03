import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen } from "@/lib/api-helpers";
import { agentAuthorized, NESSIE_IDENTITY } from "@/lib/agent-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 4000;

/**
 * POST /api/agent/comment  { problemSlug, body }
 *
 * The 24/7 worker posts an explanation on a problem, attributed to
 * @nessie. Bearer-token gated. This is a discussion contribution, not an
 * approval: the agent sharpens the root cause, it does not decide outcomes.
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

  const slug = clean(body.problemSlug, 80);
  const text = clean(body.body, MAX_BODY);
  if (!slug || !text) {
    return NextResponse.json(
      { ok: false, error: "problemSlug and body required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const problem = await db
    .select({ id: schema.problems.id })
    .from(schema.problems)
    .where(eq(schema.problems.slug, slug))
    .limit(1);
  if (problem.length === 0) {
    return NextResponse.json({ ok: false, error: "problem not found" }, { status: 404 });
  }

  const citizen = await ensureCitizen(NESSIE_IDENTITY);
  const inserted = await db
    .insert(schema.problemComments)
    .values({
      problemId: problem[0].id,
      authorId: citizen.id,
      authorHandle: NESSIE_IDENTITY.handle,
      authorDisplayName: NESSIE_IDENTITY.displayName,
      body: text,
    })
    .returning();

  return NextResponse.json({
    ok: true,
    comment: { id: inserted[0].id, url: `https://ness.city/townhall/${slug}` },
  });
}
