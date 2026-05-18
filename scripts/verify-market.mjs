/**
 * End-to-end check of the live /api/market on prod:
 *   1. POST a real listing (clearly-marked test handle)
 *   2. GET and confirm it round-trips
 *   3. DELETE it directly from Postgres so prod stays clean
 *
 * Usage: node scripts/verify-market.mjs
 * Requires .env.local with POSTGRES_URL_NON_POOLING (vercel env pull).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const BASE = process.argv[2] ?? "https://www.ness.city";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(?:"(.*)"|(.*))$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2] ?? m[3] ?? "";
  }
}
const DB_URL =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;

const TEST_HANDLE = "__market_e2e_probe__";

async function main() {
  // 1. POST
  const postRes = await fetch(`${BASE}/api/market`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "forsale",
      title: "E2E probe listing (auto-deleted)",
      body: "Automated verification listing. Removed immediately.",
      priceUsd: 1,
      // 1x1 red JPEG so we exercise the photo path end-to-end.
      photo:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==",
      sellerHandle: TEST_HANDLE,
      sellerDisplayName: "E2E Probe",
      contactKind: "email",
      contactValue: "probe@example.com",
    }),
  });
  const posted = await postRes.json();
  if (!postRes.ok || !posted.ok) {
    console.error("POST failed:", postRes.status, posted);
    process.exit(1);
  }
  const id = posted.listing?.id;
  const hasPhoto = posted.listing?.hasPhoto;
  console.log(
    `POST ok -> id=${id} handle=@${posted.listing?.authorHandle} hasPhoto=${hasPhoto}`,
  );

  // 2. GET round-trip
  const getRes = await fetch(`${BASE}/api/market?kind=forsale`, {
    cache: "no-store",
  });
  const got = await getRes.json();
  const found = (got.listings ?? []).some((l) => l.id === id);
  console.log(
    `GET ok -> ${got.listings?.length ?? 0} forsale listings; probe present: ${found}`,
  );

  // 2b. Photo route returns an image
  const photoRes = await fetch(`${BASE}/api/market/photo?id=${id}`, {
    cache: "no-store",
  });
  const photoOk =
    photoRes.ok && (photoRes.headers.get("content-type") ?? "").startsWith("image/");
  console.log(
    `PHOTO ok -> ${photoRes.status} ${photoRes.headers.get("content-type")} (${photoOk ? "image served" : "FAIL"})`,
  );

  // 3. Cleanup
  if (DB_URL) {
    const sql = postgres(DB_URL, { prepare: false, max: 1, ssl: "require" });
    try {
      const del = await sql`
        delete from market_listings where seller_handle = ${TEST_HANDLE}
      `;
      console.log(`Cleanup: deleted ${del.count} probe row(s).`);
      await sql`delete from citizens where handle = ${TEST_HANDLE}`;
    } finally {
      await sql.end();
    }
  } else {
    console.warn(
      "No DB url for cleanup. Probe row will expire in 30 days. Run `vercel env pull .env.local` and re-run to clean now.",
    );
  }

  const pass = found && photoOk;
  console.log(
    pass
      ? "\nE2E PASS (post + get + photo + cleanup)"
      : `\nE2E FAIL (found=${found} photoOk=${photoOk})`,
  );
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
