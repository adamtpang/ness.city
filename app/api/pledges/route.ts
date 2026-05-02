import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { clean, ensureCitizen, intInRange } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pledges
 * { bountyId, amountUsd, note?, patronDisplayName, patronHandle, txHash? }
 *
 * Records a USDC pledge against a bounty. Increments patronage on the
 * citizen and (if total >= goal) flips bounty state to "funded".
 */
export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const bountyId = clean(body.bountyId, 100);
  const amountUsd = intInRange(body.amountUsd, 1, 50_000);
  const note = clean(body.note, 280);
  const patronDisplayName = clean(body.patronDisplayName, 80) ?? "Anonymous";
  const patronHandle = clean(body.patronHandle, 40) ?? "anon";
  const txHash = clean(body.txHash, 200);

  if (!bountyId || amountUsd === null) {
    return NextResponse.json(
      { ok: false, error: "bountyId, amountUsd (1-50000) required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const bounty = await db.query.bounties.findFirst({
    where: eq(schema.bounties.id, bountyId),
  });
  if (!bounty) {
    return NextResponse.json({ ok: false, error: "bounty not found" }, { status: 404 });
  }
  if (bounty.state === "paid") {
    return NextResponse.json(
      { ok: false, error: "bounty already paid out" },
      { status: 409 },
    );
  }

  const patron = await ensureCitizen({
    handle: patronHandle,
    displayName: patronDisplayName,
  });
  const amountCents = amountUsd * 100;

  const inserted = await db
    .insert(schema.pledges)
    .values({
      bountyId: bounty.id,
      patronId: patron.id,
      patronDisplayName: patron.displayName,
      amountCents,
      note: note ?? null,
      txHash: txHash ?? null,
    })
    .returning();

  // Update patronage on the citizen
  await db
    .update(schema.citizens)
    .set({ patronageCents: (patron.patronageCents ?? 0) + amountCents })
    .where(eq(schema.citizens.id, patron.id));

  // If total now meets/exceeds goal, mark bounty funded
  const totalRow = (await db.execute(
    sql.raw(
      `select coalesce(sum(amount_cents), 0)::int as total from pledges where bounty_id = '${bounty.id}'`,
    ),
  )) as unknown as Array<{ total: number }>;
  const total = totalRow[0]?.total ?? 0;

  let nextState = bounty.state;
  if (total >= bounty.goalCents && bounty.state === "collecting") {
    nextState = "funded";
    await db
      .update(schema.bounties)
      .set({ state: "funded" })
      .where(eq(schema.bounties.id, bounty.id));
  }

  return NextResponse.json({
    ok: true,
    pledge: inserted[0],
    bountyState: nextState,
    totalCents: total,
    goalCents: bounty.goalCents,
  });
}
