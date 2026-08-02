# UPGRADE_SESSION — ness.city

**Date:** 2026-07-28  
**Brand rule:** ness only · antlist/nslink consolidated (see `CONSOLIDATION.md`)  
**Scope:** ness.city repo only

## Cold-start (live deploy)

| Check | Result |
| --- | --- |
| `https://ness.city/` | 200 |
| `https://ness.city/jobs` | 200 |
| `https://ness.city/townhall/new` | 200 |
| `GET /api/health` | `ok: true`, DB configured + reachable |
| Live counts (session) | problems **7**, citizens **13**, bounties **1**, pledges **3**, pagerank_rings **89** |
| Primary engine | Home = Townhall board (force-dynamic, Postgres-backed) |
| Jobs | Static curated board in `lib/jobs.ts` |

Live loop was already past “demo-only API”: file/vote/propose/pledge routes exist. Gaps were **board honesty** and **dead detail CTAs**.

## Mission choices this session

1. Product clarity + one strongest live loop → **Townhall E2E**
2. `CONSOLIDATION.md` written (antlist folded, nslink folded, canonical ness.city)
3. Optional OG share image → `app/opengraph-image.tsx`
4. `OFFER.md` one-liner filled
5. No NS rebrand · no nslink bot revival · no antlist PRs

## Primary loop upgrade: Townhall E2E

### Problem

The home board was the civic engine, but for **live DB rows** the Solution and Bounty columns stayed empty/demo-shaped. Detail pages showed proposal authors as “Anonymous”, patron lists vanished when citizens weren’t in the sample store, and BountyPanel buttons did nothing.

### Shipped fixes

| Area | Change |
| --- | --- |
| `lib/db/queries.ts` | `listProblemsWithCounts` now returns latest proposal summary/author + pledged/goal bounty USD |
| `lib/db/queries.ts` | `dbProblemToTownhall` maps `authorDisplayName` and `patronDisplayName` |
| `app/page.tsx` | Live board renders real Solution + Bounty; CTAs deep-link to `#propose` / `#pledge` |
| `app/townhall/[slug]/page.tsx` | Anchor IDs for propose/bounty/pledge/ship; proposal authors from DB names |
| `components/BountyPanel.tsx` | Dead buttons → real anchors; live patrons render without sample citizen table |
| `lib/types.ts` | Optional display names on proposals and pledges |
| `lib/demo-seed.ts` | Seed aligned with expanded `ProblemWithCounts` |

### Loop after upgrade

1. **Surface** — home modal / `/townhall/new` → `POST /api/problems` (+5 karma)
2. **Prioritize** — VoteCell → `POST /api/problems/vote`
3. **Propose** — detail `#propose` → `POST /api/proposals` (author name shows)
4. **Fund** — open bounty → pledge form `#pledge` (patrons list shows)
5. **Ship** — funded/claimed → `#ship` documentation form

Board now reflects steps 3–4 without requiring demo seed.

## Other deliverables

| File | Why |
| --- | --- |
| `CONSOLIDATION.md` | Binding fold of antlist + nslink into ness |
| `OFFER.md` | One-liner for operators/builders + civic cure |
| `app/opengraph-image.tsx` | Free civic OG share card |
| `app/layout.tsx` | Clearer meta description; v0.17 footer |

## Explicit non-goals (honored)

- No feature work in antlist / nslink sibling folders
- No Network School rebrand
- No nslink router bot product revival
- No video SaaS media; OG only for share/proof

## Proof checklist

- [x] `CONSOLIDATION.md` exists
- [x] One live loop better (Townhall board + detail E2E honesty)
- [x] antlist / nslink off product roadmap (documented)
- [x] OFFER one-liner filled
- [x] Optional OG card added

## Next (not done this session)

- Persist urgency votes (second axis for Eisenhower)
- USDC-on-Base wallet pledging (column exists; flow not shipped)
- Jobs weekly refresh + link health as secondary loop
- Stranger retention metric in `EVIDENCE.md` after deploy usage

## Deploy note

Push this branch / redeploy Vercel so production picks up board query + OG route. Re-verify:

```bash
curl https://ness.city/api/health
# open https://ness.city/  — Solution/Bounty columns for live problems
# open a problem with a bounty — patrons list + Add to bounty → #pledge
```
