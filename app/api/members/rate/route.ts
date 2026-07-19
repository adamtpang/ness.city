import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { MEMBER_CONFIG } from "@/lib/members/config";
import { getMemberSettings } from "@/lib/members/settings";
import { ensureRater, parseRaterIdentity } from "@/lib/members/rater";
import { ratingsInLastHour } from "@/lib/members/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/rate
 *
 * Body: {
 *   identity: { did, email?, displayName?, handle? },
 *   subjectProfileId: string,
 *   integrity?: 1..5 | null,
 *   curiosity?: 1..5 | null,
 *   creativity?: 1..5 | null,
 *   vouch?: "yes" | "no" | "not_sure" | null,
 *   note?: string
 * }
 *
 * One upserted row per (rater, subject) pair. Each dimension is optional;
 * omitting or nulling it means "haven't interacted enough". The rating
 * feeds aggregates only when at least MEMBER_CONFIG.minAnsweredToCount
 * dimensions carry a real answer.
 */
function score(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const n = Math.round(value);
  return n >= 1 && n <= 5 ? n : null;
}

function vouch(value: unknown): "yes" | "no" | "not_sure" | null {
  return value === "yes" || value === "no" || value === "not_sure" ? value : null;
}

export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }

  // Kill switch: freeze all writes.
  const settings = await getMemberSettings();
  if (settings.ratingsFrozen) {
    return NextResponse.json(
      { ok: false, frozen: true, error: "Ratings are frozen." },
      { status: 423 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const identity = parseRaterIdentity(body);
  if (!identity) {
    return NextResponse.json(
      { ok: false, error: "Sign in to rate (missing identity)." },
      { status: 401 },
    );
  }

  const subjectProfileId =
    typeof body.subjectProfileId === "string" ? body.subjectProfileId : null;
  if (!subjectProfileId) {
    return NextResponse.json(
      { ok: false, error: "subjectProfileId required" },
      { status: 400 },
    );
  }

  const integrity = score(body.integrity);
  const curiosity = score(body.curiosity);
  const creativity = score(body.creativity);
  const v = vouch(body.vouch);
  const noteRaw = typeof body.note === "string" ? body.note.trim().slice(0, 600) : "";

  const answeredCount =
    (integrity !== null ? 1 : 0) +
    (curiosity !== null ? 1 : 0) +
    (creativity !== null ? 1 : 0) +
    (v !== null ? 1 : 0);
  const counted = answeredCount >= MEMBER_CONFIG.minAnsweredToCount;

  // Any 1–2 score requires a one-line note.
  const hasLow = [integrity, curiosity, creativity].some(
    (s) => s !== null && s <= MEMBER_CONFIG.lowScoreThreshold,
  );
  if (hasLow && !noteRaw) {
    return NextResponse.json(
      {
        ok: false,
        error: "note_required",
        message: "A score of 1 or 2 needs a one-line note.",
      },
      { status: 400 },
    );
  }

  const db = getDb();
  const rater = await ensureRater(identity);

  // Can't rate yourself.
  if (rater.subjectProfileId && rater.subjectProfileId === subjectProfileId) {
    return NextResponse.json(
      { ok: false, error: "You can't rate yourself." },
      { status: 400 },
    );
  }

  // Does a rating for this pair already exist? Updates don't count against
  // the anti-bulk-dump limit; only newly created pairs do.
  const existing = await db
    .select({ id: schema.memberRatings.id })
    .from(schema.memberRatings)
    .where(
      and(
        eq(schema.memberRatings.raterId, rater.id),
        eq(schema.memberRatings.subjectProfileId, subjectProfileId),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    const recent = await ratingsInLastHour(rater.id);
    if (recent >= MEMBER_CONFIG.rateLimitPerHour) {
      return NextResponse.json(
        {
          ok: false,
          error: "rate_limited",
          message: "You've rated a lot in the last hour. Take a breath and come back soon.",
        },
        { status: 429 },
      );
    }
  }

  const note = noteRaw || null;

  try {
    await db
      .insert(schema.memberRatings)
      .values({
        raterId: rater.id,
        subjectProfileId,
        integrity,
        curiosity,
        creativity,
        vouch: v,
        note,
        answeredCount,
        counted,
      })
      .onConflictDoUpdate({
        target: [
          schema.memberRatings.raterId,
          schema.memberRatings.subjectProfileId,
        ],
        set: {
          integrity,
          curiosity,
          creativity,
          vouch: v,
          note,
          answeredCount,
          counted,
          updatedAt: new Date(),
        },
      });
  } catch (err) {
    // Most likely an invalid subjectProfileId (FK violation).
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return NextResponse.json(
        { ok: false, error: "Unknown member." },
        { status: 404 },
      );
    }
    throw err;
  }

  await db
    .update(schema.raters)
    .set({ lastRatedAt: new Date() })
    .where(eq(schema.raters.id, rater.id));

  return NextResponse.json({ ok: true, counted, answeredCount });
}
