/**
 * Seed the PageRank graph with plausible rings so the leaderboard is non-empty.
 * Run once against prod:
 *   node scripts/seed-pagerank.mjs https://ness.city
 *
 * Each citizen submits a partial ring (R1..R3 mostly) naming people inside
 * the small cast below. Submissions are idempotent: re-running replaces a
 * citizen's previous ring.
 */

const BASE = process.argv[2] ?? "https://www.ness.city";

/** @type {{handle:string, name:string, ring: {name: string, round: number}[]}[]} */
const RINGS = [
  {
    handle: "adam",
    name: "Adam Pang",
    ring: [
      { name: "susan", round: 1 },
      { name: "marcus", round: 2 },
      { name: "priya", round: 2 },
      { name: "balaji", round: 3 },
      { name: "devraj", round: 3 },
      { name: "kofi", round: 3 },
      { name: "naomi", round: 3 },
      { name: "jonas", round: 4 },
      { name: "lena", round: 4 },
      { name: "aisha", round: 4 },
      { name: "emiko", round: 4 },
    ],
  },
  {
    handle: "marcus",
    name: "Marcus Lee",
    ring: [
      { name: "priya", round: 1 },
      { name: "adam", round: 2 },
      { name: "kofi", round: 2 },
      { name: "naomi", round: 3 },
      { name: "balaji", round: 3 },
      { name: "susan", round: 3 },
      { name: "jonas", round: 3 },
      { name: "devraj", round: 4 },
      { name: "lena", round: 4 },
      { name: "aisha", round: 4 },
    ],
  },
  {
    handle: "priya",
    name: "Priya Krishnan",
    ring: [
      { name: "aisha", round: 1 },
      { name: "marcus", round: 2 },
      { name: "naomi", round: 2 },
      { name: "adam", round: 3 },
      { name: "susan", round: 3 },
      { name: "lena", round: 3 },
      { name: "emiko", round: 3 },
      { name: "kofi", round: 4 },
      { name: "balaji", round: 4 },
    ],
  },
  {
    handle: "susan",
    name: "Susan Wei",
    ring: [
      { name: "adam", round: 1 },
      { name: "priya", round: 2 },
      { name: "marcus", round: 2 },
      { name: "balaji", round: 3 },
      { name: "naomi", round: 3 },
      { name: "emiko", round: 3 },
      { name: "aisha", round: 3 },
      { name: "lena", round: 4 },
    ],
  },
  {
    handle: "balaji",
    name: "Balaji",
    ring: [
      { name: "adam", round: 1 },
      { name: "marcus", round: 2 },
      { name: "priya", round: 2 },
      { name: "devraj", round: 3 },
      { name: "kofi", round: 3 },
      { name: "jonas", round: 3 },
      { name: "susan", round: 3 },
    ],
  },
  {
    handle: "devraj",
    name: "Devraj Iyer",
    ring: [
      { name: "emiko", round: 1 },
      { name: "adam", round: 2 },
      { name: "naomi", round: 2 },
      { name: "kofi", round: 3 },
      { name: "balaji", round: 3 },
      { name: "marcus", round: 3 },
      { name: "lena", round: 3 },
      { name: "jonas", round: 4 },
    ],
  },
  {
    handle: "emiko",
    name: "Emiko Tanaka",
    ring: [
      { name: "devraj", round: 1 },
      { name: "priya", round: 2 },
      { name: "naomi", round: 2 },
      { name: "susan", round: 3 },
      { name: "lena", round: 3 },
      { name: "aisha", round: 3 },
    ],
  },
  {
    handle: "kofi",
    name: "Kofi Mensah",
    ring: [
      { name: "jonas", round: 1 },
      { name: "marcus", round: 2 },
      { name: "adam", round: 2 },
      { name: "balaji", round: 3 },
      { name: "devraj", round: 3 },
      { name: "naomi", round: 3 },
    ],
  },
  {
    handle: "jonas",
    name: "Jonas Weber",
    ring: [
      { name: "kofi", round: 1 },
      { name: "lena", round: 2 },
      { name: "marcus", round: 2 },
      { name: "adam", round: 3 },
      { name: "balaji", round: 3 },
    ],
  },
  {
    handle: "lena",
    name: "Lena Petrova",
    ring: [
      { name: "jonas", round: 1 },
      { name: "emiko", round: 2 },
      { name: "priya", round: 2 },
      { name: "devraj", round: 3 },
      { name: "naomi", round: 3 },
      { name: "aisha", round: 3 },
    ],
  },
  {
    handle: "aisha",
    name: "Aisha Bello",
    ring: [
      { name: "priya", round: 1 },
      { name: "naomi", round: 2 },
      { name: "emiko", round: 2 },
      { name: "lena", round: 3 },
      { name: "susan", round: 3 },
      { name: "adam", round: 3 },
    ],
  },
  {
    handle: "naomi",
    name: "Naomi Park",
    ring: [
      { name: "aisha", round: 1 },
      { name: "priya", round: 2 },
      { name: "devraj", round: 2 },
      { name: "marcus", round: 3 },
      { name: "emiko", round: 3 },
      { name: "kofi", round: 3 },
      { name: "lena", round: 4 },
    ],
  },
];

async function main() {
  console.log(`Seeding ${RINGS.length} rings against ${BASE} ...`);
  let ok = 0;
  let bad = 0;
  for (const r of RINGS) {
    const body = {
      citizenHandle: r.handle,
      citizenDisplayName: r.name,
      names: r.ring,
    };
    try {
      const res = await fetch(`${BASE}/api/pagerank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        console.log(`  ok   @${r.handle}  (${data.submitted} names)`);
        ok++;
      } else {
        console.log(`  FAIL @${r.handle}  ${res.status}  ${JSON.stringify(data)}`);
        bad++;
      }
    } catch (e) {
      console.log(`  ERR  @${r.handle}  ${e instanceof Error ? e.message : e}`);
      bad++;
    }
  }
  console.log(`\nDone. ${ok} submitted, ${bad} failed.`);

  // Pull leaderboard so we can see the result.
  try {
    const res = await fetch(`${BASE}/api/pagerank`, { cache: "no-store" });
    const data = await res.json();
    console.log(`\nLeaderboard (${data.leaderboard?.length ?? 0} rows):`);
    for (const row of (data.leaderboard ?? []).slice(0, 12)) {
      console.log(
        `  @${row.named_handle.padEnd(12)}  score=${String(row.score).padStart(3)}  namers=${row.namers}  mentions=${row.mentions}`,
      );
    }
  } catch (e) {
    console.log("Could not pull leaderboard:", e);
  }
}

main();
