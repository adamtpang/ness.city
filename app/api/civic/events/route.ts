import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { listGatherings } from "@/lib/gatherings";
import type { CivicEvent } from "@/lib/civic/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" };

/**
 * Events, from ness.city's own /events board. Public by design, same as
 * problems: knowing what's happening and where is exactly the kind of thing
 * a scattering or migrating community needs from another node.
 */
export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json({ events: [], total: 0, implemented: true }, { headers: CORS });
  }
  const rows = await listGatherings("event");
  const events: CivicEvent[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    startsAt: e.startsAt,
    place: e.place,
    url: "https://ness.city/events",
  }));
  return NextResponse.json({ events, total: events.length, implemented: true }, { headers: CORS });
}
