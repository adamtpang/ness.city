import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TITLE = 200;
const MAX_TEXT = 6000;
const SLUG_RE = /[^a-z0-9]+/g;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(SLUG_RE, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ALLOWED_CATEGORIES = new Set([
  "operations",
  "social",
  "infra",
  "policy",
  "wellbeing",
  "other",
]);

type CreateBody = {
  title?: unknown;
  summary?: unknown;
  rootCause?: unknown;
  category?: unknown;
  reporterDisplayName?: unknown;
  reporterHandle?: unknown;
  affected?: unknown;
};

function clean(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
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

  const title = clean(body.title, MAX_TITLE);
  if (!title) {
    return NextResponse.json(
      { ok: false, error: "A title is required." },
      { status: 400 },
    );
  }
  // Fewest-clicks filing: only the title is required. Summary and root
  // cause default to the title so a one-liner is a valid problem; the
  // community fleshes out the diagnosis in the thread.
  const summary = clean(body.summary, MAX_TEXT) ?? title;
  const rootCause = clean(body.rootCause, MAX_TEXT) ?? "To be diagnosed by the community.";
  const reporterDisplayName = clean(body.reporterDisplayName, 80) ?? "Anonymous";
  const reporterHandle = clean(body.reporterHandle, 40) ?? "anon";
  const categoryRaw = clean(body.category, 40) ?? "other";
  const category = ALLOWED_CATEGORIES.has(categoryRaw) ? categoryRaw : "other";
  const affected =
    typeof body.affected === "number" && Number.isFinite(body.affected)
      ? Math.max(0, Math.min(100000, Math.round(body.affected)))
      : 0;

  const db = getDb();

  // Resolve or create the citizen by handle
  let citizen = await db.query.citizens.findFirst({
    where: eq(schema.citizens.handle, reporterHandle),
  });
  if (!citizen) {
    const inserted = await db
      .insert(schema.citizens)
      .values({
        handle: reporterHandle,
        displayName: reporterDisplayName,
        avatarSeed: reporterHandle,
      })
      .returning();
    citizen = inserted[0];
  }

  // Slug must be unique. Append a short id if collision.
  let slug = slugify(title);
  if (!slug) slug = "untitled";
  const existing = await db.query.problems.findFirst({
    where: eq(schema.problems.slug, slug),
  });
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const inserted = await db
    .insert(schema.problems)
    .values({
      slug,
      title,
      summary,
      rootCause,
      category: category as
        | "operations"
        | "social"
        | "infra"
        | "policy"
        | "wellbeing"
        | "other",
      reporterId: citizen.id,
      reporterDisplayName: citizen.displayName,
      affected,
    })
    .returning();

  // +5 karma to the reporter for surfacing with a real diagnosis
  await db
    .update(schema.citizens)
    .set({ karma: (citizen.karma ?? 0) + 5 })
    .where(eq(schema.citizens.id, citizen.id));

  return NextResponse.json({
    ok: true,
    problem: inserted[0],
    karmaAwarded: 5,
  });
}
