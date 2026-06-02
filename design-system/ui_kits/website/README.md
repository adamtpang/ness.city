# Ness — Website UI kit

A high-fidelity, interactive recreation of **ness.city**, the open-source community
coordination platform. Built from the real source
(github.com/adamtpang/ness.city), not from screenshots.

Open **`index.html`** for the full click-through. It boots on the brand landing; use
the header nav (or the hero / room buttons) to move between surfaces.

- **Surfaces recreated**
- **Home** (`Home.jsx`) — the brand landing. "Loch in." hero with the Nessie figure,
  the Forest City vision strip, the dark Nessie-agent teaser, and the "every room"
  grid (live tags, hover lift). Room cards for Market and Forum are wired to navigate.
- **Market** (`Market.jsx`) — the community marketplace. Stat pills, sticky filter
  strip (All / For sale / Free / Wanted with live counts and the morphing active pill),
  the listing-row + reply-dialog components, the post/etiquette CTA pair, and the real
  empty state. **Ships with no listings by design** — see "Real data only" below.
- **Forum** (`Forum.jsx`) — Townhall. Problem-card + bounty-bar + status-filter +
  "propose/pledge" dialog components, plus the genuine empty state. **No seeded
  problems**, same principle.
- **Placeholder** — rooms that exist in the product but aren't recreated (Roadmap,
  Citizens) are shown honestly blank rather than invented.

## Chrome & primitives

- **`Chrome.jsx`** — `LiveBackground` (drifting blue loch orbs), the dismissible blue
  `NewsBanner`, the sticky `Header` (🦕 wordmark, nav, context-aware Post/Surface
  button), and the mono `Footer`.
- **`components.jsx`** — shared primitives and all seed data: `NessieLogo` (exact source
  path data), `Avatar` (seeded-tint initials), `Dot`, `Chip`, `Stat`, `FadeIn`, plus the
  `LISTINGS`, `PROBLEMS`, and `ROOMS` data.
- **`kit.css`** — every component style, built on the tokens in
  `../../colors_and_type.css`.

## How it's wired

Plain React 18 + in-browser Babel (pinned). Each `.jsx` file transpiles in its own
scope and exports to `window` via `Object.assign(window, {...})`; `index.html` holds a
tiny `useState` router (`go(route)`) and renders the active screen. No build step — open
the file and it runs.

## Real data only

This is a deliberate brand decision, lifted straight from the product source
(`app/market/page.tsx`): *"Real listings only. No seed, no fake data. An empty market is
honest; the founders post the first real things."* So the Market and Forum ship **empty**,
showing the genuine designed empty states. The components (listing row, problem card,
bounty bar, reply/pledge dialogs, filters, stat pills) are all built and styled — they
simply render when real content exists. To preview a populated state, push real items
into `LISTINGS` / `PROBLEMS` in `components.jsx`.

## Notes & liberties

- Motion is simplified to CSS (`cubic-bezier(0.22,1,0.36,1)` fades + hover lifts); the
  source uses Framer Motion with the same curve and a shared-element pill morph.
- Components are cosmetic recreations, not the production implementations.
- Brand art is reconstructed from the source's code-drawn SVG (the repo ships no raster
  assets). Swap in official files when they exist.
