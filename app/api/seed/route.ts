import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/seed?token=<AGENT_API_TOKEN>[&force=1]
 *
 * One-shot demo seeder. Populates citizens (patrons + fixers), a spread of
 * realistic NS problems with varied importance, a couple of proposals, and
 * two funded bounties so the board, the leaderboards, and the Bounty value
 * KPI all look alive. Token-gated (reuses AGENT_API_TOKEN). Skips if the
 * board already has problems unless you pass force=1.
 */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type CitizenSeed = {
  handle: string;
  displayName: string;
  karma?: number;
  patronageCents?: number;
};

const CITIZENS: CitizenSeed[] = [
  { handle: "maya", displayName: "Maya", patronageCents: 25000 },
  { handle: "ari", displayName: "Ari", patronageCents: 20000 },
  { handle: "devon", displayName: "Devon", patronageCents: 15000 },
  { handle: "sol", displayName: "Sol", karma: 45 },
  { handle: "jin", displayName: "Jin", karma: 30 },
  { handle: "remy", displayName: "Remy", karma: 20 },
];

type ProblemSeed = {
  title: string;
  summary: string;
  category: "operations" | "social" | "infra" | "policy" | "wellbeing" | "other";
  upvotes: number;
  reporterHandle: string;
  reporterDisplayName: string;
};

const PROBLEMS: ProblemSeed[] = [
  { title: "Gym is overcrowded at 6pm", summary: "Everyone trains right after the workday, so the rack queue is 20 minutes. People skip sessions.", category: "wellbeing", upvotes: 34, reporterHandle: "anon", reporterDisplayName: "Anonymous" },
  { title: "No quiet room for deep work", summary: "The coworking floor is social by design, but there is nowhere to take a focused 2-hour block.", category: "infra", upvotes: 28, reporterHandle: "jin", reporterDisplayName: "Jin" },
  { title: "Visa run logistics are confusing for newcomers", summary: "New arrivals miss the JB run because the steps, timing, and what to bring are scattered.", category: "operations", upvotes: 22, reporterHandle: "anon", reporterDisplayName: "Anonymous" },
  { title: "Coworking wifi drops during calls", summary: "Video calls cut out in the afternoon. Likely an AP coverage or load issue in the east wing.", category: "infra", upvotes: 19, reporterHandle: "remy", reporterDisplayName: "Remy" },
  { title: "Hard to find people to train with", summary: "Lots of people want a lifting or running partner at the same times but have no way to match.", category: "social", upvotes: 14, reporterHandle: "anon", reporterDisplayName: "Anonymous" },
  { title: "Coffee runs out by 10am", summary: "The morning urn is empty before the late risers arrive, and nobody owns the refill.", category: "operations", upvotes: 11, reporterHandle: "sol", reporterDisplayName: "Sol" },
  { title: "No clear onboarding for new arrivals", summary: "Week-one people do not know the channels, the schedule, or who to ask. They lose the first days.", category: "social", upvotes: 9, reporterHandle: "anon", reporterDisplayName: "Anonymous" },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const expected = process.env.AGENT_API_TOKEN ?? "";
  if (!expected || token !== expected) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass ?token=<AGENT_API_TOKEN>." },
      { status: 401 },
    );
  }
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured. Add DATABASE_URL in Vercel and redeploy." },
      { status: 503 },
    );
  }

  const force = url.searchParams.get("force") === "1";
  const db = getDb();

  const existing = await db.select({ id: schema.problems.id }).from(schema.problems).limit(1);
  if (existing.length > 0 && !force) {
    return NextResponse.json({
      ok: true,
      already: true,
      note: "Board already has problems. Add &force=1 to seed anyway.",
    });
  }

  // Citizens (upsert by handle so re-seeding is safe).
  const idByHandle = new Map<string, string>();
  for (const c of CITIZENS) {
    const [row] = await db
      .insert(schema.citizens)
      .values({
        handle: c.handle,
        displayName: c.displayName,
        avatarSeed: c.handle,
        karma: c.karma ?? 0,
        patronageCents: c.patronageCents ?? 0,
      })
      .onConflictDoUpdate({
        target: schema.citizens.handle,
        set: { karma: c.karma ?? 0, patronageCents: c.patronageCents ?? 0 },
      })
      .returning();
    idByHandle.set(c.handle, row.id);
  }

  // Problems.
  const problemIdByTitle = new Map<string, string>();
  for (const p of PROBLEMS) {
    const slug = `${slugify(p.title)}-${Math.random().toString(36).slice(2, 5)}`;
    const reporterId = idByHandle.get(p.reporterHandle) ?? null;
    const [row] = await db
      .insert(schema.problems)
      .values({
        slug,
        title: p.title,
        summary: p.summary,
        rootCause: "To be diagnosed by the community.",
        category: p.category,
        status: "open",
        reporterId,
        reporterDisplayName: p.reporterDisplayName,
        affected: Math.round(p.upvotes * 1.5),
        upvotes: p.upvotes,
      })
      .returning();
    problemIdByTitle.set(p.title, row.id);
  }

  // A couple of proposals.
  const quietRoom = problemIdByTitle.get("No quiet room for deep work");
  const gym = problemIdByTitle.get("Gym is overcrowded at 6pm");
  if (quietRoom) {
    await db.insert(schema.proposals).values({
      problemId: quietRoom,
      authorId: idByHandle.get("jin") ?? null,
      authorDisplayName: "Jin",
      summary: "Convert the east corner into a phones-off quiet zone",
      body: "Reserve the east corner, add a phones-off rule and a simple booking sheet for 2-hour blocks. Low cost, reversible, test for two weeks.",
    });
  }
  if (gym) {
    await db.insert(schema.proposals).values({
      problemId: gym,
      authorId: idByHandle.get("sol") ?? null,
      authorDisplayName: "Sol",
      summary: "Add a second 6 to 8pm coach-led slot plus rack booking",
      body: "Open a second evening block and a 20-minute rack booking system so the 6pm crush spreads out across two slots.",
    });
  }

  // Two funded bounties so the Bounty value KPI is real.
  let bountyValueCents = 0;
  if (quietRoom) {
    const [b] = await db
      .insert(schema.bounties)
      .values({ problemId: quietRoom, goalCents: 50000, state: "collecting" })
      .onConflictDoNothing()
      .returning();
    if (b) {
      await db.insert(schema.pledges).values([
        { bountyId: b.id, patronId: idByHandle.get("maya") ?? null, patronDisplayName: "Maya", amountCents: 25000, note: "Would use this daily." },
        { bountyId: b.id, patronId: idByHandle.get("devon") ?? null, patronDisplayName: "Devon", amountCents: 15000, note: null },
      ]);
      bountyValueCents += 40000;
    }
  }
  if (gym) {
    const [b] = await db
      .insert(schema.bounties)
      .values({ problemId: gym, goalCents: 30000, state: "collecting" })
      .onConflictDoNothing()
      .returning();
    if (b) {
      await db.insert(schema.pledges).values([
        { bountyId: b.id, patronId: idByHandle.get("ari") ?? null, patronDisplayName: "Ari", amountCents: 20000, note: "Skipping sessions over this." },
      ]);
      bountyValueCents += 20000;
    }
  }

  return NextResponse.json({
    ok: true,
    seeded: {
      citizens: CITIZENS.length,
      problems: PROBLEMS.length,
      bountyValueUsd: bountyValueCents / 100,
    },
  });
}
