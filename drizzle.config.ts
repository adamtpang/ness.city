import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit (push, generate, studio) uses a *direct* connection — the
 * pooler (port 6543) refuses some DDL. Vercel's Supabase integration
 * exposes both:
 *   POSTGRES_URL              - pooled, port 6543, for runtime
 *   POSTGRES_URL_NON_POOLING  - direct,  port 5432, for migrations
 */
const migrationUrl =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  "";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
  strict: true,
  verbose: true,
} satisfies Config;
