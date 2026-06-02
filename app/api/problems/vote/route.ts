import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/problems/vote  { slug, delta }
 *
 * delta is +1 (upvote) or -1 (remove upvote). Adjusts the existing
 * problems.upvotes counter, clamped at 0. Dedup is client-side
 * (localStorage remembers which slugs you've upvoted), so this is an
 * honest community signal, not a hardened anti-sybil vote — that comes
 * with the directory-seeded membership phase. Returns the new count.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }
  let body: { slug?: unknown; delta?: unknown };
  try {
    body = (await req.json()) as { slug?: unknown; delta?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim().slice(0, 80) : "";
  const delta = body.delta === -1 ? -1 : body.delta === 1 ? 1 : null;
  if (!slug || delta === null) {
    return NextResponse.json(
      { ok: false, error: "slug and delta (+1 or -1) required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const rows = await db
    .update(schema.problems)
    .set({ upvotes: sql`greatest(0, ${schema.problems.upvotes} + ${delta})` })
    .where(eq(schema.problems.slug, slug))
    .returning({ upvotes: schema.problems.upvotes });

  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "problem not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, upvotes: rows[0].upvotes });
}
