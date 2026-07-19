import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getPublicHighlights } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/members/public
 *
 * Score-free data for the public /members page: top-vouched members (with a
 * vouch COUNT, never a score), plus live counters. When the kill switch is
 * on, the public page is down: we return { frozen: true } and nothing else.
 *
 * `full` mode (the complete numeric ranked list) is intentionally NOT served
 * here; it stays behind the role-gated dashboard until explicitly enabled.
 */
export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json({
      ok: true,
      mode: "highlights",
      members: [],
      totalRatings: 0,
      membersCovered: 0,
      totalMembers: 0,
    });
  }

  const settings = await getMemberSettings();
  if (settings.ratingsFrozen) {
    return NextResponse.json({ ok: true, frozen: true });
  }

  const highlights = await getPublicHighlights();
  return NextResponse.json({
    ok: true,
    frozen: false,
    mode: settings.publicMode,
    ...highlights,
  });
}
