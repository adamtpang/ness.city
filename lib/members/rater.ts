import { randomUUID } from "node:crypto";
import { and, eq, or, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { slugify } from "@/lib/api-helpers";

/** Normalize a referral code from the client (the ?ref= on an invite link). */
export function normalizeRef(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return t.length >= 6 && t.length <= 16 ? t : null;
}

export type DirectoryProfile = typeof schema.directoryProfiles.$inferSelect;

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
export async function ensureRater(
  identity: RaterIdentity,
  opts: { ref?: string | null } = {},
): Promise<Rater> {
  const db = getDb();
  const displayName =
    identity.displayName ||
    (identity.email ? identity.email.split("@")[0] : null) ||
    "Member";

  const linkedProfileId = await matchDirectoryProfile(identity);
  // Generated once, on first insert. invite_code = this rater's share code;
  // referred_by = whoever's link first brought them in (first-touch).
  const inviteCode = randomUUID().replace(/-/g, "").slice(0, 8);
  const referredBy = normalizeRef(opts.ref);

  const inserted = await db
    .insert(schema.raters)
    .values({
      privyDid: identity.did,
      email: identity.email ?? null,
      displayName,
      handle: identity.handle ?? null,
      subjectProfileId: linkedProfileId,
      inviteCode,
      referredBy,
    })
    .onConflictDoUpdate({
      target: schema.raters.privyDid,
      set: {
        // Only overwrite with non-null incoming values (coalesce keeps prior).
        // invite_code + referred_by are intentionally NOT here — set once.
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

export type RaterStatus = {
  rater: Rater;
  profile: DirectoryProfile | null;
  /** True when the rater has no roster profile yet — show onboarding. */
  needsOnboarding: boolean;
};

/** Ensure the rater and load their linked roster profile (if any). */
export async function getRaterStatus(
  identity: RaterIdentity,
  opts: { ref?: string | null } = {},
): Promise<RaterStatus> {
  const db = getDb();
  const rater = await ensureRater(identity, opts);
  let profile: DirectoryProfile | null = null;
  if (rater.subjectProfileId) {
    const rows = await db
      .select()
      .from(schema.directoryProfiles)
      .where(eq(schema.directoryProfiles.id, rater.subjectProfileId))
      .limit(1);
    profile = rows[0] ?? null;
  }
  return { rater, profile, needsOnboarding: !profile };
}

/**
 * Onboard the rater as a rateable member — the self-seeding path that makes
 * "test with my friends first" work with zero manual DB seeding. Reuses an
 * existing directory profile if the rater is already linked or matches one
 * (no duplicate rows), otherwise creates a fresh self-sourced profile with a
 * unique handle. `building` is the one line others see on the rating card.
 */
export async function onboardRater(
  identity: RaterIdentity,
  input: { displayName: string; building?: string | null },
): Promise<DirectoryProfile> {
  const db = getDb();
  const rater = await ensureRater(identity);
  const displayName = input.displayName.trim().slice(0, 120) || rater.displayName;
  const building = input.building?.trim().slice(0, 200) || null;

  // Target an existing profile first (linked, or a best-effort match), else create.
  let profileId = rater.subjectProfileId ?? (await matchDirectoryProfile(identity));

  if (profileId) {
    await db
      .update(schema.directoryProfiles)
      .set({ displayName, role: building })
      .where(eq(schema.directoryProfiles.id, profileId));
  } else {
    const handle = await uniqueSelfHandle(displayName, identity);
    const inserted = await db
      .insert(schema.directoryProfiles)
      .values({
        handle,
        displayName,
        role: building,
        source: "self",
        externalId: identity.did,
      })
      .returning();
    profileId = inserted[0].id;
  }

  await db
    .update(schema.raters)
    .set({ subjectProfileId: profileId, displayName })
    .where(eq(schema.raters.id, rater.id));

  const rows = await db
    .select()
    .from(schema.directoryProfiles)
    .where(eq(schema.directoryProfiles.id, profileId))
    .limit(1);
  return rows[0];
}

/** A directory handle that doesn't collide, derived from the display name. */
async function uniqueSelfHandle(displayName: string, identity: RaterIdentity): Promise<string> {
  const db = getDb();
  const base =
    slugify(displayName) ||
    (identity.email ? slugify(identity.email.split("@")[0]) : "") ||
    "member";
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const hit = await db
      .select({ id: schema.directoryProfiles.id })
      .from(schema.directoryProfiles)
      .where(eq(schema.directoryProfiles.handle, candidate))
      .limit(1);
    if (hit.length === 0) return candidate;
  }
  // Fallback: suffix with a slice of the DID so it's deterministic and unique.
  return `${base}-${identity.did.slice(-6).replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
}
