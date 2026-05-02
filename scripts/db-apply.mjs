// Applies generated Drizzle SQL migrations directly via postgres-js.
// Lets us run migrations from a non-TTY shell where `drizzle-kit push`
// can't prompt for confirmation.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load .env.local manually if present (since this runs outside Next).
const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(?:"(.*)"|(.*))$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2] ?? m[3] ?? "";
    }
  }
}

const url =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;

if (!url) {
  console.error("No DATABASE_URL / POSTGRES_URL set. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const dir = path.join(root, "drizzle");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error(`No migration files in ${dir}.`);
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, ssl: "require" });

try {
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const text = fs.readFileSync(fullPath, "utf8");
    const statements = text
      .split(/-->\s*statement-breakpoint/)
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(`\nApplying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt);
        const head = stmt.slice(0, 80).replace(/\s+/g, " ");
        console.log(`  ✓ ${head}${stmt.length > 80 ? "…" : ""}`);
      } catch (err) {
        const head = stmt.slice(0, 80).replace(/\s+/g, " ");
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("already exists") ||
          msg.includes("duplicate object") ||
          msg.includes("duplicate_object")
        ) {
          console.log(`  · ${head}${stmt.length > 80 ? "…" : ""} (already exists, skipped)`);
          continue;
        }
        console.error(`  ✗ ${head}\n    ${msg}`);
        throw err;
      }
    }
  }
  console.log("\nDone.");
} finally {
  await sql.end();
}
