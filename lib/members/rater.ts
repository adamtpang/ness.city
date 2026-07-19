import { and, eq, or, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

/**
 * Rater identity. Sent by the authenticated client from the Privy user
 * object. `did` (Privy's stable did:privy:… id) is the anchor everything
 * keys on.
 *
 * Trust model, v1: we trust the DID/email the authenticated client sends,
 * exactly as the rest of Ness trusts a client-provided handle. This is a
 * closed, in-person cohort with a kill switch and abuse review, so it ships
 * today. `resolveRater` is the single seam where server-side Privy token
 * verification (@privy-io/server-auth) drops in later without touching
 * callers — verify the token, then use its `sub` as the DID.
 */
export type RaterIdentity = {
  did: string;
  email?: string | null;
  displayName?: string | null;
  handle?: string | null;
};

export type Rater = typeof schema.raters.$inferSelect;

const clean = (v: unknown, max: number): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
};

const normHandle = (v: unknown): string | null => {
  const t = clean(v, 60);
  if (!t) return null;
  return t.toLowerCase().replace(/^@/, "").replace(/[^a-z0-9._-]+/g, "") || null;
};

/** Parse + validate a rater identity from a request body. */
export function parseRaterIdentity(body: unknown): RaterIdentity | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const identity = (b.identity ?? b) as Record<string, unknown>;
  const did = clean(identity.did, 200);
  if (!did) return null;
  return {
    did,
    email: clean(identity.email, 200),
    displayName: clean(identity.displayName, 120),
    handle: normHandle(identity.handle),
  };
}

/**
 * Find or create the rater for this identity. Idempotent on privy_did.
 * Refreshes email/displayName/handle when the client sends better values,
 * and best-effort links the rater to their own directory profile so we can
 * exclude self from their rate list.
 */
export async function ensureRater(identity: RaterIdentity): Promise<Rater> {
  const db = getDb();
  const displayName =
    identity.displayName ||
    (identity.email ? identity.email.split("@")[0] : null) ||
    "Member";

  const linkedProfileId = await matchDirectoryProfile(identity);

  const inserted = await db
    .insert(schema.raters)
    .values({
      privyDid: identity.did,
      email: identity.email ?? null,
      displayName,
      handle: identity.handle ?? null,
      subjectProfileId: linkedProfileId,
    })
    .onConflictDoUpdate({
      target: schema.raters.privyDid,
      set: {
        // Only overwrite with non-null incoming values (coalesce keeps prior).
        email: sql`coalesce(${identity.email ?? null}, ${schema.raters.email})`,
        displayName: sql`coalesce(${identity.displayName ?? null}, ${schema.raters.displayName})`,
        handle: sql`coalesce(${identity.handle ?? null}, ${schema.raters.handle})`,
        subjectProfileId: sql`coalesce(${schema.raters.subjectProfileId}, ${linkedProfileId})`,
      },
    })
    .returning();

  return inserted[0];
}

/**
 * Best-effort link a rater to their directory profile: by explicit handle
 * first, then by exact (case-insensitive) display-name match. Returns null
 * when nothing matches — self-exclusion is a nicety, not a requirement.
 */
async function matchDirectoryProfile(
  identity: RaterIdentity,
): Promise<string | null> {
  const db = getDb();
  const conds = [];
  if (identity.handle) conds.push(eq(schema.directoryProfiles.handle, identity.handle));
  if (identity.displayName)
    conds.push(
      sql`lower(${schema.directoryProfiles.displayName}) = ${identity.displayName.toLowerCase()}`,
    );
  if (conds.length === 0) return null;

  const rows = await db
    .select({ id: schema.directoryProfiles.id })
    .from(schema.directoryProfiles)
    .where(conds.length === 1 ? conds[0] : or(...conds))
    .limit(1);
  return rows[0]?.id ?? null;
}
