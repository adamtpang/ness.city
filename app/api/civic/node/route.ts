import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { CIVIC_VERSION, NESS_MANIFEST, type CivicNodeStats } from "@/lib/civic/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" };

/**
 * This node's public vital signs. Aggregate counts only, never a list.
 *
 * A registry can poll this across every node to render the state of the
 * movement with real numbers, which is the gap in existing startup-society
 * directories: they list who exists, not how anyone is actually doing.
 *
 * `known` and `listed` are deliberately separate. Publishing a roster size
 * is not the same as publishing a roster, and only `listed` people (those
 * who opted in) ever appear at /api/civic/people.
 */
export async function GET() {
  const empty: CivicNodeStats = { known: 0, listed: 0, problems: 0, destinations: 0 };
  if (!isDbConfigured) {
    return NextResponse.json({ ...NESS_MANIFEST.node, version: CIVIC_VERSION, stats: empty }, { headers: CORS });
  }

  const db = getDb();
  const [row] = (await db.execute(sql`
    select
      (select count(*)::int from directory_profiles) as known,
      (select count(*)::int from member_plans) as listed,
      (select count(*)::int from problems where status <> 'solved') as problems,
      (select count(distinct lower(btrim(destination)))::int from member_plans) as destinations
  `)) as unknown as Array<CivicNodeStats>;

  const stats: CivicNodeStats = {
    known: row?.known ?? 0,
    listed: row?.listed ?? 0,
    problems: row?.problems ?? 0,
    destinations: row?.destinations ?? 0,
  };

  return NextResponse.json(
    { ...NESS_MANIFEST.node, version: CIVIC_VERSION, stats },
    { headers: CORS },
  );
}
