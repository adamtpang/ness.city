import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { MEMBER_CONFIG, SCALE_MIN, SCALE_MAX } from "@/lib/members/config";
import { getMemberSettings } from "@/lib/members/settings";
import { ensureRater, parseRaterIdentity } from "@/lib/members/rater";
import { ratingsInLastHour } from "@/lib/members/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/rate
 * Body: { identity: { did, email?, displayName?, handle? },
 *         subjectProfileId: string, rating: -2..2 }
 *
 * One upserted row per (rater, subject) pair. `rating` is the whole signal.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  // Kill switch.
  const settings = await getMemberSettings();
  if (settings.ratingsFrozen) {
    return NextResponse.json({ ok: false, frozen: true, error: "Ratings are frozen." }, { status: 423 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const identity = parseRaterIdentity(body);
  if (!identity) {
    return NextResponse.json({ ok: false, error: "Sign in to rate (missing identity)." }, { status: 401 });
  }

  const subjectProfileId = typeof body.subjectProfileId === "string" ? body.subjectProfileId : null;
  if (!subjectProfileId) {
    return NextResponse.json({ ok: false, error: "subjectProfileId required" }, { status: 400 });
  }

  const ratingRaw = body.rating;
  const rating =
    typeof ratingRaw === "number" && Number.isFinite(ratingRaw) ? Math.round(ratingRaw) : NaN;
  if (!(rating >= SCALE_MIN && rating <= SCALE_MAX)) {
    return NextResponse.json(
      { ok: false, error: `rating must be an integer ${SCALE_MIN}..${SCALE_MAX}` },
      { status: 400 },
    );
  }

  const db = getDb();
  const rater = await ensureRater(identity);

  if (rater.subjectProfileId && rater.subjectProfileId === subjectProfileId) {
    return NextResponse.json({ ok: false, error: "You can't rate yourself." }, { status: 400 });
  }

  // Only newly created pairs count against the anti-bulk-dump limit.
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
        { ok: false, error: "rate_limited", message: "You've rated a lot in the last hour. Come back soon." },
        { status: 429 },
      );
    }
  }

  try {
    await db
      .insert(schema.memberRatings)
      .values({ raterId: rater.id, subjectProfileId, rating })
      .onConflictDoUpdate({
        target: [schema.memberRatings.raterId, schema.memberRatings.subjectProfileId],
        set: { rating, updatedAt: new Date() },
      });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return NextResponse.json({ ok: false, error: "Unknown member." }, { status: 404 });
    }
    throw err;
  }

  await db.update(schema.raters).set({ lastRatedAt: new Date() }).where(eq(schema.raters.id, rater.id));

  return NextResponse.json({ ok: true });
}
