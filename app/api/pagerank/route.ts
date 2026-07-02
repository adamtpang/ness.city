import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen, intInRange } from "@/lib/api-helpers";
import { pagerank } from "@/lib/pagerank";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pagerank. Submit a citizen's ring (one or more named edges).
 * { citizenHandle, citizenDisplayName, names: [{ name, round }] }
 *
 * GET /api/pagerank. Return the most-named citizens, ordered by inbound count.
 *   Real PageRank iteration runs once we have enough rings to be worth it
 *   (>= 5 citizens). Until then the leaderboard ranks by raw inbound mentions
 *   weighted by ring round (Round 1 = 6, ... Round 6 = 1).
 */

const ROUND_WEIGHTS = [0, 6, 5, 4, 3, 2, 1]; // index by round

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const handle = clean(body.citizenHandle, 40);
  const displayName = clean(body.citizenDisplayName, 80);
  const names = Array.isArray(body.names) ? body.names : null;

  if (!handle || !displayName || !names || names.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "citizenHandle, citizenDisplayName, names[] required",
      },
      { status: 400 },
    );
  }

  const db = getDb();
  const citizen = await ensureCitizen({ handle, displayName });

  // Replace existing ring (idempotent submit)
  await db
    .delete(schema.pagerankRings)
    .where(eq(schema.pagerankRings.citizenId, citizen.id));

  const rows: { citizenId: string; namedHandle: string; round: number }[] = [];
  for (const item of names) {
    if (typeof item !== "object" || !item) continue;
    const i = item as { name?: unknown; round?: unknown };
    const namedHandle = clean(i.name, 80);
    const round = intInRange(i.round, 1, 6);
    if (!namedHandle || round === null) continue;
    rows.push({ citizenId: citizen.id, namedHandle, round });
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no valid rows in names[]" },
      { status: 400 },
    );
  }

  await db.insert(schema.pagerankRings).values(rows);

  return NextResponse.json({
    ok: true,
    citizenId: citizen.id,
    submitted: rows.length,
  });
}

export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, configured: false, leaderboard: [] },
      { status: 200 },
    );
  }
  const db = getDb();

  // Weighted inbound mentions per named_handle. This is the fallback ranking
  // when the graph is too thin for PageRank, and the source of the
  // mentions/namers counts shown in the UI.
  const weighted = (await db.execute(
    sql.raw(`
      select
        lower(named_handle) as named_handle,
        sum(case round
          when 1 then 6 when 2 then 5 when 3 then 4
          when 4 then 3 when 5 then 2 else 1
        end)::int as score,
        count(*)::int as mentions,
        count(distinct citizen_id)::int as namers
      from pagerank_rings
      group by lower(named_handle)
      order by score desc, mentions desc
      limit 50
    `),
  )) as unknown as Array<{
    named_handle: string;
    score: number;
    mentions: number;
    namers: number;
  }>;

  // Full edge list (namer handle -> named handle) for real PageRank. We join
  // through citizens so the edge source is a real handle, not a row id.
  const edgeRows = (await db.execute(
    sql.raw(`
      select c.handle as namer, lower(r.named_handle) as named, r.round as round
      from pagerank_rings r
      join citizens c on c.id = r.citizen_id
    `),
  )) as unknown as Array<{ namer: string; named: string; round: number }>;

  const distinctNamers = new Set(edgeRows.map((e) => e.namer.toLowerCase())).size;

  // Fulfil the page's promise: below a handful of namers the graph is just a few
  // overlapping stars, so we rank by weighted mentions. Past the threshold, real
  // PageRank dynamics emerge (importance flowing A -> B -> C) and we switch.
  const PAGERANK_MIN_NAMERS = 5;

  let leaderboard = weighted;
  let mode: "mentions" | "pagerank" = "mentions";

  if (distinctNamers >= PAGERANK_MIN_NAMERS && edgeRows.length > 0) {
    const edges = edgeRows.map((e) => ({
      from: e.namer.toLowerCase(),
      to: e.named,
      weight: ROUND_WEIGHTS[e.round] ?? 1,
    }));
    const named = new Set(edges.map((e) => e.to));
    const ranked = pagerank(edges, { damping: 0.85 }).filter((r) => named.has(r.node));
    const maxScore = ranked[0]?.score ?? 1;
    const counts = new Map(weighted.map((w) => [w.named_handle, w]));
    leaderboard = ranked.slice(0, 50).map((r) => {
      const c = counts.get(r.node);
      return {
        named_handle: r.node,
        score: Math.round((r.score / maxScore) * 100), // 0..100, top = 100
        mentions: c?.mentions ?? 0,
        namers: c?.namers ?? 0,
      };
    });
    mode = "pagerank";
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    mode,
    namers: distinctNamers,
    leaderboard,
    weights: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 },
  });
}
