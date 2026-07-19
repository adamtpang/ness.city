import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getMemberSettings } from "@/lib/members/settings";
import { onboardRater, parseRaterIdentity } from "@/lib/members/rater";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/onboard
 * Body: { identity, displayName, building? }
 *
 * Adds the signed-in user to the rateable roster (or updates their card).
 * This is the self-seeding path — no manual directory seeding needed to run
 * a test with your friends.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
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
    return NextResponse.json({ ok: false, error: "Sign in first (missing identity)." }, { status: 401 });
  }

  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  if (!displayName) {
    return NextResponse.json({ ok: false, error: "displayName required" }, { status: 400 });
  }
  const building = typeof body.building === "string" ? body.building : null;

  const profile = await onboardRater(identity, { displayName, building });
  return NextResponse.json({
    ok: true,
    profile: {
      id: profile.id,
      handle: profile.handle,
      displayName: profile.displayName,
      building: profile.role,
    },
  });
}
