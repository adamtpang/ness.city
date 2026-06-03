import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/feedback  { rating (1-5), message?, page? }
 * On-site feedback. Writes to the feedback table. No GitHub round-trip -
 * lowest-friction way for a member to tell us how it's going.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }
  let body: {
    rating?: unknown;
    message?: unknown;
    page?: unknown;
    meta?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const rating =
    typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
      ? Math.round(body.rating)
      : null;
  if (rating === null) {
    return NextResponse.json(
      { ok: false, error: "rating (1-5) required" },
      { status: 400 },
    );
  }
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 2000) : null;
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : null;
  // Optional per-track sub-ratings (learn/earn/burn/fun), stored in meta.
  let meta: Record<string, number> | null = null;
  if (body.meta && typeof body.meta === "object") {
    const m: Record<string, number> = {};
    for (const k of ["learn", "earn", "burn", "fun"]) {
      const v = (body.meta as Record<string, unknown>)[k];
      if (typeof v === "number" && v >= 0 && v <= 5) m[k] = Math.round(v);
    }
    if (Object.keys(m).length) meta = m;
  }

  const db = getDb();
  await db.insert(schema.feedback).values({ rating, message, page, meta });
  return NextResponse.json({ ok: true });
}
