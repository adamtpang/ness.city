import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/market/sold
 * Body: { id, sellerHandle }
 *
 * Marks a listing as claimed (drops it from the open feed). Requires the
 * caller's handle to match the listing's sellerHandle — same community-
 * trust model as listing creation. Not real auth; trivial to spoof, but
 * the social cost of impersonating someone's mark-sold is high enough
 * for this scale.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const id = clean(body.id, 64);
  const sellerHandle = clean(body.sellerHandle, 40)
    ?.replace(/^@/, "")
    .toLowerCase();

  if (!id || !sellerHandle) {
    return NextResponse.json(
      { ok: false, error: "id and sellerHandle required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const updated = await db
    .update(schema.marketListings)
    .set({ status: "claimed" })
    .where(
      and(
        eq(schema.marketListings.id, id),
        eq(schema.marketListings.sellerHandle, sellerHandle),
        eq(schema.marketListings.status, "open"),
      ),
    )
    .returning({ id: schema.marketListings.id });

  if (updated.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Not found or handle mismatch" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
