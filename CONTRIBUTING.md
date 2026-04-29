# Contributing to Ness

Ness is open source, but the merge button isn't.

This is intentional. The repo is public so anyone can read, fork, suggest, and learn. Pull requests to `main` are reviewed and merged by Adam (`@adamtpang`). PRs from outside collaborators are welcome and will be considered on the same bar as internal ones: clarity, correctness, taste.

## How to contribute

1. **Fork** the repo.
2. **Branch** from `main`. Use a descriptive name like `feat/atlas-graph-renderer` or `fix/submit-form-validation`.
3. **Build and test** locally. Run `npm install && npm run build`. The build must pass.
4. **Open a PR** against `adamtpang/ness:main`. In the description, include:
   - What problem this solves (link to a Ness problem if there is one)
   - Why this approach
   - What you tested
5. **Adam reviews and merges.** Expect a response within a few days.

## What we want

- Bug fixes for the live tool (Townhall)
- Small, opinionated improvements to existing components
- Genuine accessibility improvements
- Typography, motion, and copy polish that aligns with the editorial design language
- Implementations of planned tools (Atlas, Jobs, Market) — coordinate with Adam first

## What we don't want

- Wholesale rewrites or framework swaps (no, we're not moving off Next.js)
- Em dashes anywhere (project preference, see CLAUDE.md or just don't use them)
- Net-new features without a problem on Townhall to back them
- Dependencies for things we can do in 20 lines of code

## Branch protection

`main` is protected. Direct pushes are blocked. PRs require:
- A passing build
- Adam's review and merge

If you're cloning to deploy your own fork, fork and remove the `vercel.json` / change the project name. The `ness.city` domain is not transferable.

## Reporting issues

Use [GitHub Issues](https://github.com/adamtpang/ness/issues). The feedback widget on the live site files there too.

Tag with the right label:
- `bug` for things that don't work
- `feature` for new ideas
- `feedback` for general impressions (auto-applied by the widget)
- `tool:atlas`, `tool:jobs`, `tool:market` for tool-specific work

## Code style

- TypeScript strict mode
- Components live in `components/`. Pages in `app/`. Data and helpers in `lib/`.
- Tailwind for styling. Use the design tokens in `tailwind.config.ts` (`ink-*`, `paper`, etc.) instead of arbitrary hex.
- Framer Motion for motion. Use the existing `FadeIn` / `Stagger` primitives where possible.
- One blank line between logical blocks. No em dashes.

## License

[MIT](LICENSE). Contributions are accepted under the same license.
