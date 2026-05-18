import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen } from "@/lib/api-helpers";
import type {
  ContactKind,
  Listing,
  ListingKind,
} from "@/lib/market";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS: ListingKind[] = [
  "forsale",
  "free",
  "wanted",
  "housing",
  "service",
  "ride",
  "community",
];
const CONTACTS: ContactKind[] = ["whatsapp", "email", "discord", "telegram"];

type Row = typeof schema.marketListings.$inferSelect;

/** DB row -> the Listing shape the /market page already renders. */
function toListing(r: Row): Listing {
  return {
    id: r.id,
    kind: r.kind as ListingKind,
    title: r.title,
    body: r.body,
    priceUsd: r.priceCents == null ? null : Math.round(r.priceCents) / 100,
    rate: r.rate ?? undefined,
    authorName: r.sellerDisplayName,
    authorHandle: r.sellerHandle,
    contactKind: r.contactKind as ContactKind,
    contactValue: r.contactValue,
    postedAt: (r.createdAt instanceof Date
      ? r.createdAt
      : new Date(r.createdAt)
    )
      .toISOString()
      .slice(0, 10),
    status: r.status as Listing["status"],
  };
}

/**
 * GET /api/market?kind=<kind>
 * Returns open listings, newest first. When the DB is empty or
 * unconfigured the client falls back to the static seed in lib/market.ts,
 * so this can safely return an empty array.
 */
export async function GET(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, configured: false, listings: [] });
  }
  const url = new URL(req.url);
  const kindParam = url.searchParams.get("kind");
  const kind =
    kindParam && KINDS.includes(kindParam as ListingKind)
      ? (kindParam as ListingKind)
      : null;

  const db = getDb();
  const where = kind
    ? and(
        eq(schema.marketListings.status, "open"),
        eq(schema.marketListings.kind, kind),
      )
    : eq(schema.marketListings.status, "open");

  const rows = await db
    .select()
    .from(schema.marketListings)
    .where(where)
    .orderBy(desc(schema.marketListings.createdAt))
    .limit(200);

  return NextResponse.json({
    ok: true,
    configured: true,
    listings: rows.map(toListing),
  });
}

/**
 * POST /api/market
 * Body: { kind, title, body, priceUsd?, rate?, sellerHandle,
 *         sellerDisplayName, contactKind, contactValue }
 * Ties the listing to a citizen (identity layer). Expires in 30 days.
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

  const kind = clean(body.kind, 20) as ListingKind | undefined;
  const title = clean(body.title, 140);
  const text = clean(body.body, 1200);
  const handleRaw = clean(body.sellerHandle, 40);
  const displayName = clean(body.sellerDisplayName, 80);
  const contactKind = clean(body.contactKind, 20) as ContactKind | undefined;
  const contactValue = clean(body.contactValue, 160);
  const rate = clean(body.rate, 40);

  if (
    !kind ||
    !KINDS.includes(kind) ||
    !title ||
    !text ||
    !handleRaw ||
    !displayName ||
    !contactKind ||
    !CONTACTS.includes(contactKind) ||
    !contactValue
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "kind, title, body, sellerHandle, sellerDisplayName, contactKind, contactValue are required and must be valid",
      },
      { status: 400 },
    );
  }

  let priceCents: number | null = null;
  if (typeof body.priceUsd === "number" && Number.isFinite(body.priceUsd)) {
    const cents = Math.round(body.priceUsd * 100);
    if (cents >= 0 && cents <= 100_000_000) priceCents = cents;
  }

  const handle = handleRaw.replace(/^@/, "").toLowerCase();
  const db = getDb();
  const citizen = await ensureCitizen({ handle, displayName });

  const expiresAt = new Date(Date.now() + 30 * 86_400_000);

  const inserted = await db
    .insert(schema.marketListings)
    .values({
      kind,
      title,
      body: text,
      priceCents,
      rate: rate ?? null,
      sellerId: citizen.id,
      sellerHandle: handle,
      sellerDisplayName: displayName,
      contactKind,
      contactValue,
      status: "open",
      expiresAt,
    })
    .returning();

  return NextResponse.json({
    ok: true,
    listing: toListing(inserted[0]),
  });
}
