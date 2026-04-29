# Ness · `ness.city`

The community platform for **Network School**. Open-source tooling for an open-source community.

> **Unofficial NS.** An A3 app built at Network School. Not owned, funded, or endorsed by NS0 PTE LTD.

## What it is

Ness is a portfolio of small, opinionated tools for NS members:

- **Townhall** (live UI). Civic layer. Problems become bounties become fixes. Solvers earn karma. Patrons earn attribution.
- **Atlas** (in design). Social PageRank. Map the relationships in the city.
- **Jobs** (planned). Discord hiring board, structured.
- **Market** (planned). Products / services / assets. Consolidates `nsmarket.app` and `redmart.xyz`.

## The five-step engine (Townhall)

1. **Surface**. Anyone files a problem with a real diagnosis. (+5 karma.)
2. **Explain**. The community refines the root cause.
3. **Propose**. A citizen drafts a concrete fix.
4. **Bounty**. Patrons crowdfund the proposal in USDC.
5. **Ship**. A solver claims, ships, documents. (+25 karma + the bounty + permanent attribution for the patrons.)

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- TailwindCSS 3 · Framer Motion
- Inter (body) + Instrument Serif (display) via `next/font/google`
- Deployed on Vercel
- Backend (in progress): Vercel Postgres, USDC on Base for bounty payouts, Discord exports for Jobs

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Env vars

- `GITHUB_FEEDBACK_TOKEN` — GitHub PAT with `public_repo` scope. Powers the feedback widget that files issues into this repo.

## Bigger picture

ness.city is one node in **interneta.world**, Adam Pang's vision for the next evolution of the West, built on the [Network State](https://thenetworkstate.com) thesis.

## Contributing

The repo is public. The merge button isn't. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE).
