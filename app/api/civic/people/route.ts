import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import type { CivicPerson } from "@/lib/civic/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" };

/**
 * People, and ONLY those who opted in.
 *
 * This node knows about thousands of people from a scraped directory. None of
 * them are published here. The federated surface is limited to members who
 * took a deliberate public action (saying where they are heading next), which
 * is both the consent signal and the thing worth federating: it lets someone
 * in another city find the people arriving there.
 *
 * If you are implementing this protocol: do not join your full roster here.
 * Consent over completeness is rule 3, and the whole point is that a network
 * of nodes should not become a way to launder a directory into the open.
 */
export async function GET() {
  if (!isDbConfigured) return NextResponse.json({ people: [], total: 0 }, { headers: CORS });

  const db = getDb();
  const rows = (await db.execute(sql`
    select dp.handle, dp.display_name, dp.avatar_url,
           btrim(p.destination) as destination, p.depart_on
    from member_plans p
    join directory_profiles dp on dp.id = p.subject_profile_id
    order by dp.display_name asc
    limit 500
  `)) as unknown as Array<{
    handle: string; display_name: string; avatar_url: string | null;
    destination: string; depart_on: string | null;
  }>;

  const people: CivicPerson[] = rows.map((r) => ({
    handle: r.handle,
    displayName: r.display_name,
    avatarUrl: r.avatar_url,
    nextDestination: r.destination,
    nextOn: r.depart_on,
  }));

  return NextResponse.json({ people, total: people.length }, { headers: CORS });
}
