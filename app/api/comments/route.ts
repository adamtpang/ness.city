import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/comments?slug=<problem-slug>
 * Returns the comment thread for that problem, oldest-first.
 *
 * POST /api/comments
 * Body: { slug, authorHandle, authorDisplayName, body }
 * Inserts a comment. Same identity model as listing/ring creation -
 * handle + display name, ensureCitizen() resolves the FK. No auth.
 */

export type CommentRow = {
  id: string;
  authorHandle: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
};

const MAX_BODY = 4000;

export async function GET(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, configured: false, comments: [] });
  }
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "slug required" },
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
    return NextResponse.json({ ok: true, configured: true, comments: [] });
  }
  const rows = await db
    .select({
      id: schema.problemComments.id,
      authorHandle: schema.problemComments.authorHandle,
      authorDisplayName: schema.problemComments.authorDisplayName,
      body: schema.problemComments.body,
      createdAt: schema.problemComments.createdAt,
    })
    .from(schema.problemComments)
    .where(eq(schema.problemComments.problemId, problem[0].id))
    .orderBy(asc(schema.problemComments.createdAt))
    .limit(500);

  const comments: CommentRow[] = rows.map((r) => ({
    id: r.id,
    authorHandle: r.authorHandle,
    authorDisplayName: r.authorDisplayName,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json({ ok: true, configured: true, comments });
}

export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = clean(body.slug, 80);
  const handleRaw = clean(body.authorHandle, 40);
  const displayName = clean(body.authorDisplayName, 80);
  const text = clean(body.body, MAX_BODY);

  if (!slug || !handleRaw || !displayName || !text) {
    return NextResponse.json(
      {
        ok: false,
        error: "slug, authorHandle, authorDisplayName, body required",
      },
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

  const handle = handleRaw.replace(/^@/, "").toLowerCase();
  const citizen = await ensureCitizen({ handle, displayName });

  const inserted = await db
    .insert(schema.problemComments)
    .values({
      problemId: problem[0].id,
      authorId: citizen.id,
      authorHandle: handle,
      authorDisplayName: displayName,
      body: text,
    })
    .returning();

  const row = inserted[0];
  return NextResponse.json({
    ok: true,
    comment: {
      id: row.id,
      authorHandle: row.authorHandle,
      authorDisplayName: row.authorDisplayName,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
    } satisfies CommentRow,
  });
}
