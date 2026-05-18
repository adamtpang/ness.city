import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/market/photo?id=<listing-uuid>
 *
 * Streams the one listing photo. Photos live as data URLs in the DB and
 * are deliberately kept out of the list endpoint so the feed stays light;
 * cards lazy-load each image here. Immutable cache: a listing's photo
 * never changes (edit = new listing).
 */
export async function GET(req: Request) {
  if (!isDbConfigured) {
    return new NextResponse(null, { status: 404 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new NextResponse(null, { status: 400 });

  const db = getDb();
  const rows = await db
    .select({ photoData: schema.marketListings.photoData })
    .from(schema.marketListings)
    .where(eq(schema.marketListings.id, id))
    .limit(1);

  const data = rows[0]?.photoData;
  if (!data || !data.startsWith("data:")) {
    return new NextResponse(null, { status: 404 });
  }

  // data:image/jpeg;base64,XXXX  ->  (mime, bytes)
  const match = data.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!match) return new NextResponse(null, { status: 404 });

  const mime = match[1];
  const buf = Buffer.from(match[2], "base64");

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
