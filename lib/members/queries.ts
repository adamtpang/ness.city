import { sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { MEMBER_CONFIG } from "./config";
import type { Rater } from "./rater";

/**
 * Read queries for the rating subsystem. Raw SQL for the aggregations, in
 * the same style as /api/pagerank and /api/directory/search.
 *
 * NONE of these ever expose a member's own score or who rated them. The
 * rate deck returns only directory facts; the public highlights return
 * vouch COUNTS but no numeric scores and no per-rater identity.
 */

export type DeckMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
  ratingCount: number;
};

export type RateDeck = {
  members: DeckMember[];
  /** Total rateable members (excludes the rater themselves). */
  total: number;
  /** How many the rater has already cleared (progress numerator). */
  ratedByMe: number;
};

/**
 * The deck of members to rate, in smart order for even coverage:
 *   1. fewest ratings first — so coverage fills in evenly instead of
 *      everyone rating the same twenty faces (the stated goal);
 *   2. freshest directory entry next, the best "recently active" proxy we
 *      have until a real activity feed exists;
 *   3. stable id tie-break.
 * Members the rater has already cleared are excluded from the deck, as is
 * the rater's own profile.
 */
export async function getRateDeck(rater: Rater, limit = 40): Promise<RateDeck> {
  if (!isDbConfigured) return { members: [], total: 0, ratedByMe: 0 };
  const db = getDb();
  const selfId = rater.subjectProfileId ?? null;

  const deckRows = (await db.execute(sql`
    select
      dp.id,
      dp.handle,
      dp.display_name,
      dp.avatar_url,
      coalesce(nullif(dp.role, ''), dp.bio) as building,
      coalesce(rc.cnt, 0)::int as rating_count
    from directory_profiles dp
    left join (
      select subject_profile_id, count(*)::int as cnt
      from member_ratings
      group by subject_profile_id
    ) rc on rc.subject_profile_id = dp.id
    where
      not exists (
        select 1 from member_ratings mr
        where mr.subject_profile_id = dp.id and mr.rater_id = ${rater.id}
      )
      and (${selfId}::uuid is null or dp.id <> ${selfId}::uuid)
    order by rating_count asc, dp.scraped_at desc, dp.id asc
    limit ${limit}
  `)) as unknown as Array<{
    id: string;
    handle: string;
    display_name: string;
    avatar_url: string | null;
    building: string | null;
    rating_count: number;
  }>;

  const [{ total, rated_by_me }] = (await db.execute(sql`
    select
      (
        select count(*)::int from directory_profiles dp
        where (${selfId}::uuid is null or dp.id <> ${selfId}::uuid)
      ) as total,
      (
        select count(*)::int from member_ratings mr
        where mr.rater_id = ${rater.id}
      ) as rated_by_me
  `)) as unknown as Array<{ total: number; rated_by_me: number }>;

  return {
    members: deckRows.map((r) => ({
      id: r.id,
      handle: r.handle,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      building: r.building,
      ratingCount: r.rating_count,
    })),
    total: total ?? 0,
    ratedByMe: rated_by_me ?? 0,
  };
}

export type HighlightMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
  vouchedBy: number;
};

export type PublicHighlights = {
  members: HighlightMember[];
  totalRatings: number;
  membersCovered: number;
  totalMembers: number;
};

/**
 * Public highlights: the top-vouched members as score-free cards, plus the
 * live counters. "vouchedBy" is the number of DISTINCT raters who vouched
 * "yes" — a count, never a score. Only members clearing the vouch floor
 * appear, so the wall is genuine social proof.
 */
export async function getPublicHighlights(): Promise<PublicHighlights> {
  if (!isDbConfigured) {
    return { members: [], totalRatings: 0, membersCovered: 0, totalMembers: 0 };
  }
  const db = getDb();

  const rows = (await db.execute(sql`
    select
      dp.id,
      dp.handle,
      dp.display_name,
      dp.avatar_url,
      coalesce(nullif(dp.role, ''), dp.bio) as building,
      count(distinct mr.rater_id)::int as vouched_by
    from member_ratings mr
    join directory_profiles dp on dp.id = mr.subject_profile_id
    where mr.vouch = 'yes'
    group by dp.id, dp.handle, dp.display_name, dp.avatar_url, building
    having count(distinct mr.rater_id) >= ${MEMBER_CONFIG.highlightsMinVouches}
    order by vouched_by desc, dp.display_name asc
    limit ${MEMBER_CONFIG.highlightsWallSize}
  `)) as unknown as Array<{
    id: string;
    handle: string;
    display_name: string;
    avatar_url: string | null;
    building: string | null;
    vouched_by: number;
  }>;

  const [counters] = (await db.execute(sql`
    select
      (select count(*)::int from member_ratings where answered_count >= 1) as total_ratings,
      (select count(distinct subject_profile_id)::int from member_ratings where answered_count >= 1) as members_covered,
      (select count(*)::int from directory_profiles) as total_members
  `)) as unknown as Array<{
    total_ratings: number;
    members_covered: number;
    total_members: number;
  }>;

  return {
    members: rows.map((r) => ({
      id: r.id,
      handle: r.handle,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      building: r.building,
      vouchedBy: r.vouched_by,
    })),
    totalRatings: counters?.total_ratings ?? 0,
    membersCovered: counters?.members_covered ?? 0,
    totalMembers: counters?.total_members ?? 0,
  };
}

/** New ratings this rater has created in the last hour (rate-limit check). */
export async function ratingsInLastHour(raterId: string): Promise<number> {
  if (!isDbConfigured) return 0;
  const db = getDb();
  const [row] = (await db.execute(sql`
    select count(*)::int as cnt
    from member_ratings
    where rater_id = ${raterId}
      and created_at > now() - interval '1 hour'
  `)) as unknown as Array<{ cnt: number }>;
  return row?.cnt ?? 0;
}
