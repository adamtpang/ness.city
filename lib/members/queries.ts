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

  // Order: people physically here first (you'll actually meet them), then by
  // bucket (core team → long-termers → short-termers), then shuffled within a
  // bucket. Shuffle stands in for a real friend graph until the rating graph
  // exists — friends could be anywhere, so a fresh mix beats a fixed list.
  const rows = (await db.execute(sql`
    select
      dp.id, dp.handle, dp.display_name, dp.avatar_url,
      coalesce(nullif(dp.role, ''), dp.bio) as building
    from directory_profiles dp
    where
      not exists (
        select 1 from member_ratings mr
        where mr.subject_profile_id = dp.id and mr.rater_id = ${rater.id}
      )
      and (${selfId}::uuid is null or dp.id <> ${selfId}::uuid)
    order by
      (dp.on_campus is true) desc,
      case lower(coalesce(dp.member_type, ''))
        when 'core' then 0
        when 'long-term' then 1
        when 'longterm' then 1
        else 2
      end asc,
      random()
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

export type DashboardRow = {
  id: string;
  handle: string;
  displayName: string;
  building: string | null;
  ratings: number;
  raters: number;
  mean: number;
  median: number;
  shrunk: number;
  /** Below the min-ratings threshold: rank is not trustworthy yet. */
  insufficient: boolean;
};

/**
 * Full aggregate table for the core-team dashboard. Every rated member, all
 * columns, no self-hiding and no reveal gate — this is the operator view,
 * role-gated at the route. Ordered by shrunk score.
 */
export async function getDashboardRows(): Promise<DashboardRow[]> {
  if (!isDbConfigured) return [];
  const db = getDb();
  const { priorMean, priorWeight, minRatingsToRank } = MEMBER_CONFIG.score;
  const rows = (await db.execute(sql`
    select
      dp.id, dp.handle, dp.display_name,
      coalesce(nullif(dp.role, ''), dp.bio) as building,
      count(*)::int as n,
      count(distinct mr.rater_id)::int as raters,
      avg(mr.rating)::float8 as mean,
      percentile_cont(0.5) within group (order by mr.rating)::float8 as median,
      (sum(mr.rating)::float8 + ${priorMean}::float8 * ${priorWeight}::float8)
        / (count(*)::float8 + ${priorWeight}::float8) as shrunk
    from member_ratings mr
    join directory_profiles dp on dp.id = mr.subject_profile_id
    group by dp.id, dp.handle, dp.display_name, building
    order by shrunk desc, n desc, dp.display_name asc
  `)) as unknown as Array<{
    id: string; handle: string; display_name: string; building: string | null;
    n: number; raters: number; mean: number; median: number; shrunk: number;
  }>;
  return rows.map((r) => ({
    id: r.id, handle: r.handle, displayName: r.display_name, building: r.building,
    ratings: r.n, raters: r.raters, mean: r.mean, median: r.median, shrunk: r.shrunk,
    insufficient: r.n < minRatingsToRank,
  }));
}

/** Log a core-dashboard load (viewer + timestamp), per the hard rules. */
export async function logDashboardView(viewer: string, path: string): Promise<void> {
  if (!isDbConfigured) return;
  try {
    const db = getDb();
    await db.insert(schema.memberDashboardViews).values({ viewer: viewer.slice(0, 120), path: path.slice(0, 200) });
  } catch { /* logging must never break the dashboard */ }
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

/** How many raters this person has referred in — their invite link's landings.
 * Also feeds the reveal: inviting unlocks more of the index than rating does. */
export async function getInvitesLanded(inviteCode: string | null): Promise<number> {
  if (!isDbConfigured || !inviteCode) return 0;
  const db = getDb();
  const [row] = (await db.execute(sql`
    select count(*)::int as cnt from raters where referred_by = ${inviteCode}
  `)) as unknown as Array<{ cnt: number }>;
  return row?.cnt ?? 0;
}

export type RatingDistribution = { "-2": number; "-1": number; "0": number; "1": number; "2": number };

/** This rater's own spread across the −2…+2 buckets — lets them see whether
 * they're picky or generous. Their own data only; never anyone else's. */
export async function getRaterDistribution(raterId: string): Promise<RatingDistribution> {
  const empty: RatingDistribution = { "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0 };
  if (!isDbConfigured) return empty;
  const db = getDb();
  const rows = (await db.execute(sql`
    select rating, count(*)::int as cnt from member_ratings
    where rater_id = ${raterId} group by rating
  `)) as unknown as Array<{ rating: number; cnt: number }>;
  const out = { ...empty };
  for (const r of rows) {
    const k = String(r.rating) as keyof RatingDistribution;
    if (k in out) out[k] = r.cnt;
  }
  return out;
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

export type PlanPerson = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  departOn: string | null;
  note: string | null;
};

export type Destination = {
  key: string;
  label: string;
  count: number;
  people: PlanPerson[];
};

/**
 * Where everyone is heading, grouped by destination. This is the continuity
 * map: when the campus closes, this is what stops the network dissolving with
 * the venue. Returns only what people volunteered about themselves.
 */
export async function getDestinations(): Promise<{ destinations: Destination[]; total: number }> {
  if (!isDbConfigured) return { destinations: [], total: 0 };
  const db = getDb();
  const rows = (await db.execute(sql`
    select
      lower(btrim(p.destination)) as key,
      min(btrim(p.destination)) as label,
      dp.id, dp.handle, dp.display_name, dp.avatar_url,
      p.depart_on, p.note
    from member_plans p
    join directory_profiles dp on dp.id = p.subject_profile_id
    group by lower(btrim(p.destination)), dp.id, dp.handle, dp.display_name, dp.avatar_url, p.depart_on, p.note
    order by lower(btrim(p.destination)) asc, dp.display_name asc
  `)) as unknown as Array<{
    key: string; label: string; id: string; handle: string;
    display_name: string; avatar_url: string | null;
    depart_on: string | null; note: string | null;
  }>;

  const byKey = new Map<string, Destination>();
  for (const r of rows) {
    let d = byKey.get(r.key);
    if (!d) {
      d = { key: r.key, label: r.label, count: 0, people: [] };
      byKey.set(r.key, d);
    }
    d.count += 1;
    d.people.push({
      id: r.id, handle: r.handle, displayName: r.display_name,
      avatarUrl: r.avatar_url, departOn: r.depart_on, note: r.note,
    });
  }
  const destinations = [...byKey.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return { destinations, total: rows.length };
}

/** Set (or update) where one member is heading next. One current plan each. */
export async function setMemberPlan(input: {
  profileId: string;
  destination: string;
  departOn?: string | null;
  note?: string | null;
}): Promise<void> {
  if (!isDbConfigured) throw new Error("Database not configured");
  const db = getDb();
  await db
    .insert(schema.memberPlans)
    .values({
      subjectProfileId: input.profileId,
      destination: input.destination,
      departOn: input.departOn ?? null,
      note: input.note ?? null,
    })
    .onConflictDoUpdate({
      target: schema.memberPlans.subjectProfileId,
      set: {
        destination: input.destination,
        departOn: input.departOn ?? null,
        note: input.note ?? null,
        updatedAt: new Date(),
      },
    });
}

export type RosterMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
  location: string | null;
  onCampus: boolean | null;
  github: string | null;
  industry: string | null;
  memberType: string | null;
};

export type RosterResult = { members: RosterMember[]; total: number; shown: number };

export type RosterSort = "name" | "newest" | "oncampus" | "github";

/**
 * The open directory — who is in the room. Public facts only (name, what
 * they're building, location, on-campus, github). NEVER exposes any rating
 * score, so browsing the roster can't spoil the gated index. Searchable and
 * sortable by real metrics; capped so we never ship 2.7k rows to the client.
 */
export async function getRoster(opts: {
  sort?: RosterSort;
  q?: string;
  onCampus?: boolean;
  hasGithub?: boolean;
  limit?: number;
} = {}): Promise<RosterResult> {
  if (!isDbConfigured) return { members: [], total: 0, shown: 0 };
  const db = getDb();
  const limit = Math.min(Math.max(opts.limit ?? 150, 1), 500);
  const q = (opts.q ?? "").trim().toLowerCase();
  const like = q ? `%${q}%` : null;

  const where = sql`
    (${like}::text is null or lower(
      coalesce(dp.display_name,'') || ' ' || coalesce(dp.handle,'') || ' ' ||
      coalesce(dp.role,'') || ' ' || coalesce(dp.skills,'') || ' ' ||
      coalesce(dp.industry,'') || ' ' || coalesce(dp.location,'')
    ) like ${like})
    and (${opts.onCampus ? sql`dp.on_campus is true` : sql`true`})
    and (${opts.hasGithub ? sql`(dp.github is not null and dp.github <> '')` : sql`true`})`;

  const order =
    opts.sort === "newest"
      ? sql`dp.joined_at desc nulls last, dp.display_name asc`
      : opts.sort === "oncampus"
        ? sql`dp.on_campus desc nulls last, dp.display_name asc`
        : opts.sort === "github"
          ? sql`(dp.github is not null and dp.github <> '') desc, dp.display_name asc`
          : sql`dp.display_name asc`;

  const rows = (await db.execute(sql`
    select dp.id, dp.handle, dp.display_name, dp.avatar_url,
      nullif(dp.role, '') as building, dp.location,
      dp.on_campus, nullif(dp.github, '') as github, nullif(dp.industry, '') as industry, dp.member_type
    from directory_profiles dp
    where ${where}
    order by ${order}
    limit ${limit}
  `)) as unknown as Array<{
    id: string; handle: string; display_name: string; avatar_url: string | null;
    building: string | null; location: string | null; on_campus: boolean | null;
    github: string | null; industry: string | null; member_type: string | null;
  }>;

  const [{ total }] = (await db.execute(sql`
    select count(*)::int as total from directory_profiles dp where ${where}
  `)) as unknown as Array<{ total: number }>;

  return {
    members: rows.map((r) => ({
      id: r.id, handle: r.handle, displayName: r.display_name, avatarUrl: r.avatar_url,
      building: r.building, location: r.location, onCampus: r.on_campus,
      github: r.github, industry: r.industry, memberType: r.member_type,
    })),
    total: total ?? 0,
    shown: rows.length,
  };
}
