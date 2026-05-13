/**
 * Seed the directory_profiles table from the ns.com member directory.
 *
 * Usage:
 *   1. `vercel env pull .env.local` to get the Supabase URL.
 *   2. Open ns.com/directory in your browser while logged in.
 *   3. DevTools → Network → XHR/Fetch → reload. Find the request that
 *      returns the list of members. Copy:
 *        - The full URL (with query params for page/limit).
 *        - The `cookie` header from the request.
 *      Then fill in DIRECTORY_URL_TEMPLATE + COOKIE below (or pass via env).
 *   4. Inspect the JSON response shape and update `mapProfile` to pull
 *      handle / displayName / avatarUrl / role / location out of it.
 *   5. node scripts/scrape-ns-directory.mjs
 *
 * Idempotent: upserts on (handle), so re-running refreshes the data.
 *
 * Bounds: paginates until a page returns fewer than `PAGE_SIZE` rows or
 * `MAX_PAGES` is hit. Sleeps `THROTTLE_MS` between requests so we're a
 * polite consumer, not a hammer.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load .env.local.
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
if (!DB_URL) {
  console.error("No DATABASE_URL set. Run `vercel env pull .env.local`.");
  process.exit(1);
}

// === Fill these in after recon ===========================================
// {page} is substituted with the page index. Use {limit} if the API takes one.
const DIRECTORY_URL_TEMPLATE =
  process.env.NS_DIRECTORY_URL ?? "https://ns.com/api/directory?page={page}&limit={limit}";
const COOKIE = process.env.NS_COOKIE ?? "";
const PAGE_SIZE = Number(process.env.NS_PAGE_SIZE ?? 50);
const MAX_PAGES = Number(process.env.NS_MAX_PAGES ?? 50);
const THROTTLE_MS = Number(process.env.NS_THROTTLE_MS ?? 600);

/**
 * Map one raw API row to a directory_profiles row. Adjust the field paths
 * to whatever the actual API returns. Returns null to skip the row.
 */
function mapProfile(raw) {
  // === EDIT THIS once you know the shape ===
  const handle =
    raw.handle ?? raw.username ?? raw.slug ?? raw.user?.username ?? null;
  const displayName =
    raw.displayName ?? raw.name ?? raw.full_name ?? raw.user?.name ?? null;
  if (!handle || !displayName) return null;
  return {
    handle: String(handle).toLowerCase().replace(/^@/, "").trim(),
    displayName: String(displayName).trim(),
    avatarUrl: raw.avatarUrl ?? raw.avatar_url ?? raw.photoUrl ?? raw.user?.avatar ?? null,
    role: raw.role ?? raw.title ?? raw.headline ?? null,
    location: raw.location ?? raw.city ?? raw.country ?? null,
    bio: raw.bio ?? raw.about ?? null,
    externalId: raw.id ? String(raw.id) : null,
  };
}

/** Pull one page of the directory. Returns { rows: object[], hasMore: bool }. */
async function fetchPage(page) {
  const url = DIRECTORY_URL_TEMPLATE.replace("{page}", String(page)).replace(
    "{limit}",
    String(PAGE_SIZE),
  );
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      cookie: COOKIE,
      "user-agent":
        "ness.city directory seed (https://github.com/adamtpang/ness.city)",
    },
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `Got ${res.status} from directory. Your NS_COOKIE is missing or stale.`,
    );
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  const json = await res.json();
  // Walk common shapes: array, {data:[]}, {results:[]}, {items:[]}, {users:[]}.
  const list = Array.isArray(json)
    ? json
    : json.data ?? json.results ?? json.items ?? json.users ?? json.members ?? [];
  return { rows: list, hasMore: list.length >= PAGE_SIZE };
}

async function main() {
  if (!COOKIE) {
    console.error(
      "NS_COOKIE not set. Open ns.com/directory in DevTools, copy the cookie\n" +
        "header from a directory XHR, and run with:\n" +
        '  NS_COOKIE="..." node scripts/scrape-ns-directory.mjs',
    );
    process.exit(1);
  }

  const sql = postgres(DB_URL, { prepare: false, max: 1, ssl: "require" });
  let scanned = 0;
  let upserted = 0;
  let skipped = 0;

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      process.stdout.write(`page ${page}...`);
      const { rows, hasMore } = await fetchPage(page);
      scanned += rows.length;
      const mapped = rows.map(mapProfile).filter(Boolean);
      skipped += rows.length - mapped.length;

      for (const p of mapped) {
        await sql`
          insert into directory_profiles
            (handle, display_name, avatar_url, role, location, bio, external_id, source, scraped_at)
          values
            (${p.handle}, ${p.displayName}, ${p.avatarUrl}, ${p.role}, ${p.location}, ${p.bio}, ${p.externalId}, 'ns_directory', now())
          on conflict (handle) do update set
            display_name = excluded.display_name,
            avatar_url = excluded.avatar_url,
            role = excluded.role,
            location = excluded.location,
            bio = excluded.bio,
            external_id = excluded.external_id,
            scraped_at = now()
        `;
        upserted++;
      }
      console.log(` got ${rows.length}, mapped ${mapped.length}, total upserted ${upserted}.`);

      if (!hasMore || rows.length === 0) {
        console.log("End of directory.");
        break;
      }
      await new Promise((r) => setTimeout(r, THROTTLE_MS));
    }

    const [{ count }] = await sql`select count(*)::int as count from directory_profiles`;
    console.log(`\nDone. scanned=${scanned} upserted=${upserted} skipped=${skipped} total_in_db=${count}`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
