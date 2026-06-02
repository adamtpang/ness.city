# Ness Design System

> The civic layer for builders. **Loch in.**

This is a design system for **Ness** (`ness.city`) — an open-source, bottom-up
coordination platform for an ambitious builder community (Network-School-shaped).
Marketplace, problem-solving forum, social graph, public roadmap — all in one repo,
free and MIT-licensed.

It exists so a design agent can generate on-brand interfaces, mockups, slides, and
prototypes that look and feel exactly like Ness, using the real tokens, type, motion,
voice, and components pulled straight from the product source.

---

## Source

Everything here was reverse-engineered from the live codebase:

- **GitHub:** https://github.com/adamtpang/ness.city — the Next.js + Tailwind app.
  Worth exploring further to build higher-fidelity designs. Key files used:
  - `tailwind.config.ts` — the entire color + font + tracking token set
  - `app/globals.css` — base type, `.serif`, `.divider`, motion keyframes
  - `app/design/page.tsx` — **the team's own living `/design` reference page** (the
    single best source: documents color, type, space, icons, buttons, inputs, pills,
    cards, rows, motion with real markup)
  - `app/page.tsx` (landing), `app/market/page.tsx` (Market), `components/*` (Header,
    NewsBanner, Avatar, StatusBadge, ProblemCard, ToolCard, NessieLogo), `lib/*` (data)
- **Other channels referenced in-product:** Discord (`discord.gg/fNmdFWcMU`),
  `interneta.world`.

> **Independent project.** Ness is its own brand and is *not affiliated with any
> specific community.* The product copy makes this explicit.

The imported reference source lives in `source_reference/` if you want to read the
originals. Don't ship those `.tsx` files — they're orientation only; build from the
HTML/CSS here.

---

## What Ness is

Nine "rooms," most of them live:

| Room | What it does | Status |
|------|--------------|--------|
| **The Market** | Buy / sell / give / find, locally. Craigslist with real handles. | live |
| **The Forum** (Townhall / `/solve`) | File a problem → propose a fix → patrons pledge USDC → ship & get paid. | live |
| **The Roadmap** | Living public roadmap, Eisenhower-prioritized, one owner per row. | live |
| **PageRank** | Social PageRank — map your ring, see who the city named most. | live |
| **Pulse** | Community analytics: skills, interests, ideas, apps. | live |
| **Citizens** | Two leaderboards: solver karma · patron pledged. | live |
| **The Guide** | Honest independent guide to Network School. | live |
| **nslink** | Snap a stack of routers → get a CSV the bot can run. | live |
| **Nessie** | The 24/7 AI community coordinator (agent). | coming |

The mascot is **Nessie** — the Loch Ness monster, drawn as a single hand-made line
(`assets/nessie-logo.svg`). The catchphrase **"Loch in"** puns on it.

---

## CONTENT FUNDAMENTALS

The voice is a **printed broadsheet run by builders** — honest, dense, specific, a
little wry. Never enterprise SaaS, never breathless marketing.

**Three governing principles (verbatim from the source):**
- **Real over polished** — "Plausible names, real prices, hand-typed labels. Avoid
  stock-photo gloss."
- **Dense, not crowded** — "Information per square inch is high. Break density only
  with serif headings and generous vertical rhythm."
- **Quiet color** — "Black, white, warm paper. Blue for actions. Green for resolved.
  Everything else earns its place."

