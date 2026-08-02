import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import type { CivicProblem } from "@/lib/civic/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" };

/**
 * Open civic problems. Public by design, because townhall is open by design.
 *
 * Federating problems is the most useful part of the protocol: every startup
 * society hits the same things (housing, food, visas, mould, nightlife), and
 * right now each one rediscovers the answer alone. A shared problem surface
 * lets a node in Batam read what a node in Forest City already solved.
 */
export async function GET() {
  if (!isDbConfigured) return NextResponse.json({ problems: [], total: 0 }, { headers: CORS });

  const db = getDb();
  const rows = (await db.execute(sql`
    select slug, title, summary, category, status, affected, upvotes, created_at
    from problems
    order by upvotes desc, created_at desc
    limit 200
  `)) as unknown as Array<{
    slug: string; title: string; summary: string; category: string;
    status: string; affected: number; upvotes: number; created_at: string;
  }>;

  const problems: CivicProblem[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    category: r.category,
    status: r.status,
    affected: r.affected,
    upvotes: r.upvotes,
    url: `https://ness.city/townhall/${r.slug}`,
    createdAt: new Date(r.created_at).toISOString(),
  }));

  return NextResponse.json({ problems, total: problems.length }, { headers: CORS });
}
