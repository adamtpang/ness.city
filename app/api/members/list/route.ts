import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getRaterStatus } from "@/lib/members/rater";
import { resolveIdentity } from "@/lib/members/anon";
import { getRateDeck } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/members/list  { identity: { did, email?, displayName?, handle? } }
 *
 * Returns this rater's personalized deck (members they haven't cleared yet,
 * in smart order) plus their progress. POST, not GET, because it is keyed on
 * the caller's identity and is never cacheable. Returns only directory facts
 * — never any member's score.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, members: [], total: 0, ratedByMe: 0 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const ref = typeof b.ref === "string" ? b.ref : null;

  const identity = await resolveIdentity(body);

  const settings = await getMemberSettings();
  const { rater, profile, needsOnboarding } = await getRaterStatus(identity, { ref });
  const deck = await getRateDeck(rater);

  return NextResponse.json({
    ok: true,
    frozen: settings.ratingsFrozen,
    me: {
      needsOnboarding,
      displayName: profile?.displayName ?? identity.displayName ?? "",
      building: profile?.role ?? "",
    },
    ...deck,
  });
}
