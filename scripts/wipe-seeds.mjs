// One-shot cleanup of seeded demo rows in the prod DB, so the public site
// only ever shows real activity. SAFE BY DEFAULT: running with no args is a
// dry run that just prints what exists. Nothing is deleted until you pass
// --wipe with an explicit handle list.
//
//   node scripts/wipe-seeds.mjs
//     -> dry run: lists every citizen (handle, name, karma, patronage),
//        pledge (patron, amount), and pagerank ring owner, so you can see
//        exactly which rows are seeds.
//
//   node scripts/wipe-seeds.mjs --wipe balaji,naomi,devraj,marcus,priya
//     -> deletes those citizens, their pledges, and their pagerank rings.
//        Problems they reported are kept (reporter becomes null); real
//        content stays. Bounty "value" will drop by their fake pledges,
//        honest-but-sparse beats full-but-fake.
//
// Reads DATABASE_URL from .env.local (same as scripts/db-apply.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("No DATABASE_URL found (checked env + .env.local).");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 15 });

const wipeArg = process.argv.find((a) => a.startsWith("--wipe"));
const handles = wipeArg
  ? (process.argv[process.argv.indexOf(wipeArg) + 1] ?? wipeArg.split("=")[1] ?? "")
      .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean)
  : null;

try {
  if (!handles) {
    // ---- DRY RUN ----
    const citizens = await sql`select handle, display_name, karma, patronage_cents from citizens order by patronage_cents desc, karma desc`;
    const pledges = await sql`select p.patron_display_name, p.amount_cents, c.handle as patron_handle from pledges p left join citizens c on c.id = p.patron_id order by p.amount_cents desc`;
    const rings = await sql`select c.handle, count(*)::int as edges from pagerank_rings r join citizens c on c.id = r.citizen_id group by c.handle order by edges desc`;

    console.log("== CITIZENS (" + citizens.length + ") ==");
    for (const c of citizens) console.log(`  @${c.handle}  ${c.display_name}  karma:${c.karma}  patronage:$${(c.patronage_cents / 100).toFixed(0)}`);
    console.log("\n== PLEDGES (" + pledges.length + ") ==");
    for (const p of pledges) console.log(`  ${p.patron_display_name} (@${p.patron_handle ?? "?"})  $${(p.amount_cents / 100).toFixed(0)}`);
    console.log("\n== PAGERANK RING OWNERS (" + rings.length + ") ==");
    for (const r of rings) console.log(`  @${r.handle}  ${r.edges} edges`);
    console.log("\nDry run only. To delete seeds:\n  node scripts/wipe-seeds.mjs --wipe handle1,handle2,...");
  } else {
    // ---- WIPE ----
    console.log("Wiping handles:", handles.join(", "));
    const ids = await sql`select id, handle from citizens where lower(handle) in ${sql(handles)}`;
    if (ids.length === 0) {
      console.log("No citizens matched those handles. Nothing deleted.");
    } else {
      const idList = ids.map((r) => r.id);
      const delPledges = await sql`delete from pledges where patron_id in ${sql(idList)} returning id`;
      const delRings = await sql`delete from pagerank_rings where citizen_id in ${sql(idList)} returning id`;
      const delCitizens = await sql`delete from citizens where id in ${sql(idList)} returning handle`;
      console.log(`Deleted: ${delCitizens.length} citizens, ${delPledges.length} pledges, ${delRings.length} rings.`);
      console.log("Kept: all problems, proposals, documentation (reporters become null).");
    }
  }
} finally {
  await sql.end({ timeout: 5 });
}
