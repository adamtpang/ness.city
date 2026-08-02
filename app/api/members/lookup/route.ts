import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/lookup  { q }
 *
 * Narrow "find yourself" typeahead for the Where next form. Deliberately NOT
 * the roster: it requires a real query (2+ chars) and returns at most 8 rows
 * with the bare minimum fields, so you can only find someone whose name you
 * already know. It is a lookup, never a browsable directory.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) return NextResponse.json({ ok: true, members: [] });

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const q = (typeof body.q === "string" ? body.q : "").trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ ok: true, members: [] });

  const db = getDb();
  const like = `%${q}%`;
  const rows = (await db.execute(sql`
    select id, handle, display_name, avatar_url
    from directory_profiles
    where lower(display_name) like ${like} or lower(handle) like ${like}
    order by display_name asc
    limit 8
  `)) as unknown as Array<{
    id: string; handle: string; display_name: string; avatar_url: string | null;
  }>;

  return NextResponse.json({
    ok: true,
    members: rows.map((r) => ({
      id: r.id, handle: r.handle, displayName: r.display_name, avatarUrl: r.avatar_url,
    })),
  });
}
