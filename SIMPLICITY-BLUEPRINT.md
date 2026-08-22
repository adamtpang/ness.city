# Simplicity blueprint — the radically simple version of ness.city

One sentence: if ness.city did exactly one thing perfectly, an NS community
member with a real unsolved problem could file it, watch it get refined into
a fundable proposal, and see it actually shipped, and walk away trusting
that surfacing a problem here is worth their time.

## The one user

An NS community member with a real, specific, unsolved problem, not a
browsing visitor, not a patron, not a solver-for-hire, that person's need
matters too but is served through the same loop, not a separate one.

## The core loop

This is not invented here, it's the site's own README, verbatim structure,
already named the canonical shape:

1. Surface — file a real problem with a diagnosis
2. Explain — the community refines the root cause
3. Propose — a citizen drafts a concrete fix
4. Bounty — patrons crowdfund the proposal
5. Ship — a solver claims, ships, documents

Done when: a stranger can open `/townhall`, file a real problem, and later
find it refined into a proposal with a live bounty, without reading any
docs first.

## The minimum effective feature set

- `/townhall`, `/townhall/new`, `/townhall/[slug]` — IS the loop, steps 1-3 and the thread all 5 steps live on.
- Bounty/payment rail (USDC on Base, per README, "in progress" as of the last read) — without it, step 4 doesn't exist and the loop stops at 3.
- Minimal citizen identity (who filed, who proposed, karma) — without it, step 5's "+25 karma + permanent attribution" has nothing to attach to.

That's it. Three things. Everything else on the live site today sits outside
this loop.

## What this deliberately is NOT (the cut list)

Real inventory, from the actual build output and route tree, not a guess:

- `/pagerank`, `/members`, `/members/dashboard`, `/members/rate` (social rings, roster ratings) — NOT YET. Real and built, but it's a trust layer ON TOP of the loop, not the loop itself. Trigger: once Townhall itself shows repeat use, per NORTH_STAR.md's own binding constraint.
- `/events`, `/food` (native boards) — NOT YET. Genuinely useful community surfaces, but not the problem-to-fix loop. Same trigger as above.
- `/games`, `/minecraft` — NOT YET. Community-play, unrelated to the loop's promise.
- `/match` — NOT YET. README already labels this "in design," never shipped.
- `/kpi`, `/pulse`, `/roadmap`, `/changelog` — NOT YET as core-loop features, but keep as communication surfaces regardless (they explain the loop to newcomers, small footprint, low cost to keep).
- `/fellowship-prep`, `/kz-mou` — NEVER cut, but also never core-loop: these are informational/community-service pages hosted here for reach, not part of the Surface-Propose-Bounty-Ship promise. Fine to keep, just be honest they're a different job.
- `/guide`, `/join`, `/join/list` — NOT YET as separate surfaces. Onboarding should point straight at `/townhall`, not fork into a parallel guide flow, unless evidence shows the guide is what converts visitors into filers.
- `/mdac`, `/routers`, `/whatsapp`, `/tools`, `/tools/routermill` — **UNCLEAR, need Adam's confirmation.** These are real, substantially built pages (213-543 lines each) but their names don't map to the civic loop and this pass didn't read their full content. Before cutting or keeping, confirm: do any of these actually feed Townhall (e.g. a WhatsApp bridge for filing problems), or are they standalone utilities that drifted in? If standalone, NOT YET, same trigger as above.
- `/os`, `/points` — literal "Coming soon" stubs, zero content. NEVER, until there's a real reason, these are placeholders with no loop connection today.
- `/nslink`, `/solve` — not surfaces at all, just redirects to `/routers` and `/townhall`. No action needed, these are correctly invisible already.

## The "if it worked" bar

A person who has never seen ness.city can land on `/townhall`, file a real
problem in under 2 minutes, and later see it moved to a proposal with a
live bounty, with zero explanation needed.

## Blueprint notes (2026-08-15)

Built from the real route tree (last `npm run build` output), README's own
stated 5-step engine, and NORTH_STAR.md's binding constraint ("evidence of
retention on the Townhall loop, not more surfaces, prove repeat use before
Match/Market expansion") — that constraint already said exactly what this
blueprint is now formalizing. This pass did NOT read `/mdac`, `/routers`,
`/whatsapp`, `/tools/routermill` in full, they're flagged unclear rather
than cut, to avoid inventing a reason either way. First draft, not yet
confirmed with Adam, the one-user framing and the unclear-four routes both
need his eyes before this is settled.
