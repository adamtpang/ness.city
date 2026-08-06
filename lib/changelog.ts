/**
 * The public changelog. Every entry is a real, deployed commit, pulled
 * directly from git history (the `vX.Y: description` convention this repo
 * has used since v0.3). Nothing here is written for the changelog; the
 * changelog just surfaces what already shipped, in order.
 *
 * To add an entry: make a real commit titled `vX.Y: what changed`, then add
 * the matching row here with today's date. Don't add a row for something
 * that hasn't shipped.
 */
export type ChangelogEntry = {
  date: string; // YYYY-MM-DD
  version: string;
  tag?: string;
  description: string;
};

export const CHANGELOG: ChangelogEntry[] = [
  { date: "2026-08-06", version: "0.70", description: "nskpi.com revived as the Civic Protocol registry dashboard; /civic explains the protocol" },
  { date: "2026-08-02", version: "0.69", description: "the Civic Protocol (MIT): /.well-known/civic.json discovery, node/people/problems/events endpoints, consent-gated by design" },
  { date: "2026-08-02", version: "0.68", description: "anonymous rating beta, roster privacy gate (rate 3 to browse), and the 'Where next' continuity map" },
  { date: "2026-07-19", version: "0.67", tag: "#3", description: "front-door redirect to the member index, self-onboarding, share loop, core dashboard" },
  { date: "2026-07-19", version: "0.67", tag: "#2", description: "member rating index at /members: swipe buckets, ranked social index" },
  { date: "2026-07-02", version: "0.67", description: "real PageRank engine, people-first curation layer" },
  { date: "2026-06-12", version: "0.66", description: "/mdac fields mirror the live MDAC form exactly" },
  { date: "2026-06-11", version: "0.65", description: "real, persistent importance voting + honest single-list board" },
  { date: "2026-06-11", version: "0.64", description: "/mdac free tool (Malaysia Digital Arrival Card helper)" },
  { date: "2026-06-08", version: "0.63", description: "/games placeholder hub featuring Helen's Minecraft server, coming-soon until the host is filled in" },
  { date: "2026-06-08", version: "0.62", description: "run serverless functions in Singapore (sin1), next to the DB and the SE-Asia users" },
  { date: "2026-06-08", version: "0.61", tag: "fix", description: "home page 504 under load; raise the DB connection pool so concurrent queries don't pipeline onto one" },
  { date: "2026-06-07", version: "0.60", description: "one-click bot launchers + auto-find the CSV, no CLI needed" },
  { date: "2026-06-07", version: "0.59", description: "honest filing + checklist on the routers page" },
  { date: "2026-06-07", version: "0.58", description: "router scanner runs on Claude vision" },
  { date: "2026-06-07", version: "0.57", description: "move the router tool to ness.city/routers, no subdomain needed" },
  { date: "2026-06-07", version: "0.56", description: "routers tool polish for the Conor handoff" },
  { date: "2026-06-04", version: "0.55", description: "real-DB mode + admin delete" },
  { date: "2026-06-04", version: "0.54", description: "pipeline board columns: Problem, Priority, Solution, Bounty" },
  { date: "2026-06-04", version: "0.53", description: "/waitlist page + WhatsApp + real community board data" },
  { date: "2026-06-03", version: "0.52", tag: "preview", description: "New Problem modal degrades gracefully when the DB is unset" },
  { date: "2026-06-03", version: "0.51", tag: "preview", description: "richer quest board for the showcase" },
  { date: "2026-06-03", version: "0.50", tag: "preview", description: "QR-only /join CTA + Eisenhower quest board" },
  { date: "2026-06-03", version: "0.49", tag: "preview", description: "demo-mode board, auto-switches to live data once real problems exist" },
  { date: "2026-06-03", version: "0.48", tag: "preview", description: "waitlist CTA simplified to email + QR" },
  { date: "2026-06-03", version: "0.47", tag: "preview", description: "north-star KPI, anonymous-default problem privacy modes" },
  { date: "2026-06-03", version: "0.46.1", tag: "preview", description: "serve the /join QR as a static SVG" },
  { date: "2026-06-03", version: "0.46", tag: "preview", description: "/join waitlist with QR code" },
  { date: "2026-06-03", version: "0.45", tag: "preview", description: "promote the router tool to routers.ness.city" },
  { date: "2026-06-03", version: "0.44", tag: "preview", description: "agent write-path so the board can be worked 24/7" },
  { date: "2026-06-03", version: "0.43", tag: "preview", description: "Nessie interviews members and seeds the engine" },
  { date: "2026-06-03", version: "0.42", tag: "preview", description: "identity scaffold: email/wallet/Farcaster/Google, three privacy tiers" },
  { date: "2026-06-03", version: "0.41", tag: "preview", description: "Nessie conversational chat; nav stripped to logo" },
  { date: "2026-06-03", version: "0.40", tag: "preview", description: "compressed dashboard home, Patrons rail" },
  { date: "2026-06-02", version: "0.39", tag: "preview", description: "Nessie feedback interview: overall rating + learn/earn/burn/fun tracks" },
  { date: "2026-06-02", version: "0.38", tag: "preview", description: "home becomes the engine: hero, live KPIs, problem feed" },
  { date: "2026-06-02", version: "0.37", tag: "preview", description: "rename Forum to Townhall, Patron + Fixer naming" },
  { date: "2026-06-02", version: "0.36", description: "upvotes on forum issues" },
  { date: "2026-06-02", version: "0.35", description: "the Ness design system: tokens + warm-paper canvas" },
  { date: "2026-06-02", version: "0.34", description: "remove the Market, focus on Forum + Roadmap" },
  { date: "2026-06-01", version: "0.33", description: "reactions on issues: a toggle bar of emoji" },
  { date: "2026-06-01", version: "0.33.2", tag: "diagnostic", description: "roll back reactions to isolate a 500 error" },
  { date: "2026-06-01", version: "0.33.1", tag: "hotfix", description: "temporarily remove the reactions embed" },
  { date: "2026-05-28", version: "0.32", description: "comments on problem detail pages" },
  { date: "2026-05-28", version: "0.31", description: "/pulse, community analytics ported from nspulse (MIT)" },
  { date: "2026-05-28", version: "0.30", description: "mark-as-sold on /market" },
  { date: "2026-05-27", version: "0.29", description: "the original /roadmap goes live" },
  { date: "2026-05-26", version: "0.28", description: "landing polish, no broken-image flash" },
  { date: "2026-05-26", version: "0.27", description: "brand hero, vision strip, Nessie teaser" },
  { date: "2026-05-25", version: "0.26", description: "feedback routes to GitHub Issues" },
  { date: "2026-05-22", version: "0.25", description: "/solve as a real GitHub-Issues repo" },
  { date: "2026-05-21", version: "0.24", description: "restore the civic engine in nav" },
  { date: "2026-05-18", version: "0.23", description: "the Nessie logo" },
  { date: "2026-05-18", version: "0.22", description: "kill the seed data, real listings only" },
  { date: "2026-05-18", version: "0.21", description: "focus mode, marketplace MVP polish" },
  { date: "2026-05-18", version: "0.20", description: "ness.city/market goes live" },
  { date: "2026-05-18", version: "0.20.1", description: "Nessie mascot in the market hero" },
  { date: "2026-05-17", version: "0.19", description: "/guide SEO funnel" },
  { date: "2026-05-14", version: "0.18", description: "/design, design system reference" },
  { date: "2026-05-13", version: "0.17", description: "directory autocomplete on /pagerank" },
  { date: "2026-05-12", version: "0.16", description: "pre-public review pass, PageRank goes live" },
  { date: "2026-05-10", version: "0.15", description: "/market goes real, newcomer index" },
  { date: "2026-05-08", version: "0.14", description: "/whatsapp + /minecraft, plaza for interest groups" },
  { date: "2026-05-06", version: "0.13", description: "points calculator, info modals, map labels" },
  { date: "2026-05-06", version: "0.13", tag: "part 2", description: "/os, GitHub-style issue tracker" },
  { date: "2026-05-02", version: "0.12", description: "home becomes an illustrated clickable city" },
  { date: "2026-05-02", version: "0.11", description: "minimalist /solve, tournament concept on /pagerank" },
  { date: "2026-05-02", version: "0.10", description: "full Townhall flow live, end to end" },
  { date: "2026-05-02", version: "0.10", tag: "part 2", description: "live background, PageRank crawl explainer" },
  { date: "2026-05-02", version: "0.10", tag: "part 1", description: "the database wired, full API, submit form live" },
  { date: "2026-05-02", version: "0.9", description: "PageRank explainer, backend rails" },
  { date: "2026-05-02", version: "0.8", description: "PageRank ring builder" },
  { date: "2026-04-30", version: "0.7", description: "URL restructure, analytics" },
  { date: "2026-04-30", version: "0.6", description: "rebrand independent of NS, real Jobs board" },
  { date: "2026-04-29", version: "0.5", description: "feedback widget, open-source posture" },
  { date: "2026-04-28", version: "0.3", description: "first real-data platform" },
];
