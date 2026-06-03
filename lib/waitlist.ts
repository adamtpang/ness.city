import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

/**
 * Waitlist storage. Created on demand with CREATE TABLE IF NOT EXISTS so it
 * works on prod the instant the code ships, no separate migration step (the
 * demo cannot wait on a manual Supabase migration). bigserial PK avoids any
 * dependency on the uuid extension.
 */
export async function ensureWaitlistTable(): Promise<void> {
  const db = getDb();
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id bigserial PRIMARY KEY,
      email text NOT NULL,
      note text,
      source text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

export async function waitlistCount(): Promise<number> {
  const db = getDb();
  const rows = await db.execute(sql`SELECT count(*)::int AS n FROM waitlist`);
  return (rows as unknown as Array<{ n: number }>)[0]?.n ?? 0;
}

export async function addToWaitlist(
  email: string,
  note: string | null,
  source: string,
): Promise<void> {
  const db = getDb();
  await db.execute(
    sql`INSERT INTO waitlist (email, note, source) VALUES (${email}, ${note}, ${source})`,
  );
}
