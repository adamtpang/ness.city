# ness.city/members — Member Rating Index

A two-tab app where Network School members rate each other on a **−2…+2
spectrum** (one tap / swipe per person) and see a **ranked social index** that
reveals more as they rate. Built to seed a social graph fast with a small,
in-person, high-trust community and spread virally.

This doc is the handoff / context for continuing the work.

---

## Where it lives

| Path | What |
|---|---|
| `app/members/page.tsx` | Public entry — server shell (counters + teaser) → renders the client app. |
| `app/members/dashboard/page.tsx` | Core-team dashboard, token-gated, full numbers + CSV link. |
| `app/members/rate/page.tsx` | Redirects to `/members` (rate is a tab now). |
| `components/members/MembersApp.tsx` | The whole client app: tabs, swipe card, leaderboard, onboarding, share. |
| `app/api/members/list` | POST — personalized rate deck + progress + onboarding status. |
| `app/api/members/rate` | POST — write one −2…+2 rating (upsert). |
| `app/api/members/onboard` | POST — add the signed-in user to the rateable roster. |
| `app/api/members/leaderboard` | POST — ranked index with progressive reveal (optional identity). |
| `app/api/members/export` | GET — CSV of the full table (token-gated). |
| `lib/members/config.ts` | **Every tunable constant.** Start here to change behavior. |
| `lib/members/scoring.ts` | Pure scoring (shrunk mean, median, reveal math). |
| `lib/members/queries.ts` | All SQL (deck, leaderboard, dashboard, counters). |
| `lib/members/rater.ts` | Identity + onboarding (`ensureRater`, `getRaterStatus`, `onboardRater`). |
| `lib/members/settings.ts` | Kill switch (DB-backed, flip with no redeploy). |
| `lib/db/schema.ts` | Tables: `raters`, `member_ratings`, `member_settings`, `member_dashboard_views`. |
| `drizzle/0005_member_rating_index.sql` | The migration. |
| `middleware.ts` | Apex `ness.city/` now 307-redirects → `/members`. |

**Roster source:** the existing `directory_profiles` table (the scraped NS
directory — data is gitignored PII but lives in the DB). Members rate the
people in that table. Signed-in users who aren't in it add themselves via
onboarding (creates a `directory_profiles` row with `source='self'`).

---

## Data model

- **`raters`** — one row per signed-in Privy user, keyed by stable `privy_did`.
  Linked (`subject_profile_id`) to their own `directory_profiles` row so we can
  exclude self. `tenure_months` reserved for future weighting.
- **`member_ratings`** — one upsertable row per `(rater, subject)` pair;
  `rating` is a single `smallint` in −2…+2. Unique on the pair.
- **`member_settings`** — kv; `ratings_frozen = "true"` is the kill switch.
- **`member_dashboard_views`** — audit log (viewer + timestamp) for dashboard loads.

## Scoring (all constants in `lib/members/config.ts`)

- Score = **Bayesian-shrunk mean** of ratings received: `(sum + priorMean*priorWeight) / (n + priorWeight)`, `priorMean=0, priorWeight=3`. Pulls low-count members toward neutral so one +2 can't top the board.
- Members with `< minRatingsToRank` (3) are held out of the public ranking (shown as "warming up"); on the dashboard they're flagged "insufficient data".
- Leaderboard shows a 0…1 **sentiment bar + rating count**, never a raw score.
- **Progressive reveal:** you see `baseVisible + revealPerRating × (your ratings)` rows; signed-out sees `signedOutVisible` (3). This is the crawl/viral loop.
- **Deck order:** directory `role`/`location` keyword match (`core`, `longterm`, `founder`, …) first, then fewest-ratings for coverage, then freshest.

## Privacy / safety

- **Nobody sees their own score/rank** — the leaderboard hides the viewer's own row (`hideOwnRow`). Nobody sees who rated whom; only aggregates leave the server.
- **Kill switch** (`member_settings.ratings_frozen`) freezes all writes AND takes the public page down. Flip via SQL or `setMemberSetting`.
- **Rate limit** — `rateLimitPerHour` new pairs per rater (anti-bulk-dump), returns 429.
- **Consent** — one-time notice before first rating.

## Auth / trust model

