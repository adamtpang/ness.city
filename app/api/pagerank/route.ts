import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen, intInRange } from "@/lib/api-helpers";

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

  // Quick aggregation: weighted inbound mentions per named_handle.
  // For real PageRank we'd resolve named_handle -> citizen and iterate.
  const weighted = (await db.execute(
    sql.raw(`
      select
        named_handle,
        sum(case round
          when 1 then 6
          when 2 then 5
          when 3 then 4
          when 4 then 3
          when 5 then 2
          else 1
        end)::int as score,
        count(*)::int as mentions,
        count(distinct citizen_id)::int as namers
      from pagerank_rings
      group by named_handle
      order by score desc, mentions desc
      limit 50
    `),
  )) as unknown as Array<{
    named_handle: string;
    score: number;
    mentions: number;
    namers: number;
  }>;

  return NextResponse.json({
    ok: true,
    configured: true,
    leaderboard: weighted,
    weights: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 },
  });
}
