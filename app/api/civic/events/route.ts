import { NextResponse } from "next/server";
import type { CivicEvent } from "@/lib/civic/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" };

/**
 * Events. The shape is fixed and the endpoint is live so other nodes and
 * registries can implement against a stable contract today; this node returns
 * an empty set until its events board ships.
 *
 * Declared rather than omitted on purpose: a protocol whose endpoints appear
 * one at a time is not something anyone can build against.
 */
export async function GET() {
  const events: CivicEvent[] = [];
  return NextResponse.json({ events, total: events.length, implemented: false }, { headers: CORS });
}
