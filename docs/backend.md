# Backend setup (10 minutes)

The backend rails are in. To turn them on you need to provision a Postgres
database and add one env var. That's it.

## What's already wired

- **Drizzle ORM** with a typed schema (`lib/db/schema.ts`) covering citizens,
  problems, proposals, bounties, pledges, documentation, pagerank_rings,
  and feedback.
- **`POST /api/problems`** writes a real problem to the database, awards
  the reporter +5 karma, and creates the citizen record if needed.
- **`GET /api/problems`** returns the latest 50 problems.
- **`GET /api/health`** returns DB reachability + row counts. Hit this
  after each deploy to confirm everything is alive.
- **`POST /api/feedback`** still logs to Vercel function logs and the
  optional Discord webhook, *and* persists to the `feedback` table when
  the DB is configured.

The frontend forms still write to `localStorage` for v0.9. Wiring them to
the real API ships in v1.0 once you confirm the backend is alive.

## Setup steps (Adam)

1. **Provision Vercel Postgres.**
   - Go to your Ness project on Vercel.
   - Click **Storage** → **Create Database** → **Postgres**.
   - Pick the closest region (probably Singapore, `sin1`).
   - Vercel auto-injects `DATABASE_URL` (and `POSTGRES_URL`) into the project's env vars.

2. **Push the schema** (one time, locally).
   - Pull the env vars locally:
     ```bash
     npx vercel env pull .env.local
     ```
   - Push the schema to the new database:
     ```bash
     npm run db:push
     ```
   - You should see Drizzle create 8 tables and several enums.

3. **Redeploy** (the running deployment doesn't auto-pick up the new env
   vars, so trigger a fresh deploy):
   ```bash
   git commit --allow-empty -m "redeploy after Postgres provisioning" && git push
   ```
   Or click "Redeploy" in the Vercel dashboard.

4. **Verify**:
   ```bash
   curl https://ness.city/api/health
   ```
   You should see `db.configured: true`, `db.reachable: true`, and zero
   counts across the board. Send some test data:
   ```bash
   curl -X POST https://ness.city/api/problems \
     -H 'Content-Type: application/json' \
     -d '{
       "title": "Test problem from Adam",
       "summary": "Backend smoke test.",
       "rootCause": "Provisioning Vercel Postgres.",
       "category": "infra",
       "reporterDisplayName": "Adam Pang",
       "reporterHandle": "adam"
     }'
   ```
   You should get back the new problem with a slug, plus `karmaAwarded: 5`.
   Re-hit `/api/health` and watch the counts increment.

## Local dev

After pulling env vars (`npx vercel env pull .env.local`), you can:

```bash
npm run dev          # runs Next on http://localhost:3000
npm run db:studio    # opens Drizzle Studio on http://localhost:4983
npm run db:generate  # generates a migration from schema changes
```

If you change `lib/db/schema.ts`, run `npm run db:push` to sync the new
schema (or `npm run db:generate` to write a migration first, more careful).

## What's intentionally NOT done yet

- **Auth.** No Clerk, no NextAuth, no NS Directory SSO. Posts carry a
  display name + handle. Trust the early cohort. Add real auth in v1.0
  when we have something worth gating.
- **Frontend ↔ backend wiring.** The submit form, pledge button, claim
  button still read/write `localStorage`. They'll move to the API in
  v1.0, once you confirm `/api/health` returns green.
- **USDC pledging.** The `pledges.txHash` column exists for when wallet
  flow ships. For now, `amountCents` is the source of truth.
- **PageRank computation.** The `pagerank_rings` table stores the
  per-citizen ring data, but the iteration job hasn't been built. v1.0.

## When in doubt

`curl https://ness.city/api/health` is the source of truth.