**Voice & mechanics**
- **Person:** Second person to the reader ("Surface your problem", "Got something to
  sell?"), first-person plural for the project ("if we build it together"). The
  community is "the city" / "citizens".
- **Casing:** Headlines are **sentence case**, often ending in a period — they read
  like statements, not labels ("Buy & sell, locally.", "What Forest City becomes if we
  build it together."). System labels are **lowercase or UPPERCASE mono**
  (`ness.city · v0.16`, `STEP 2 · SUBMIT YOUR RING`, `back to the city`).
- **Length:** Short. A headline, one tight supporting paragraph (~2 sentences), then
  get out of the way. Bullet lists use a leading "· " middot, not standard bullets.
- **Specificity:** Numbers and proper nouns are concrete and plausible — "$4,800",
  "38k km", "B2-12, June–November", "@marcus". Never lorem, never "Lorem listing #3".
- **Honesty as a feature:** Empty states say so plainly ("Nothing's listed yet." / "An
  empty market is honest; the founders post the first real things."). Version stamps,
  MIT license, and "Built bottom-up" sit in the footer.
- **Wit, dry and sparse:** "No bulk peanut butter limits.", "best seed is no seed."
  Used once per surface, never cute.
- **Emoji:** Essentially one — **🦕** as the brand glyph (header lockup + the Nessie
  agent block). Not used decoratively anywhere else. Treat 🦕 as a logo, not an emoji.

**Tone examples**
- Hero: *"Loch in."* → *"The bottom-up coordination platform for the community.
  Marketplace, problem-solving forum, social graph, all in one repo. Free, public, MIT."*
- Etiquette card: *"· Real names. Real prices. Real photos when you can. · Mark sold or
  claimed quickly. Keeps the feed fresh. · Pay each other in USDC, cash, or the Costco order."*
- CTA: *"Surface it →"*, *"Open the market →"*, *"Submit your ring →"*

---

## VISUAL FOUNDATIONS

**Mood.** Black ink on warm paper, like risograph stationery. Flat, hairline-ruled,
typographic. Warmth comes entirely from the serif headlines and the off-white paper —
not from color, shadow, or illustration.

**Color.** Five families, used quietly (full scales in `colors_and_type.css`):
- **Ink** `#0a0a0a → #fafafa` carries all type and structure. Body is `ink-950`,
  secondary `ink-500`, hairlines `ink-200`/`ink-100`.
- **Paper** — `#ffffff` (cards) / `#fbfaf7` warm (canvas) / `#f7f6f3` tint (alt rows).
- **Nessie blue** — the one action accent (`nessie-600 #2563eb`): news banner fill,
  brand square, link affordances, the background "loch".
- **Garden green** (`#22c55e`/`#15803d`) — resolved states, growth, "live" dots.
- **Signal** — four state colors used *only as 1.5px dots*: open (grey), investigating
  (amber `#b45309`), in-progress (blue `#1d4ed8`), solved (green `#15803d`). Note: the
  shipped components often reach for Tailwind defaults (`amber-500`, `blue-500`,
  `emerald-600`) for these dots — both are "correct"; the dot is what matters.

**Type.** Two faces do everything (see `colors_and_type.css` for the ramp):
- **Instrument Serif** (weight 400, `-0.022em` tracking) — *every* headline, hero to
  card title. Italic is the accent. This is the soul of the brand.
- **Inter** — all body, captions, UI text. Workhorse.
- **System mono** — meta + labels, almost always `UPPERCASE` with `0.18em` tracking at
  10–12px. This is "the system label size."

**Spacing & layout.** Tailwind's 4px step. Content sits in a centered column
(`max-w-4xl`/`max-w-5xl`/`max-w-6xl`, `px-5`). Generous vertical rhythm between sections
(`mt-20`+). Density lives *inside* cards and rows. Local nav and filter strips are
**sticky** with `bg-paper/85` + `backdrop-blur-md`.

**Backgrounds.** Almost always plain paper. The landing has a subtle **LiveBackground**:
two slow-drifting translucent blue gradient orbs + a faint animated wave at the very
bottom, sitting *behind* everything at low opacity (the "loch"). No photographic
backgrounds, no full-bleed imagery, no repeating patterns. Imagery, when present, is a
single framed figure (Nessie line-art, a solarpunk skyline placeholder) inside a
`rounded-2xl` `paper-tint` frame with a mono caption bar.

**Borders & cards.** This is the whole structural system:
- Every card: `rounded-2xl` (16px) + `1px solid ink-200`. **No shadow by default.**
- Inner hairlines / dividers inside a card: `ink-100`.
- Empty states: **dashed** `ink-300` border on `paper-tint`, centered, serif headline.
- CTA cards flip to solid `ink-950` fill with `paper` text.
- The soft gradient `.divider` separates major sections.

**Corner radii.** `rounded-2xl` (16px) for cards, `rounded-3xl` (24px) for big hero CTA
blocks, `rounded-xl` (12px) for inputs and inner panels, `rounded-full` for every
button, pill, chip, and avatar. Consistent and soft.

**Shadows / elevation.** Effectively none. Ness is a flat, ruled surface — structure is
borders, not depth. Reserve a faint shadow for modals/popovers only (`--shadow-modal`).
No inner shadows, no glow.

**Buttons.** Three weights, pill by default, square (`rounded-xl`) for inline forms:
- **Primary** — `bg-ink-950 text-paper`, hover `bg-ink-800`. Usually trails a `→`.
- **Secondary** — `border-ink-200 bg-paper`, hover `border-ink-950`.
- **Ghost** — text only, `ink-600 → ink-950` on hover; or a mono micro-link with `↗`.
- **On dark** — invert: `bg-paper text-ink-950`.

**Inputs.** Quiet by default, loud on focus: `border-ink-200`, `focus:border-ink-950`,
**no focus ring**, placeholder `ink-400`. On dark: `bg-ink-900` + `border-ink-700`,
`focus:border-paper`.

**Motion.** One curve, everywhere: **`cubic-bezier(0.22, 1, 0.36, 1)`** at **0.6–0.7s**
for fade-ins (always *fade + rise from below*, ~6–14px). Lists stagger their children.
Filter pills morph between selections with a shared-element spring
(`stiffness 400, damping 32`). The header logo 🦕 wobbles on hover (spring `300/15`).
Hover lift on cards/rooms is a tiny `translateY(-2px)`. Everything respects
`prefers-reduced-motion`. No bounces, no parallax, no scroll-jacking.

**Hover / press states.** Hover = darker ink (buttons), border darkening to `ink-950`
(secondary/cards), opacity drop (`hover:opacity-90` on inverted), or `-2px` lift.
Links use `underline` on hover with `underline-offset-2`. No dedicated press/active
shrink in the source — keep presses subtle.

**Transparency & blur.** Used in exactly two places: sticky bars (`bg-paper/85` +
`backdrop-blur-md`) and the LiveBackground orbs (low-opacity blue). Otherwise surfaces
are opaque.

**Imagery vibe.** Cool, optimistic, hand-made. Brand figures are single-stroke ink
line-art (Nessie) or flat solarpunk illustration (blue + green + warm sun). No
photography in the chrome; user photos appear only inside listings/avatars when real.

---

## ICONOGRAPHY

**Ness deliberately avoids an icon font and avoids large SVG icon sets.** From the
team's own `/design` page: *"No icon font. Glyphs and dots only."* Three mechanisms
carry all "iconography":

1. **Status dots** — a `6px` (`h-1.5 w-1.5`) `rounded-full` colored dot is the primary
   status/category indicator across problems, listings, bounties, and rooms. The color
   is the meaning; a text label sits beside it.
2. **Unicode glyphs** — directional and action cues are plain characters, usually
   `aria-hidden`, set in the body or mono font:
   `→` next · `←` back · `↗` external · `↓` expand/reply · `↵` submit · `·` separator ·
   `×` remove/dismiss · `▾` menu.
3. **Avatars = initials** — no photos by default. One or two initials on a seeded tinted
   circle, `ring-1 ring-paper`. The tint is picked deterministically from the handle out
   of an 8-color palette (`#1f2937, #7c2d12, #365314, #831843, #1e3a8a, #581c87,
   #0c4a6e`). See `ui_kits/website/Avatar.jsx` and the Brand cards.

**The two exceptions (use them, but sparingly):**
- **🦕 emoji** is the brand glyph — header lockup and the Nessie agent block only.
  Treat it as the logo, not decoration.
- **Tiny hand-drawn inline SVG line glyphs** appear on the homepage **ToolCard**s
  (townhall / atlas / jobs / market), `20×20`, `stroke-width 1.6`, `currentColor`, in a
  `36px` rounded-square chip. These are bespoke, not from a library.

**Logos / brand marks** (all in `assets/`, all single-color `currentColor` line-art so
they inherit ink/paper):
- `nessie-logo.svg` (44×28) — the primary Nessie line mark + ripple.
- `nessie-mark.svg` (28×28) — compact square mark.
- `nessie-mascot.svg` / `nessie-mascot-blue.svg` (120×80) — friendlier filled mascot
  for merch / agent avatar slots.
- `nessie-silhouette.svg`, `solarpunk-vision.svg` — the two framed hero illustrations
  from the landing page.
- `icon.svg` — the favicon: a `nessie-600` rounded square with 🦕.
- Wordmark: **"ness.city"** set in Instrument Serif, with `.city` in `ink-400`.

> **Substitution flag:** the repo ships no raster assets — all brand art is code-drawn
> SVG (the `NessieLogo`/`NessieMascot` React components and the landing-page placeholder
> SVGs). The `assets/*.svg` files here are faithful extractions of that exact path data,
> not redrawn approximations. **Fonts** (Inter, Instrument Serif) are pulled from Google
> Fonts, matching the source app's `next/font/google` setup.

---

## Index — what's in this folder

- **`README.md`** — this file. Brand context, content + visual foundations, iconography.
- **`SKILL.md`** — Agent-Skill manifest; read it first if you're an agent.
- **`colors_and_type.css`** — all CSS variables (color, type, radius, spacing, motion)
  + base type classes (`.serif`, `.label`, `.divider`, etc). Import this in any artifact.
- **`assets/`** — brand SVGs: Nessie logo / mark / mascot, hero illustrations, favicon.
- **`preview/`** — the Design System cards (color, type, spacing, components, brand).
- **`ui_kits/website/`** — high-fidelity recreation of the ness.city marketing + product
  site (landing, Market, Forum). `index.html` is an interactive click-through; the
  `.jsx` files are reusable components. Start at its `README.md`.
- **`source_reference/`** — the imported original `.tsx`/`.ts`/`.css` files for deeper
  reading. Reference only.

**No slide template was provided in the source, so `slides/` is intentionally omitted.**
