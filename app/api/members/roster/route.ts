import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getRoster, getRaterRatedCount, type RosterSort } from "@/lib/members/queries";
import { ensureRater } from "@/lib/members/rater";
import { resolveIdentity } from "@/lib/members/anon";
import { MEMBER_CONFIG } from "@/lib/members/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SORTS: RosterSort[] = ["name", "newest", "oncampus", "github"];

/**
 * POST /api/members/roster  { sort?, q?, onCampus?, hasGithub? }
 *
 * The directory of real people, and deliberately NOT public. You have to take
 * part before you can browse: rate `roster.minRatingsToBrowse` members and the
 * list unlocks. The gate lives here rather than in the UI, so the roster can
 * never be pulled by a crawler or anyone who just calls the endpoint.
 *
 * Returns public directory facts only, never a rating or score.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, members: [], total: 0, shown: 0, locked: false, ratedByMe: 0 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  // Participation gate. The anonymous device identity is enough to count ratings.
  const identity = await resolveIdentity(body);
  const rater = await ensureRater(identity, {
    ref: typeof body.ref === "string" ? body.ref : null,
  });
  const ratedByMe = await getRaterRatedCount(rater.id);
  const required = MEMBER_CONFIG.roster.minRatingsToBrowse;

  if (ratedByMe < required) {
    return NextResponse.json({
      ok: true,
      locked: true,
      ratedByMe,
      required,
      remaining: required - ratedByMe,
      members: [],
      total: 0,
      shown: 0,
    });
  }

  const sort = SORTS.includes(body.sort as RosterSort) ? (body.sort as RosterSort) : "name";
  const q = typeof body.q === "string" ? body.q.slice(0, 100) : "";
  const onCampus = body.onCampus === true;
  const hasGithub = body.hasGithub === true;

  const roster = await getRoster({ sort, q, onCampus, hasGithub, limit: 150 });
  return NextResponse.json({ ok: true, locked: false, ratedByMe, required, ...roster });
}
