import { inArray } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { MEMBER_CONFIG, type PublicMode } from "./config";

/**
 * Runtime settings for the rating subsystem, read from the member_settings
 * key/value table with safe fallbacks. These are the switches that must flip
 * WITHOUT a redeploy:
 *   - ratingsFrozen: the admin kill switch. Freezes all rating writes and
 *     takes the public page down.
 *   - publicMode: "highlights" (default) or "full".
 *
 * If the DB is not configured or the rows are absent, we fall back to the
 * compile-time config, and the kill switch defaults to NOT frozen.
 */

export const SETTING_KEYS = {
  ratingsFrozen: "ratings_frozen",
  publicMode: "public_mode",
} as const;

export type MemberSettings = {
  ratingsFrozen: boolean;
  publicMode: PublicMode;
};

export async function getMemberSettings(): Promise<MemberSettings> {
  const fallback: MemberSettings = {
    ratingsFrozen: false,
    publicMode: MEMBER_CONFIG.publicMode,
  };
  if (!isDbConfigured) return fallback;

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.memberSettings)
      .where(
        inArray(schema.memberSettings.key, [
          SETTING_KEYS.ratingsFrozen,
          SETTING_KEYS.publicMode,
        ]),
      );
    const map = new Map(rows.map((r) => [r.key, r.value]));

    const frozen = map.get(SETTING_KEYS.ratingsFrozen);
    const mode = map.get(SETTING_KEYS.publicMode);

    return {
      ratingsFrozen: frozen === "true",
      publicMode: mode === "full" ? "full" : "highlights",
    };
  } catch {
    // Never let a settings read take the site down; fail safe (open for
    // writes, highlights-only for the public page).
    return fallback;
  }
}

/** Write one setting. Used by the admin surface (Phase 3). */
export async function setMemberSetting(
  key: (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS],
  value: string,
): Promise<void> {
  if (!isDbConfigured) throw new Error("Database not configured");
  const db = getDb();
  await db
    .insert(schema.memberSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: schema.memberSettings.key,
      set: { value, updatedAt: new Date() },
    });
}
