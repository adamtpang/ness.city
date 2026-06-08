import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Drizzle client. Works with any standard Postgres (Vercel Postgres,
 * Supabase, Neon, plain-old PG). Uses postgres-js so we're not tied to
 * any single provider's HTTP shim.
 *
 * Supabase note: when using the *pooler* connection (port 6543) we have
 * to disable prepared statements; the pooler doesn't carry session
 * state across connections. `prepare: false` makes that safe.
 */

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const isDbConfigured = Boolean(url);

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Provision Supabase or Vercel Postgres, then add the connection string to your project env vars.",
      );
    }
    _client = postgres(url, {
      // The pooler (port 6543) doesn't carry prepared statements across
      // connections, so disable them.
      prepare: false,
      // Pages like the home board fire several queries at once. With max:1,
      // postgres-js pipelines them onto a single connection, which the
      // Supabase transaction pooler cannot do and the request hangs (504).
      // Giving concurrent queries their own pooled connections fixes it.
      max: 10,
      idle_timeout: 20,
      connect_timeout: 15,
    });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

export { schema };