Rater identity = the signed-in **Privy user** (`did`, email, displayName),
sent by the client and trusted, matching the rest of Ness's lightweight
identity. `lib/members/rater.ts#parseRaterIdentity` is the single seam to add
server-side Privy token verification (`@privy-io/server-auth`) later — verify
the token, use its `sub` as the DID; no callers change.

---

## Run & test locally

```bash
npm install
# needs a Postgres. Point DATABASE_URL at it, then:
npm run db:apply                 # applies drizzle/*.sql
NEXT_PUBLIC_PRIVY_APP_ID=... \   # optional; without it rating is gated but rankings work
AGENT_API_TOKEN=... \            # for the /members/dashboard gate + CSV
DATABASE_URL=... npm run dev
```

- The core APIs were verified end-to-end against a local Postgres: bucket writes, deck priority, shrunk-mean ranking, min-ratings holdout, progressive reveal, self-row exclusion, counters, range validation (400), rate limit (429), kill switch (423 + page down), and self-onboarding (new user → rateable member).
- ⚠️ **Not yet smoke-tested live:** the `/members/dashboard` render and `/api/members/export` CSV (they compile + the aggregate query is verified; run them once after deploy). The swipe-card gesture was screenshotted, not touch-tested on a device.

## Deploy checklist

1. Merge → Vercel deploys.
2. `npm run db:apply` against Supabase (adds the migration `0005`).
3. Confirm `NEXT_PUBLIC_PRIVY_APP_ID` set (rating) and `AGENT_API_TOKEN` set (dashboard/CSV gate).
4. `directory_profiles` already holds the scraped roster; no seeding needed. New testers self-onboard.
5. Visit `ness.city` → should land on `/members`. Dashboard at `/members/dashboard?token=YOUR_AGENT_API_TOKEN`.

## Current prod status (2026-07-19) — built + verified, NOT yet live

The app code is done, typechecks clean, and the backend was verified end-to-end
against a real (throwaway local) Postgres: all migrations apply, and the two
surfaces never run live before (dashboard aggregate + export CSV) plus
leaderboard holdout/self-hide, deck exclusion + priority, progressive reveal,
rate upsert, rate limit, kill switch, and self-onboard all produce correct
results. The blockers are all infra/config, none in the code:

1. **Supabase is PAUSED / unreachable** (project ref `nainihapgoaelcebpmby`). REST
   + direct host are dead and the pooler returns "tenant not found" — the whole
   ness.city DB is down, so `npm run db:apply` fails and nothing DB-backed serves.
   Fix: Supabase dashboard → the project → Restore (free-tier auto-pause).
2. **`NEXT_PUBLIC_PRIVY_APP_ID` + `AGENT_API_TOKEN` are in Vercel, not `.env.local`.**
   Without Privy, rankings still render but rating is disabled.
3. **Apex `ness.city` still edge-redirects → www → optimism.fun, and the ness.city
   Vercel project has no production deployment.** So even with the DB up, the apex
   won't serve `/members` until the redirect is removed (personal Vercel account)
   and a production deploy is promoted. The middleware redirect above only takes
   effect once the app is actually served on that host.

---

## Status & roadmap

**Done (merged in #2):** swipe −2…+2 rating, optimistic + offline queue, ranked
index, shrunk-mean scoring, progressive reveal, counters, kill switch, rate
limit, mobile-first.

**Done (this branch):**
- M1 — apex `ness.city` → `/members` in the app middleware (supersedes the old code-level optimism.fun redirect). ⚠ A separate **Vercel-edge** redirect still sends the live apex to optimism.fun until it's removed on the personal Vercel account — see "Current prod status" below.
- M2 — self-onboarding: signed-in users become rateable members (name + "what you're building"), no manual seeding.
- M3 — viral share/invite (Web Share + copy fallback) + milestone prompt after N ratings.
- M4 — core-team dashboard (full ranked table, mean/median/count/raters) + CSV export + view logging.

**Left for beta-ready (M5) + next:**
- Smoke-test dashboard + CSV live; touch-test the swipe gesture on a phone.
- Consider: photo/avatar on cards; "rate 5 to unlock rankings" hard gate; weekly nudge for new members; reciprocal-pair abuse flagging (data supports it).
- Future: real PageRank crawl over the rating graph (schema supports it); pairwise ELO (Facemash-style) as an alternate input; tenure/recency weighting (fields exist).
