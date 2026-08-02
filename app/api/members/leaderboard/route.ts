import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getMemberSettings } from "@/lib/members/settings";
import { ensureRater } from "@/lib/members/rater";
import { resolveIdentity } from "@/lib/members/anon";
import { getCounters, getLeaderboardRanked, getRaterDistribution, getInvitesLanded } from "@/lib/members/queries";
import { unlockedRows } from "@/lib/members/scoring";
import { MEMBER_CONFIG } from "@/lib/members/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/leaderboard  { identity?: {...} }
 *
 * The ranked social index, with progressive reveal. Signed-in callers unlock
 * more rows the more they've rated; signed-out callers see a small teaser.
 * The viewer's own row is hidden. Only aggregate sentiment (a 0…1 fill) is
 * returned — never a raw score, never who rated whom.
 */
export async function POST(req: Request) {
  const counters = await getCounters();
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, members: [], counters, unlocked: 0, totalRanked: 0, ratedByMe: 0, signedIn: false });
  }

  const settings = await getMemberSettings();
  if (settings.ratingsFrozen) {
    return NextResponse.json({ ok: true, frozen: true, counters });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const ref = typeof b.ref === "string" ? b.ref : null;

  const identity = await resolveIdentity(body);
  const signedIn = true;

  const rater = await ensureRater(identity, { ref });
  const selfProfileId: string | null = rater.subjectProfileId ?? null;
  const [distribution, invitesLanded] = await Promise.all([
    getRaterDistribution(rater.id),
    getInvitesLanded(rater.inviteCode),
  ]);
  const ratedByMe = (Object.values(distribution) as number[]).reduce((a, b) => a + b, 0);

  const ranked = await getLeaderboardRanked(selfProfileId);
  const unlocked = unlockedRows(ratedByMe, invitesLanded, ranked.length, signedIn);
  const members = ranked.slice(0, unlocked).map((m, i) => ({ ...m, rank: i + 1 }));

  return NextResponse.json({
    ok: true,
    frozen: false,
    members,
    counters,
    unlocked,
    totalRanked: ranked.length,
    locked: Math.max(0, ranked.length - unlocked),
    revealPerRating: MEMBER_CONFIG.leaderboard.revealPerRating,
    revealPerInvite: MEMBER_CONFIG.leaderboard.revealPerInvite,
    ratedByMe,
    invitesLanded,
    distribution,
    inviteCode: rater.inviteCode,
    signedIn,
  });
}
