---
name: ness-design
description: Use this skill to generate well-branded interfaces and assets for Ness (ness.city) — the open-source, bottom-up community coordination platform — either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, brand assets, and a UI kit of recreated ness.city components.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets
out and create static HTML files for the user to view. If working on production code,
you can copy assets and read the rules here to become an expert in designing with this
brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.

## What's here

- `README.md` — brand context, content fundamentals, visual foundations, iconography.
- `colors_and_type.css` — all tokens (color, type, radius, spacing, motion) + base
  classes. Import this in any artifact; it's the fastest way to be on-brand.
- `assets/` — Nessie logo / mark / mascot, hero illustrations, favicon (all SVG).
- `preview/` — small reference cards for color, type, spacing, components, brand.
- `ui_kits/website/` — interactive recreation of ness.city (landing, Market, Forum)
  with reusable React components. Start at its `README.md`.
- `source_reference/` — original imported source from github.com/adamtpang/ness.city.

## The one-paragraph brief

Ness reads like a **printed broadsheet run by builders**: honest, dense, hand-made.
Black ink (`#0a0a0a`) on warm paper (`#fbfaf7`). **Instrument Serif** for every headline
(sentence case, often ending in a period), **Inter** for body, **mono** for UPPERCASE
`0.18em` labels. One action accent — **Nessie blue `#2563eb`**; green for resolved.
Flat surfaces, hairline `#e5e5e5` borders, `rounded-2xl` cards, `rounded-full` pills,
no shadows. One motion curve: `cubic-bezier(0.22,1,0.36,1)`, fade-and-rise. No icon
font — status is colored dots, directions are unicode glyphs, avatars are seeded
initials, and 🦕 is the brand glyph. Copy is concrete and specific; never lorem.
**Catchphrase: "Loch in."**
