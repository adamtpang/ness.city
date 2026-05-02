import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export function clean(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function intInRange(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < min || rounded > max) return null;
  return rounded;
}

/**
 * Resolve a citizen by handle, creating one if absent. Returns the row.
 */
export async function ensureCitizen(opts: {
  handle: string;
  displayName: string;
}) {
  const db = getDb();
  const handle = opts.handle.toLowerCase();
  const existing = await db.query.citizens.findFirst({
    where: eq(schema.citizens.handle, handle),
  });
  if (existing) return existing;
  const inserted = await db
    .insert(schema.citizens)
    .values({
      handle,
      displayName: opts.displayName,
      avatarSeed: handle,
    })
    .returning();
  return inserted[0];
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
