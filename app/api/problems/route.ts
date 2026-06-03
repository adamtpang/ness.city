import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { createProblem } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  title?: unknown;
  summary?: unknown;
  rootCause?: unknown;
  category?: unknown;
  reporterDisplayName?: unknown;
  reporterHandle?: unknown;
  affected?: unknown;
};

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, configured: false, problems: [] },
      { status: 200 },
    );
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.problems)
    .orderBy(desc(schema.problems.createdAt))
    .limit(50);
  return NextResponse.json({ ok: true, configured: true, problems: rows });
}

export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Database not configured. Provision Vercel Postgres in project Storage and redeploy.",
      },
      { status: 503 },
    );
  }

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (!str(body.title)?.trim()) {
    return NextResponse.json(
      { ok: false, error: "A title is required." },
      { status: 400 },
    );
  }

  try {
    const { problem, karmaAwarded } = await createProblem({
      title: str(body.title) ?? "",
      summary: str(body.summary),
      rootCause: str(body.rootCause),
      category: str(body.category),
      reporterDisplayName: str(body.reporterDisplayName),
      reporterHandle: str(body.reporterHandle),
      affected:
        typeof body.affected === "number" ? body.affected : undefined,
    });
    return NextResponse.json({ ok: true, problem, karmaAwarded });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Could not file" },
      { status: 400 },
    );
  }
}
