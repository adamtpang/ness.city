import { sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { MEMBER_CONFIG } from "./config";
import { toFill } from "./scoring";
import type { Rater } from "./rater";

/**
 * Read queries for the rating subsystem. Raw SQL for the aggregations, in
 * the same style as the rest of the app.
 *
 * NONE of these expose who rated whom. The leaderboard hides the viewer's
 * own row (config.hideOwnRow) and returns only aggregate scores.
 */

// Priority keywords as one delimited string; string_to_array rebuilds the
// text[] inside SQL (passing a JS array to `any()` expands to a tuple, not an
// array). Keywords are simple words, so "|" is a safe delimiter.
const priorityPatternString = () =>
  MEMBER_CONFIG.deck.priorityKeywords.map((k) => `%${k}%`).join("|");

export type DeckMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
};

export type RateDeck = {
  members: DeckMember[];
  total: number;
  ratedByMe: number;
};

/**
 * The deck of members to rate. Order: priority members first (directory
 * role/location matches a priority keyword — seed the high-signal people),
 * then fewest ratings (even coverage), then freshest. Excludes the rater's
 * own profile and anyone they've already rated.
 */
export async function getRateDeck(rater: Rater, limit = MEMBER_CONFIG.deck.limit): Promise<RateDeck> {
  if (!isDbConfigured) return { members: [], total: 0, ratedByMe: 0 };
  const db = getDb();
  const selfId = rater.subjectProfileId ?? null;
  const patterns = priorityPatternString();

  const rows = (await db.execute(sql`
    select
      dp.id, dp.handle, dp.display_name, dp.avatar_url,
      coalesce(nullif(dp.role, ''), dp.bio) as building,
      case when (coalesce(dp.role,'') || ' ' || coalesce(dp.location,'')) ilike any(string_to_array(${patterns}, '|'))
           then 0 else 1 end as prio,
      coalesce(rc.cnt, 0)::int as rating_count
    from directory_profiles dp
    left join (
      select subject_profile_id, count(*)::int as cnt
      from member_ratings group by subject_profile_id
    ) rc on rc.subject_profile_id = dp.id
    where
      not exists (
        select 1 from member_ratings mr
        where mr.subject_profile_id = dp.id and mr.rater_id = ${rater.id}
      )
      and (${selfId}::uuid is null or dp.id <> ${selfId}::uuid)
    order by prio asc, rating_count asc, dp.scraped_at desc, dp.id asc
    limit ${limit}
  `)) as unknown as Array<{
    id: string; handle: string; display_name: string;
    avatar_url: string | null; building: string | null;
  }>;

  const [{ total, rated_by_me }] = (await db.execute(sql`
    select
      (select count(*)::int from directory_profiles dp
        where (${selfId}::uuid is null or dp.id <> ${selfId}::uuid)) as total,
      (select count(*)::int from member_ratings where rater_id = ${rater.id}) as rated_by_me
  `)) as unknown as Array<{ total: number; rated_by_me: number }>;

  return {
    members: rows.map((r) => ({
      id: r.id, handle: r.handle, displayName: r.display_name,
      avatarUrl: r.avatar_url, building: r.building,
    })),
    total: total ?? 0,
    ratedByMe: rated_by_me ?? 0,
  };
}

export type RankedMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
  ratings: number;
  /** 0…1 sentiment fill for the bar. No raw score is exposed. */
  fill: number;
};

/**
 * Full ranked leaderboard (before the reveal slice). Ranked by shrunk mean
 * desc, then rating count. Members below the min-ratings threshold are held
 * out. Optionally excludes the viewer's own subject row.
 */
export async function getLeaderboardRanked(selfProfileId: string | null): Promise<RankedMember[]> {
  if (!isDbConfigured) return [];
  const db = getDb();
  const { priorMean, priorWeight, minRatingsToRank } = MEMBER_CONFIG.score;
  const excludeSelf = MEMBER_CONFIG.hideOwnRow ? selfProfileId : null;

  const rows = (await db.execute(sql`
    select
      dp.id, dp.handle, dp.display_name, dp.avatar_url,
      coalesce(nullif(dp.role, ''), dp.bio) as building,
      count(*)::int as n,
      (sum(mr.rating)::float8 + ${priorMean}::float8 * ${priorWeight}::float8)
        / (count(*)::float8 + ${priorWeight}::float8) as shrunk
    from member_ratings mr
    join directory_profiles dp on dp.id = mr.subject_profile_id
    where (${excludeSelf}::uuid is null or dp.id <> ${excludeSelf}::uuid)
    group by dp.id, dp.handle, dp.display_name, dp.avatar_url, building
    having count(*) >= ${minRatingsToRank}
    order by shrunk desc, n desc, dp.display_name asc
    limit 500
  `)) as unknown as Array<{
    id: string; handle: string; display_name: string;
    avatar_url: string | null; building: string | null;
    n: number; shrunk: number;
  }>;

  return rows.map((r) => ({
    id: r.id, handle: r.handle, displayName: r.display_name,
    avatarUrl: r.avatar_url, building: r.building,
    ratings: r.n, fill: toFill(r.shrunk),
  }));
}

export type Counters = {
  totalRatings: number;
  ratersCount: number;
  totalMembers: number;
};

export async function getCounters(): Promise<Counters> {
  if (!isDbConfigured) return { totalRatings: 0, ratersCount: 0, totalMembers: 0 };
  const db = getDb();
  const [c] = (await db.execute(sql`
    select
      (select count(*)::int from member_ratings) as total_ratings,
      (select count(distinct rater_id)::int from member_ratings) as raters_count,
      (select count(*)::int from directory_profiles) as total_members
  `)) as unknown as Array<{ total_ratings: number; raters_count: number; total_members: number }>;
  return {
    totalRatings: c?.total_ratings ?? 0,
    ratersCount: c?.raters_count ?? 0,
    totalMembers: c?.total_members ?? 0,
  };
}

/** How many members this rater has rated (drives the progressive reveal). */
export async function getRaterRatedCount(raterId: string): Promise<number> {
  if (!isDbConfigured) return 0;
  const db = getDb();
  const [row] = (await db.execute(sql`
    select count(*)::int as cnt from member_ratings where rater_id = ${raterId}
  `)) as unknown as Array<{ cnt: number }>;
  return row?.cnt ?? 0;
}

/** New ratings this rater has created in the last hour (rate-limit check). */
export async function ratingsInLastHour(raterId: string): Promise<number> {
  if (!isDbConfigured) return 0;
  const db = getDb();
  const [row] = (await db.execute(sql`
    select count(*)::int as cnt from member_ratings
    where rater_id = ${raterId} and created_at > now() - interval '1 hour'
  `)) as unknown as Array<{ cnt: number }>;
  return row?.cnt ?? 0;
}
