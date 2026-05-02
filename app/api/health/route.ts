import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Tells you whether the backend is alive, which env vars are set, and
 * (if a DB is configured) the row counts for each table.
 *
 * Useful for confirming a fresh deploy before wiring frontend writes.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    GITHUB_FEEDBACK_TOKEN: Boolean(process.env.GITHUB_FEEDBACK_TOKEN),
    DISCORD_FEEDBACK_WEBHOOK: Boolean(process.env.DISCORD_FEEDBACK_WEBHOOK),
  };

  if (!isDbConfigured) {
    return NextResponse.json({
      ok: true,
      db: { configured: false, reachable: false, counts: null },
      env,
      hint:
        "Provision Vercel Postgres in the project Storage tab, then redeploy. The frontend will keep working from local data until then.",
    });
  }

  try {
    const db = getDb();
    const tables = [
      "problems",
      "citizens",
      "bounties",
      "pledges",
      "pagerank_rings",
      "feedback",
    ] as const;

    const counts: Record<string, number> = {};
    for (const t of tables) {
      const rows = (await db.execute(
        sql.raw(`select count(*)::int as count from "${t}"`),
      )) as unknown as Array<{ count?: number }>;
      counts[t] = rows[0]?.count ?? 0;
    }

    return NextResponse.json({
      ok: true,
      db: {
        configured: true,
        reachable: true,
        counts,
      },
      env,
      schema: Object.keys(schema),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        db: {
          configured: true,
          reachable: false,
          error: err instanceof Error ? err.message : "unknown",
        },
        env,
        hint:
          "DATABASE_URL is set but the connection failed. Check the env var, or run `npm run db:push` to create the schema.",
      },
      { status: 500 },
    );
  }
}
