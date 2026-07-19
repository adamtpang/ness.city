import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/**
 * Runtime settings for the rating subsystem, read from the member_settings
 * key/value table with a safe fallback. The one that must flip WITHOUT a
 * redeploy is the admin kill switch: `ratings_frozen` freezes all rating
 * writes and takes the public page down.
 */

export const SETTING_KEYS = {
  ratingsFrozen: "ratings_frozen",
} as const;

export type MemberSettings = {
  ratingsFrozen: boolean;
};

export async function getMemberSettings(): Promise<MemberSettings> {
  const fallback: MemberSettings = { ratingsFrozen: false };
  if (!isDbConfigured) return fallback;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.memberSettings)
      .where(eq(schema.memberSettings.key, SETTING_KEYS.ratingsFrozen));
    return { ratingsFrozen: rows[0]?.value === "true" };
  } catch {
    // Never let a settings read take the site down; fail open.
    return fallback;
  }
}

/** Write one setting. Used by the admin surface. */
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
