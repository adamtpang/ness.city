import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET  /api/reactions?slug=<problem-slug>&handle=<viewer-handle>
 *   -> { ok, counts: { [emoji]: number }, mine: emoji[] }
 *
 * POST /api/reactions  { slug, authorHandle, emoji }
 *   -> toggles the reaction (insert if absent, delete if present),
 *      returns the same shape as GET.
 *
 * Allowed emojis are gated server-side so we never store arbitrary
 * input. Four is plenty for v1 — GitHub ships eight; we don't need to.
 */

export const ALLOWED_EMOJIS = ["👍", "❤️", "🎯", "🚀"] as const;
const ALLOWED = new Set<string>(ALLOWED_EMOJIS);

type Counts = { [emoji: string]: number };

async function readCounts(problemId: string, handle: string | null) {
  const db = getDb();
  const rows = await db
    .select({
      emoji: schema.problemReactions.emoji,
      count: sql<number>`count(*)::int`,
    })
    .from(schema.problemReactions)
    .where(eq(schema.problemReactions.problemId, problemId))
    .groupBy(schema.problemReactions.emoji);

  const counts: Counts = {};
  for (const e of ALLOWED_EMOJIS) counts[e] = 0;
  for (const r of rows) counts[r.emoji] = r.count;

  let mine: string[] = [];
  if (handle) {
    const mineRows = await db
      .select({ emoji: schema.problemReactions.emoji })
      .from(schema.problemReactions)
      .where(
        and(
          eq(schema.problemReactions.problemId, problemId),
          eq(schema.problemReactions.authorHandle, handle),
        ),
      );
    mine = mineRows.map((r) => r.emoji);
  }
  return { counts, mine };
}

async function findProblemId(slug: string): Promise<string | null> {
  const db = getDb();
  const rows = await db
    .select({ id: schema.problems.id })
    .from(schema.problems)
    .where(eq(schema.problems.slug, slug))
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function GET(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, configured: false, counts: {}, mine: [] });
  }
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const handle = url.searchParams.get("handle")?.replace(/^@/, "").toLowerCase() || null;
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }
  const problemId = await findProblemId(slug);
  if (!problemId) {
    const empty: Counts = {};
    for (const e of ALLOWED_EMOJIS) empty[e] = 0;
    return NextResponse.json({ ok: true, configured: true, counts: empty, mine: [] });
  }
  const data = await readCounts(problemId, handle);
  return NextResponse.json({ ok: true, configured: true, ...data });
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
  const emoji = typeof body.emoji === "string" ? body.emoji : null;

  if (!slug || !handleRaw || !emoji || !ALLOWED.has(emoji)) {
    return NextResponse.json(
      {
        ok: false,
        error: `slug, authorHandle, emoji required; emoji must be one of: ${[...ALLOWED].join(" ")}`,
      },
      { status: 400 },
    );
  }
  const handle = handleRaw.replace(/^@/, "").toLowerCase();
  const problemId = await findProblemId(slug);
  if (!problemId) {
    return NextResponse.json({ ok: false, error: "problem not found" }, { status: 404 });
  }

  const db = getDb();
  // Try delete first (toggle off). If nothing deleted, insert (toggle on).
  const deleted = await db
    .delete(schema.problemReactions)
    .where(
      and(
        eq(schema.problemReactions.problemId, problemId),
        eq(schema.problemReactions.authorHandle, handle),
        eq(schema.problemReactions.emoji, emoji),
      ),
    )
    .returning({ id: schema.problemReactions.id });

  if (deleted.length === 0) {
    await db
      .insert(schema.problemReactions)
      .values({ problemId, authorHandle: handle, emoji })
      .onConflictDoNothing();
  }

  const data = await readCounts(problemId, handle);
  return NextResponse.json({ ok: true, configured: true, ...data });
}
