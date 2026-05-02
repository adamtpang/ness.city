import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Singleton Drizzle client. Uses the `DATABASE_URL` env var, which is what
 * Vercel injects when you click "Add Postgres" in the project Storage tab.
 * Falls back to `POSTGRES_URL` (Vercel's older alias) if the new one isn't
 * set, so the app works on both old and new Vercel projects.
 */

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const isDbConfigured = Boolean(url);

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Provision Vercel Postgres in the project Storage tab, then redeploy.",
      );
    }
    const client = neon(url);
    _db = drizzle(client, { schema });
  }
  return _db;
}

export { schema };
