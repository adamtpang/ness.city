import { and, eq, gte, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/**
 * Gatherings: events + food, native to ness.city. One table, one kind
 * (event | meal), so a community's day-to-day doesn't depend on any one
 * campus's own site. Anyone can post; same lightweight identity as problems
 * and market (typed handle, no login).
 */

export type GatheringKind = "event" | "meal";

export type Gathering = {
  id: string;
  kind: GatheringKind;
  title: string;
  body: string | null;
  place: string | null;
  startsAt: string;
  hostHandle: string;
  hostDisplayName: string;
  createdAt: string;
};

export type CreateGatheringInput = {
  kind: GatheringKind;
  title?: string;
  body?: string;
  place?: string;
  startsAt?: string; // ISO
  hostDisplayName?: string;
  hostHandle?: string;
};

// Meals fall off the board fast (today's dinner shouldn't linger); events
// stay up long enough to be planned around.
const EXPIRY_HOURS: Record<GatheringKind, number> = { meal: 30, event: 24 * 21 };

function toRow(r: typeof schema.gatherings.$inferSelect): Gathering {
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    body: r.body,
    place: r.place,
    startsAt: r.startsAt.toISOString(),
    hostHandle: r.hostHandle,
    hostDisplayName: r.hostDisplayName,
    createdAt: r.createdAt.toISOString(),
  };
}

/** Upcoming, unexpired gatherings of one kind, soonest first. */
export async function listGatherings(kind: GatheringKind): Promise<Gathering[]> {
  if (!isDbConfigured) return [];
  const db = getDb();
  const rows = await db.query.gatherings.findMany({
    where: and(
      eq(schema.gatherings.kind, kind),
      gte(schema.gatherings.expiresAt, sql`now()`),
    ),
    orderBy: (g, { asc }) => [asc(g.startsAt)],
    limit: 100,
  });
  return rows.map(toRow);
}

export async function createGathering(input: CreateGatheringInput): Promise<Gathering> {
  const db = getDb();

  const title = (input.title ?? "").trim().slice(0, 140);
  if (!title) throw new Error(input.kind === "meal" ? "What's cooking?" : "Give the event a title.");

  const body = (input.body ?? "").trim().slice(0, 2000) || null;
  const place = (input.place ?? "").trim().slice(0, 200) || null;

  const startsAt = input.startsAt ? new Date(input.startsAt) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    throw new Error(input.kind === "meal" ? "When's it ready?" : "When is it?");
  }

  const hostDisplayName = (input.hostDisplayName ?? "").trim().slice(0, 80) || "Anonymous";
  const hostHandle =
    (input.hostHandle ?? "").trim().replace(/^@/, "").toLowerCase().slice(0, 40) || "anon";

  // Resolve or create the host by handle, same identity model as problems.
  let citizen = await db.query.citizens.findFirst({ where: eq(schema.citizens.handle, hostHandle) });
  if (!citizen && hostHandle !== "anon") {
    const inserted = await db
      .insert(schema.citizens)
      .values({ handle: hostHandle, displayName: hostDisplayName, avatarSeed: hostHandle })
      .returning();
    citizen = inserted[0];
  }

  const expiresAt = new Date(startsAt.getTime() + EXPIRY_HOURS[input.kind] * 60 * 60 * 1000);

  const inserted = await db
    .insert(schema.gatherings)
    .values({
      kind: input.kind,
      title,
      body,
      place,
      startsAt,
      hostId: citizen?.id ?? null,
      hostHandle: citizen?.handle ?? hostHandle,
      hostDisplayName: citizen?.displayName ?? hostDisplayName,
      expiresAt,
    })
    .returning();

  return toRow(inserted[0]);
}
