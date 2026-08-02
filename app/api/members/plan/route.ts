import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getDestinations, setMemberPlan } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where next. GET returns the continuity map (who is heading where), POST
 * records one person's next destination.
 *
 * This is public on purpose, and it is the one place that is: it only ever
 * contains what someone volunteered about their own next move, and it is
 * useless unless people can actually see who else is going their way. No
 * scraped data is exposed here.
 */
export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, destinations: [], total: 0 });
  }
  const map = await getDestinations();
  return NextResponse.json({ ok: true, ...map });
}

export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  const settings = await getMemberSettings();
  if (settings.ratingsFrozen) {
    return NextResponse.json({ ok: false, frozen: true, error: "Paused." }, { status: 423 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const profileId = typeof body.profileId === "string" ? body.profileId : "";
  const destination = typeof body.destination === "string" ? body.destination.trim().slice(0, 80) : "";
  if (!profileId) {
    return NextResponse.json({ ok: false, error: "Pick who you are first." }, { status: 400 });
  }
  if (!destination) {
    return NextResponse.json({ ok: false, error: "Where are you heading?" }, { status: 400 });
  }

  const departOn = typeof body.departOn === "string" ? body.departOn.trim().slice(0, 40) || null : null;
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 140) || null : null;

  try {
    await setMemberPlan({ profileId, destination, departOn, note });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return NextResponse.json({ ok: false, error: "Unknown member." }, { status: 404 });
    }
    throw err;
  }

  const map = await getDestinations();
  return NextResponse.json({ ok: true, ...map });
}
