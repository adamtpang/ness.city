import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { anonIdentity } from "@/lib/members/anon";
import { getRaterRatedCount } from "@/lib/members/queries";
import { ensureRater } from "@/lib/members/rater";
import { MEMBER_CONFIG } from "@/lib/members/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/directory/search?q=<query>
 *
 * Returns up to 8 directory matches. Ranks by:
 *   1. Exact handle match
 *   2. Handle prefix
 *   3. Display name prefix
 *   4. Display name contains
 *
 * Used by the /pagerank ring-builder autocomplete. If the directory is
 * empty (no scrape yet) it returns { ok: true, results: [] } so the
 * client can degrade to free-text.
 *
 * PRIVACY GATE (added 2026-08-15): role and location were returned
 * unconditionally to any caller, no auth, no participation requirement,
 * effectively an open enumeration endpoint over ~2,753 real people's
 * name + job + employer + location, the exact data /api/members/roster
 * deliberately locks behind `roster.minRatingsToBrowse`. Handle/
 * displayName/avatarUrl stay open (needed for the picker to work at all
 * for new users); role/location now require the same participation gate
 * roster already uses, same identity cookie, same threshold.
 */
export async function GET(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const url = new URL(req.url);
  const raw = (url.searchParams.get("q") ?? "").trim();
  if (raw.length < 1) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const q = raw.slice(0, 64).toLowerCase();
  const prefix = `${q}%`;
  const contains = `%${q}%`;

  const identity = await anonIdentity();
  const rater = await ensureRater(identity);
  const ratedByMe = await getRaterRatedCount(rater.id);
  const canSeeSensitiveFields = ratedByMe >= MEMBER_CONFIG.roster.minRatingsToBrowse;

  const db = getDb();

  // Single SQL with a rank column so we sort by quality of match.
  const rows = (await db.execute(
    sql`
      select
        handle,
        display_name,
        avatar_url,
        role,
        location,
        case
          when lower(handle) = ${q} then 0
          when lower(handle) like ${prefix} then 1
          when lower(display_name) like ${prefix} then 2
          when lower(display_name) like ${contains} then 3
          else 4
        end as rank
      from directory_profiles
      where
        lower(handle) like ${contains}
        or lower(display_name) like ${contains}
      order by rank asc, display_name asc
      limit 8
    `,
  )) as unknown as Array<{
    handle: string;
    display_name: string;
    avatar_url: string | null;
    role: string | null;
    location: string | null;
    rank: number;
  }>;

  return NextResponse.json({
    ok: true,
    results: rows.map((r) => ({
      handle: r.handle,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      role: canSeeSensitiveFields ? r.role : null,
      location: canSeeSensitiveFields ? r.location : null,
    })),
  });
}
