import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { createGathering, type GatheringKind } from "@/lib/gatherings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/gatherings
 * Body: { kind: "event"|"meal", title, body?, place?, startsAt, hostDisplayName?, hostHandle? }
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "The board is not connected to a database yet." }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const kind = payload.kind === "meal" ? "meal" : payload.kind === "event" ? "event" : null;
  if (!kind) {
    return NextResponse.json({ ok: false, error: "kind must be 'event' or 'meal'" }, { status: 400 });
  }

  try {
    const gathering = await createGathering({
      kind: kind as GatheringKind,
      title: typeof payload.title === "string" ? payload.title : undefined,
      body: typeof payload.body === "string" ? payload.body : undefined,
      place: typeof payload.place === "string" ? payload.place : undefined,
      startsAt: typeof payload.startsAt === "string" ? payload.startsAt : undefined,
      hostDisplayName: typeof payload.hostDisplayName === "string" ? payload.hostDisplayName : undefined,
      hostHandle: typeof payload.hostHandle === "string" ? payload.hostHandle : undefined,
    });
    return NextResponse.json({ ok: true, gathering });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not post that.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
