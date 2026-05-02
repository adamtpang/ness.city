# Ness · `ness.city`

The civic layer for builders. Open-source tooling for ambitious communities.

> **Independent project.** Not affiliated with Network School (ns.com). Ness is its own brand and operates separately.

## What it is

Ness is a portfolio of small, opinionated tools for community-driven cities:

- **Townhall** (live UI). Civic layer. Problems become bounties become fixes. Solvers earn karma. Patrons earn attribution.
- **Jobs** (live, hand-curated). Public openings filtered by category. Direct apply links.
- **PageRank** (live UI). Map your ring in doubling rounds. Social PageRank surfaces who the city named most.
- **Match** (in design). Drop a resume, get the 80%+ matches across jobs and bounties.
- **Market** (planned). Products / services / assets. Consolidates `nsmarket.app` and `redmart.xyz`.

## The five-step engine (Townhall)

1. **Surface**. Anyone files a problem with a real diagnosis. (+5 karma.)
2. **Explain**. The community refines the root cause.
3. **Propose**. A citizen drafts a concrete fix.
4. **Bounty**. Patrons crowdfund the proposal in USDC on Base.
5. **Ship**. A solver claims, ships, documents. (+25 karma + the bounty + permanent attribution for the patrons.)

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- TailwindCSS 3 · Framer Motion
- Inter (body) + Instrument Serif (display) via `next/font/google`
- Deployed on Vercel
- Backend (in progress): Vercel Postgres, USDC on Base for bounty payouts

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Env vars

- `GITHUB_FEEDBACK_TOKEN` — GitHub PAT with `Issues: write` on this repo. Powers the feedback widget that files issues into `adamtpang/ness`.

## Bigger picture

ness.city is one node in **interneta.world**, Adam Pang's vision for the next evolution of the West, built on the [Network State](https://thenetworkstate.com) thesis.

## Contributing

The repo is public. The merge button isn't. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE).
