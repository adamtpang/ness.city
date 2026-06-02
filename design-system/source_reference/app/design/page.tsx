"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/Avatar";

/**
 * /design — the Ness design system reference + scratch pad.
 *
 * This page exists to:
 *   1. Document every primitive (color, type, spacing, motion) in one place.
 *   2. Demonstrate every compositional pattern used elsewhere in Ness.
 *   3. Provide a scratch zone for new mockups (current resident: Ness Cafe).
 *
 * Tinker here freely; nothing on this page is imported elsewhere.
 */

const NAV = [
  { id: "brand", label: "Brand" },
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "space", label: "Space" },
  { id: "icons", label: "Icons" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "pills", label: "Pills" },
  { id: "cards", label: "Cards" },
  { id: "rows", label: "Rows" },
  { id: "motion", label: "Motion" },
  { id: "cafe", label: "Ness Cafe" },
];

export default function DesignPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-32 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      {/* Hero */}
      <FadeIn delay={0.04}>
        <header className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Design system · v0.17
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.02] text-ink-950 sm:text-[68px]">
            The grammar
            <br />
            <span className="italic">of Ness.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.6] text-ink-600 sm:text-[16px]">
            Every color, type ramp, spacing token, and component used across
            Ness lives on this page. It is a working reference and a scratch
            pad. The Ness Cafe mockups at the bottom show how the primitives
            compose into a new surface without inventing new ones.
          </p>
        </header>
      </FadeIn>

      {/* Sticky local nav */}
      <FadeIn delay={0.1}>
        <nav className="sticky top-16 z-30 mt-8 -mx-5 border-b border-ink-200 bg-paper/85 px-5 py-3 backdrop-blur-md">
          <ul className="flex flex-wrap items-center gap-1.5 text-[12px]">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="rounded-full px-3 py-1.5 text-ink-600 transition-colors hover:bg-paper-tint hover:text-ink-950"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </FadeIn>

      <Brand />
      <Color />
      <Type />
      <Space />
      <Icons />
      <Buttons />
      <Inputs />
      <Pills />
      <Cards />
      <Rows />
      <MotionPlay />
      <Cafe />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic section wrappers                                          */
/* ------------------------------------------------------------------ */

function Section({
  id,
  label,
  title,
  blurb,
  children,
}: {
  id: string;
  label: string;
  title: string;
  blurb?: string;
  children: React.ReactNode;
}) {
  return (
    <FadeInOnView>
      <section id={id} className="mt-20 scroll-mt-32 sm:mt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          {label}
        </p>
        <h2 className="serif mt-2 text-[34px] leading-[1.05] text-ink-950 sm:text-[44px]">
          {title}
        </h2>
        {blurb ? (
          <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.6] text-ink-600">
            {blurb}
          </p>
        ) : null}
        <div className="mt-8">{children}</div>
      </section>
    </FadeInOnView>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-ink-100 px-1.5 py-0.5 font-mono text-[11.5px] text-ink-800">
      {children}
    </code>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                          */
/* ------------------------------------------------------------------ */

function Brand() {
  return (
    <Section
      id="brand"
      label="Brand voice"
      title="Honest, dense, hand-made."
      blurb="Ness reads like a printed broadsheet. Serif headlines for warmth, monospaced labels for precision, ample whitespace, no skeumorphic flourish. The default mood is bottom-up community, not enterprise SaaS. Black ink on warm paper, with two accent palettes used sparingly."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Principle title="Real over polished" body="Plausible names, real prices, hand-typed labels. Avoid stock-photo gloss." />
        <Principle title="Dense, not crowded" body="Information per square inch is high. Break density only with serif headings and generous vertical rhythm." />
        <Principle title="Quiet color" body="Black, white, warm paper. Blue for actions. Green for resolved. Everything else earns its place." />
      </div>
    </Section>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <p className="serif text-[20px] leading-tight text-ink-950">{title}</p>
      <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">{body}</p>
    </div>
  );
}

function Color() {
  return (
    <Section
      id="color"
      label="Color"
      title="Five families, used quietly."
      blurb="Ink and paper carry the page. Signal colors mark state. Nessie blue and garden green are the only saturated accents."
    >
      <div className="space-y-7">
        <Family
          name="Ink"
          desc="The page's typography color. Defaults to ink-950 for body, ink-500 for secondary, ink-300 for hairlines."
          swatches={[
            ["ink-50", "#fafafa", "bg-ink-50"],
            ["ink-100", "#f5f5f5", "bg-ink-100"],
            ["ink-200", "#e5e5e5", "bg-ink-200"],
            ["ink-300", "#d4d4d4", "bg-ink-300"],
            ["ink-400", "#a3a3a3", "bg-ink-400"],
            ["ink-500", "#737373", "bg-ink-500"],
            ["ink-600", "#525252", "bg-ink-600"],
            ["ink-700", "#404040", "bg-ink-700"],
            ["ink-800", "#262626", "bg-ink-800"],
            ["ink-900", "#171717", "bg-ink-900"],
            ["ink-950", "#0a0a0a", "bg-ink-950"],
          ]}
        />
        <Family
          name="Paper"
          desc="Backgrounds. paper-warm is the canvas; paper-tint is the gentle alt-row."
          swatches={[
            ["paper", "#ffffff", "bg-paper border border-ink-200"],
            ["paper-warm", "#fbfaf7", "bg-paper-warm border border-ink-200"],
            ["paper-tint", "#f7f6f3", "bg-paper-tint border border-ink-200"],
          ]}
        />
        <Family
          name="Signal"
          desc="State indicators on problems, bounties, and rows. Used only as dot fills."
          swatches={[
            ["signal-open", "#737373", "bg-signal-open"],
            ["signal-investigating", "#b45309", "bg-signal-investigating"],
            ["signal-progress", "#1d4ed8", "bg-signal-progress"],
            ["signal-solved", "#15803d", "bg-signal-solved"],
          ]}
        />
        <Family
          name="Nessie"
          desc="The accent blue. Used for the loch in the background, the Discord button, and link hover affordances."
          swatches={[
            ["nessie-50", "#eff6ff", "bg-nessie-50"],
            ["nessie-100", "#dbeafe", "bg-nessie-100"],
            ["nessie-200", "#bfdbfe", "bg-nessie-200"],
            ["nessie-400", "#60a5fa", "bg-nessie-400"],
            ["nessie-500", "#3b82f6", "bg-nessie-500"],
            ["nessie-600", "#2563eb", "bg-nessie-600"],
            ["nessie-700", "#1d4ed8", "bg-nessie-700"],
            ["nessie-800", "#1e40af", "bg-nessie-800"],
            ["nessie-900", "#1e3a8a", "bg-nessie-900"],
            ["nessie-950", "#172554", "bg-nessie-950"],
          ]}
        />
        <Family
          name="Garden"
          desc="The accent green. Used for solved states, completed rings, and growth charts."
          swatches={[
            ["garden-50", "#f0fdf4", "bg-garden-50"],
            ["garden-100", "#dcfce7", "bg-garden-100"],
            ["garden-200", "#bbf7d0", "bg-garden-200"],
            ["garden-400", "#4ade80", "bg-garden-400"],
            ["garden-500", "#22c55e", "bg-garden-500"],
            ["garden-600", "#16a34a", "bg-garden-600"],
            ["garden-700", "#15803d", "bg-garden-700"],
            ["garden-800", "#166534", "bg-garden-800"],
            ["garden-900", "#14532d", "bg-garden-900"],
          ]}
        />
      </div>
    </Section>
  );
}

function Family({
  name,
  desc,
  swatches,
}: {
  name: string;
  desc: string;
  swatches: [string, string, string][];
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="serif text-[22px] text-ink-950">{name}</h3>
        <p className="max-w-md text-right text-[12px] leading-[1.5] text-ink-500">
          {desc}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
        {swatches.map(([label, hex, cls]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className={`h-14 rounded-lg ${cls}`} aria-hidden />
            <div className="font-mono text-[10px] leading-tight text-ink-700">
              {label}
            </div>
            <div className="font-mono text-[9.5px] uppercase leading-tight text-ink-400">
              {hex}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Type() {
  return (
    <Section
      id="type"
      label="Typography"
      title="Serif for soul, sans for speed."
      blurb="Instrument Serif handles every headline. Inter does the rest. Mono with wide tracking marks meta and labels. Use the .serif class to opt in."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Serif · Instrument Serif</SubLabel>
          <p className="serif mt-4 text-[64px] leading-[1.02] text-ink-950">
            Headline 64
          </p>
          <p className="serif mt-3 text-[44px] leading-[1.05] text-ink-950">
            Section 44
          </p>
          <p className="serif mt-3 text-[28px] leading-[1.1] text-ink-950">
            Title 28
          </p>
          <p className="serif mt-3 text-[22px] leading-tight text-ink-950">
            Card title 22
          </p>
          <p className="serif mt-3 text-[18px] italic leading-tight text-ink-950">
            Italic accent 18
          </p>
          <p className="mt-4 text-[12px] text-ink-500">
            Class: <Code>serif</Code>. Letter-spacing: -0.022em. Weight 400.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Sans · Inter</SubLabel>
          <p className="mt-4 text-[18px] leading-[1.55] text-ink-950">
            Body large. Used for important inline paragraphs and pull-outs.
            Line-height ~1.6.
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-600">
            Body default. The workhorse. Used for descriptions, captions,
            and most paragraph copy.
          </p>
          <p className="mt-3 text-[13px] leading-[1.55] text-ink-700">
            Body small. Used inside cards and rows.
          </p>
          <p className="mt-3 text-[11.5px] text-ink-500">
            Caption. Used for metadata and date stamps.
          </p>
          <hr className="my-4 border-ink-100" />
          <SubLabel>Mono · system</SubLabel>
          <p className="mt-3 font-mono text-[14px] text-ink-950">
            14 / for inline tokens
          </p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-500">
            12 · uppercase 0.18em tracking
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            10 · the system label size
          </p>
        </div>
      </div>
    </Section>
  );
}

function Space() {
  const radii: [string, string][] = [
    ["sm", "rounded"],
    ["md", "rounded-lg"],
    ["lg", "rounded-xl"],
    ["xl", "rounded-2xl"],
    ["pill", "rounded-full"],
  ];
  const widths = [8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
  return (
    <Section
      id="space"
      label="Space, radius, hairline"
      title="Tight ramp, rounded soft."
      blurb="Ness's spacing follows Tailwind's default 4px step. Cards round to 2xl; pills round to full. Hairlines are ink-100 inside cards and ink-200 around them."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Spacing scale</SubLabel>
          <div className="mt-4 space-y-2">
            {widths.map((w) => (
              <div key={w} className="flex items-center gap-3">
                <span className="w-10 font-mono text-[11px] text-ink-500">
                  {w}px
                </span>
                <span
                  className="h-2 rounded bg-ink-950"
                  style={{ width: w }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Radius scale</SubLabel>
          <div className="mt-4 grid grid-cols-5 gap-3">
            {radii.map(([label, cls]) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`h-16 w-16 bg-ink-950 ${cls}`} aria-hidden />
                <span className="font-mono text-[10px] text-ink-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-6 border-ink-100" />
          <SubLabel>Dividers</SubLabel>
          <div className="mt-4 space-y-5">
            <div>
              <div className="divider" />
              <p className="mt-1 font-mono text-[10px] text-ink-400">
                .divider · soft gradient
              </p>
            </div>
            <div>
              <hr className="border-ink-200" />
              <p className="mt-1 font-mono text-[10px] text-ink-400">
                border-ink-200 · structural
              </p>
            </div>
            <div>
              <hr className="border-ink-100" />
              <p className="mt-1 font-mono text-[10px] text-ink-400">
                border-ink-100 · intra-card
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Icons() {
  return (
    <Section
      id="icons"
      label="Iconography"
      title="No icon font. Glyphs and dots only."
      blurb="Ness avoids icon fonts and SVG sets. Status is communicated with colored dots; directional cues use unicode arrows and aria-hidden glyphs. Avatars are initials on tinted circles."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Status dots</SubLabel>
          <div className="mt-4 space-y-3 text-[13px] text-ink-700">
            {[
              { c: "bg-signal-open", l: "Open" },
              { c: "bg-signal-investigating", l: "Investigating" },
              { c: "bg-signal-progress", l: "In progress" },
              { c: "bg-signal-solved", l: "Solved" },
              { c: "bg-garden-500", l: "Live" },
              { c: "bg-amber-500", l: "Pending" },
            ].map((d) => (
              <div key={d.l} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${d.c}`} />
                <span>{d.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Glyphs</SubLabel>
          <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[13px] text-ink-700">
            {[
              ["→", "next"],
              ["←", "back"],
              ["↗", "external"],
              ["↓", "expand"],
              ["↵", "submit"],
              ["·", "separator"],
              ["×", "remove"],
              ["▾", "menu"],
            ].map(([g, l]) => (
              <div key={l} className="flex items-center gap-3">
                <span className="text-[18px] text-ink-950">{g}</span>
                <span className="text-ink-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Avatars · initials only</SubLabel>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Avatar initials="AP" seed="adam" size={36} />
            <Avatar initials="MK" seed="marcus" size={36} />
            <Avatar initials="SW" seed="susan" size={36} />
            <Avatar initials="PK" seed="priya" size={36} />
            <Avatar initials="EM" seed="emiko" size={36} />
          </div>
          <p className="mt-3 text-[11.5px] text-ink-500">
            Seeded tint per handle. No photos by default; the directory
            scrape adds them when available.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Buttons() {
  return (
    <Section
      id="buttons"
      label="Buttons"
      title="Three weights. Pill or square."
      blurb="Primary fills with ink-950. Secondary outlines with ink-200. Ghost is text-only. All three come pill (rounded-full) or square (rounded-xl). Use square for inline forms, pill everywhere else."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Primary</SubLabel>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13.5px] font-medium text-paper transition-colors hover:bg-ink-800">
              Submit your ring <span aria-hidden>→</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800">
              Small primary
            </button>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper opacity-40"
            >
              Disabled
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800">
              Squared variant
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Secondary · outline</SubLabel>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[13.5px] font-medium text-ink-950 transition-colors hover:border-ink-950">
              Browse listings
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950">
              hide
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-ink-950 bg-paper px-3 py-1 font-mono text-[11px] text-ink-950 transition-colors hover:bg-ink-950 hover:text-paper">
              whatsapp →
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Ghost · text only</SubLabel>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-[13px]">
            <button className="text-ink-600 transition-colors hover:text-ink-950">
              Cancel
            </button>
            <button className="font-mono text-[12px] text-ink-500 transition-colors hover:text-ink-950">
              reset
            </button>
            <button className="text-[11px] text-ink-400 transition-colors hover:text-ink-950">
              hide
            </button>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-ink-700 underline-offset-2 hover:underline"
            >
              learn more <span aria-hidden className="text-ink-400">↗</span>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-ink-950 p-6 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            On dark
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[13.5px] font-medium text-ink-950 transition-opacity hover:opacity-90">
              Submit <span aria-hidden>→</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:border-paper">
              Secondary
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Inputs() {
  return (
    <Section
      id="inputs"
      label="Inputs"
      title="Borders are quiet. Focus is loud."
      blurb="Inputs use ink-200 borders by default and ink-950 on focus, no rings. Placeholders are ink-400. On dark backgrounds the same input flips to ink-900 fill with ink-700 border."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Text input · light</SubLabel>
          <input
            type="text"
            placeholder="Search the directory or type a name"
            className="mt-4 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
          />
          <textarea
            placeholder="Multiline. Up to 240 characters."
            className="mt-3 w-full resize-none rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            rows={3}
          />
          <select className="mt-3 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 focus:border-ink-950 focus:outline-none">
            <option>Select a category</option>
            <option>Operations</option>
            <option>Social</option>
            <option>Infra</option>
          </select>
        </div>

        <div className="rounded-2xl border border-ink-950 bg-ink-950 p-6 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            Text input · dark
          </p>
          <input
            type="text"
            placeholder="Your name"
            className="mt-4 w-full rounded-xl border border-ink-700 bg-ink-900 px-3 py-2.5 text-[14px] text-paper placeholder:text-ink-500 focus:border-paper focus:outline-none"
          />
          <input
            type="text"
            placeholder="handle"
            className="mt-3 w-full rounded-xl border border-ink-700 bg-ink-900 px-3 py-2.5 text-[14px] text-paper placeholder:text-ink-500 focus:border-paper focus:outline-none"
          />
          <p className="mt-3 text-[11.5px] text-ink-300">
            Used inside Submit panels on /pagerank.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Pills() {
  const [tab, setTab] = useState<"all" | "open" | "shipped">("all");
  return (
    <Section
      id="pills"
      label="Pills, chips, stats"
      title="Filters morph; counts breathe."
      blurb="Animated filter pills with shared layoutId give the strip a magnetic feel. Stat pills sit on the page edge as quiet metadata. Chips inside cards show category and round."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Filter pills · layoutId morph</SubLabel>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(["all", "open", "shipped"] as const).map((id) => {
              const active = tab === id;
              const counts = { all: 24, open: 17, shipped: 7 } as const;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    active ? "text-paper" : "text-ink-700 hover:text-ink-950"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="design-tab-pill"
                      className="absolute inset-0 rounded-full bg-ink-950"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative capitalize">
                    {id}{" "}
                    <span
                      className={`ml-0.5 font-mono text-[10px] tabular-nums ${
                        active ? "text-paper/70" : "text-ink-400"
                      }`}
                    >
                      {counts[id]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Stat pills</SubLabel>
          <div className="mt-4 flex flex-wrap gap-3">
            <Stat label="Open listings" value="24" />
            <Stat label="Rings submitted" value="12" />
            <Stat label="Pledged" value="$420" />
            <Stat label="Citizens" value="63" />
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Inline chips</SubLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip dot="bg-signal-progress" label="In progress" />
            <Chip dot="bg-signal-solved" label="Solved" />
            <Chip dot="bg-garden-500" label="Live" />
            <Chip dot="bg-nessie-600" label="Café open" />
            <Chip muted label="R3 · Close" />
            <Chip muted label="9 namers" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1 text-[12px]">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-950">{value}</span>
    </span>
  );
}

function Chip({
  dot,
  muted,
  label,
}: {
  dot?: string;
  muted?: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] ${
        muted
          ? "border border-ink-200 bg-paper-tint text-ink-700"
          : "border border-ink-200 bg-paper text-ink-800"
      }`}
    >
      {dot ? <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> : null}
      {label}
    </span>
  );
}

function Cards() {
  return (
    <Section
      id="cards"
      label="Cards"
      title="One radius. Four moods."
      blurb="Every card is rounded-2xl with ink-200 border. The fill changes the mood: paper for default, paper-tint for alt rows, ink-950 for CTAs, dashed for empty states."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Paper · default</SubLabel>
          <h3 className="serif mt-3 text-[24px] leading-tight text-ink-950">
            Submit your problem.
          </h3>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
            File a community problem and let the city propose fixes.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
            Surface it <span aria-hidden>→</span>
          </button>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <SubLabel>Paper tint · sidebar / alt row</SubLabel>
          <h3 className="serif mt-3 text-[24px] leading-tight text-ink-950">
            Etiquette.
          </h3>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.6] text-ink-700">
            <li>· Real names, real prices, real photos.</li>
            <li>· Mark sold or claimed quickly.</li>
            <li>· Pay each other in USDC or cash.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-950 bg-ink-950 p-6 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            Step 2 · Submit your ring
          </p>
          <h3 className="serif mt-2 text-[24px] leading-tight">
            Add your ring to the live graph.
          </h3>
          <p className="mt-2 max-w-md text-[13.5px] leading-[1.65] text-ink-200">
            Your individual list stays private. Only the aggregate
            leaderboard is public.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[12.5px] font-medium text-ink-950 transition-opacity hover:opacity-90">
            Submit <span aria-hidden>→</span>
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-6 text-center">
          <p className="serif text-[22px] leading-tight text-ink-950">
            Nothing in this filter.
          </p>
          <p className="mt-2 text-[12.5px] text-ink-500">
            Try a different category, or post the first one.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Rows() {
  return (
    <Section
      id="rows"
      label="Rows"
      title="Density without chaos."
      blurb="Two row patterns carry most of Ness. The listing row groups status, body, and CTA on a 12-column grid. The leaderboard row swaps in a progress bar."
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          <ListingRow
            kind="For sale"
            kindDot="bg-amber-500"
            title="Hyundai i10 (2018, 38k km)"
            body="One-owner since new. Selling because I'm leaving the cohort."
            author="Marcus Lee"
            handle="marcus"
            price="$4,800"
            divider={false}
          />
          <ListingRow
            kind="Rides"
            kindDot="bg-nessie-600"
            title="JB run, Saturday 10am"
            body="3 seats. Costco loop, then dinner. Splitting petrol."
            author="Susan Wei"
            handle="susan"
            price="$12"
          />
          <ListingRow
            kind="Free"
            kindDot="bg-garden-500"
            title="IKEA couch, must go this weekend"
            body="Black two-seater. Decent shape. Bring friends."
            author="Priya Krishnan"
            handle="priya.k"
            price="free"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-200">
          <div className="grid grid-cols-12 gap-4 border-b border-ink-200 bg-paper-tint px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Citizen</div>
            <div className="col-span-2 text-right">Namers</div>
            <div className="col-span-4 text-right">Weight</div>
          </div>
          {[
            { rank: 1, handle: "priya", namers: 8, score: 42, pct: 100 },
            { rank: 2, handle: "naomi", namers: 9, score: 40, pct: 95 },
            { rank: 3, handle: "adam", namers: 8, score: 39, pct: 92 },
            { rank: 4, handle: "marcus", namers: 8, score: 38, pct: 90 },
          ].map((r) => (
            <div
              key={r.handle}
              className="grid grid-cols-12 gap-4 border-b border-ink-100 bg-paper px-5 py-3 last:border-0"
            >
              <div className="col-span-1 flex items-center font-mono text-[12px] tabular-nums text-ink-400">
                {String(r.rank).padStart(2, "0")}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="font-mono text-[13px] text-ink-950">@{r.handle}</div>
              </div>
              <div className="col-span-2 flex items-center justify-end font-mono text-[12px] tabular-nums text-ink-700">
                {r.namers}
              </div>
              <div className="col-span-4 flex items-center justify-end gap-3">
                <div className="hidden max-w-[140px] flex-1 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-ink-950"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-[40px] text-right font-mono text-[13px] tabular-nums text-ink-950">
                  {r.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ListingRow({
  kind,
  kindDot,
  title,
  body,
  author,
  handle,
  price,
  divider = true,
}: {
  kind: string;
  kindDot: string;
  title: string;
  body: string;
  author: string;
  handle: string;
  price: string;
  divider?: boolean;
}) {
  const initials = author
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`grid grid-cols-12 items-start gap-3 px-4 py-4 transition-colors hover:bg-paper-tint sm:gap-4 sm:px-5 ${
        divider ? "border-t border-ink-100" : ""
      }`}
    >
      <div className="col-span-12 sm:col-span-7">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${kindDot}`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
            {kind}
          </span>
          <span className="text-ink-300">·</span>
          <span className="text-[10.5px] text-ink-400">2d ago</span>
        </div>
        <h3 className="mt-1 text-[15px] font-medium leading-tight text-ink-950">
          {title}
        </h3>
        <p className="mt-1 text-[12.5px] leading-[1.55] text-ink-600">{body}</p>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-500">
          <Avatar initials={initials} seed={handle} size={18} />
          <span className="text-ink-700">{author}</span>
          <span className="text-ink-300">·</span>
          <span className="font-mono text-[11px]">@{handle}</span>
        </div>
      </div>
      <div className="col-span-6 sm:col-span-2 sm:text-right">
        <span className="font-mono text-[14px] tabular-nums text-ink-950">
          {price}
        </span>
      </div>
      <div className="col-span-6 flex justify-end sm:col-span-3">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-800">
          Reply <span aria-hidden>↓</span>
        </button>
      </div>
    </div>
  );
}

function MotionPlay() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<"a" | "b">("a");
  return (
    <Section
      id="motion"
      label="Motion"
      title="Slow ease, single curve."
      blurb="One easing curve [0.22, 1, 0.36, 1] applied at 0.6 to 0.7 seconds carries the whole site. Layout transitions use Framer's springs."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>FadeIn / FadeInOnView</SubLabel>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
          >
            Replay
          </button>
          <div className="mt-4 min-h-[120px]">
            <AnimatePresence mode="wait">
              {open && (
                <FadeIn key={String(open)} y={14}>
                  <p className="serif text-[28px] leading-tight text-ink-950">
                    It fades in from below.
                  </p>
                  <p className="mt-2 text-[13px] text-ink-600">
                    600ms ease [0.22, 1, 0.36, 1]. Used for hero blocks.
                  </p>
                </FadeIn>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Stagger list</SubLabel>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
          >
            Replay
          </button>
          <AnimatePresence mode="wait">
            {open && (
              <StaggerList key={String(open)} className="mt-4 space-y-2">
                {["one", "two", "three", "four"].map((t) => (
                  <StaggerItem key={t}>
                    <div className="rounded-xl border border-ink-200 bg-paper px-4 py-2 text-[13px] text-ink-700">
                      {t}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Layout-id morph</SubLabel>
          <div className="mt-4 flex gap-2">
            {(["a", "b"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setPos(id)}
                className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  pos === id ? "text-paper" : "text-ink-700"
                }`}
              >
                {pos === id && (
                  <motion.span
                    layoutId="design-pos-pill"
                    className="absolute inset-0 rounded-full bg-ink-950"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">Position {id.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-ink-500">
            The pill morphs between active positions instead of fading.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-paper p-6">
          <SubLabel>Shimmer · loading</SubLabel>
          <div className="mt-4 space-y-2">
            <div className="shimmer h-3 w-3/4 rounded bg-ink-100" />
            <div className="shimmer h-3 w-1/2 rounded bg-ink-100" />
            <div className="shimmer h-3 w-2/3 rounded bg-ink-100" />
          </div>
          <p className="mt-3 text-[12px] text-ink-500">
            Used while the leaderboard or directory search is in flight.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Ness Cafe mockups                                                 */
/* ------------------------------------------------------------------ */

const MENU = {
  drinks: [
    { name: "Espresso", price: "$3", note: "single origin, monthly rotate" },
    { name: "Cortado", price: "$4", note: "" },
    { name: "Flat white", price: "$4.5", note: "oat available, free" },
    { name: "Pour-over", price: "$5", note: "varietals on the board" },
    { name: "Matcha latte", price: "$5", note: "ceremonial grade" },
    { name: "Cold brew", price: "$4.5", note: "tap, daily batch" },
  ],
  bites: [
    { name: "Sourdough focaccia", price: "$4", note: "baked Tue/Thu/Sat" },
    { name: "Almond croissant", price: "$4.5", note: "" },
    { name: "Banana bread", price: "$4", note: "with cardamom" },
    { name: "Grain bowl", price: "$9", note: "today: farro, beet, feta" },
    { name: "Soup of the day", price: "$7", note: "lentil with miso" },
  ],
} as const;

function Cafe() {
  return (
    <Section
      id="cafe"
      label="Mockup zone · Ness Cafe"
      title="The cafe, drawn in Ness."
      blurb="Three compositions of a Ness Cafe landing page, each built only from primitives shown above. Tinker the JSX directly to riff."
    >
      <div className="space-y-10">
        <CafeMockA />
        <CafeMockB />
        <CafeMockC />
      </div>
    </Section>
  );
}

/* Mock A: full landing-page layout. Hero + status + menu + hours + book table. */
function CafeMockA() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-paper-warm">
      <div className="border-b border-ink-100 bg-paper px-6 py-3 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
          Mock A · Full landing
        </p>
      </div>
      <div className="px-6 py-10 sm:px-10 sm:py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Ness Cafe · ground floor
        </p>
        <h2 className="serif mt-2 text-[44px] leading-[1.02] text-ink-950 sm:text-[64px]">
          A small bar.
          <br />
          <span className="italic">A long table.</span>
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.6] text-ink-700">
          Quiet espresso in the morning, focaccia from the kitchen at noon,
          a glass of something in the evening. Workable WiFi. Outlets every
          two seats. Open to citizens and their guests.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Chip dot="bg-garden-500" label="Open · until 8 pm" />
          <Stat label="Today's pour" value="Ethiopia Yirgacheffe" />
          <Stat label="Loaf" value="Out at 14:00" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Menu */}
          <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                The board
              </p>
              <p className="font-mono text-[10px] text-ink-400">
                today · {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="serif mt-2 text-[26px] text-ink-950">Drinks.</h3>
            <ul className="mt-4 divide-y divide-ink-100">
              {MENU.drinks.map((d) => (
                <li
                  key={d.name}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <div>
                    <span className="text-[14px] text-ink-950">{d.name}</span>
                    {d.note ? (
                      <span className="ml-2 text-[12px] text-ink-500">
                        · {d.note}
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono text-[13.5px] tabular-nums text-ink-950">
                    {d.price}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="serif mt-6 text-[26px] text-ink-950">Bites.</h3>
            <ul className="mt-4 divide-y divide-ink-100">
              {MENU.bites.map((d) => (
                <li
                  key={d.name}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <div>
                    <span className="text-[14px] text-ink-950">{d.name}</span>
                    {d.note ? (
                      <span className="ml-2 text-[12px] text-ink-500">
                        · {d.note}
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono text-[13.5px] tabular-nums text-ink-950">
                    {d.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-ink-200 bg-paper p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Hours
              </p>
              <ul className="mt-3 space-y-1.5 text-[13.5px] text-ink-800">
                {[
                  ["Mon to Fri", "07:30 to 20:00"],
                  ["Saturday", "08:30 to 22:00"],
                  ["Sunday", "08:30 to 16:00"],
                ].map(([d, h]) => (
                  <li key={d} className="flex justify-between">
                    <span className="text-ink-700">{d}</span>
                    <span className="font-mono text-[12.5px] tabular-nums text-ink-950">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] text-ink-500">
                Last pour 30 min before close.
              </p>
            </div>

            <div className="rounded-2xl border border-ink-950 bg-ink-950 p-6 text-paper">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
                Reserve the long table
              </p>
              <h4 className="serif mt-2 text-[22px] leading-tight">
                Eight to twelve seats.
              </h4>
              <p className="mt-2 text-[13px] leading-[1.6] text-ink-200">
                For book clubs, retros, and birthdays. We bring out the
                bigger pots and turn the music down.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[12.5px] font-medium text-ink-950 transition-opacity hover:opacity-90">
                Book a night <span aria-hidden>→</span>
              </button>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                In the bar today
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-ink-700">
                {[
                  ["Adam", "AP", "writing at the window"],
                  ["Susan", "SW", "reading"],
                  ["Marcus", "ML", "calls, headphones"],
                ].map(([name, init, what]) => (
                  <li key={name} className="flex items-center gap-2.5">
                    <Avatar initials={init} seed={name} size={20} />
                    <span className="text-ink-950">{name}</span>
                    <span className="text-ink-400">·</span>
                    <span className="text-ink-500">{what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mock B: a compact in-app card. The "is the cafe open right now?" widget. */
function CafeMockB() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-paper-tint">
      <div className="border-b border-ink-100 bg-paper px-6 py-3 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
          Mock B · Status widget · sits inside the city map
        </p>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-ink-100 p-7 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-garden-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-garden-700">
              Open now
            </span>
          </div>
          <h3 className="serif mt-3 text-[34px] leading-[1.04] text-ink-950">
            Ness Cafe.
          </h3>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
            On the ground floor next to the courtyard. Eleven seats inside,
            six outside. Bring a book or a laptop, not a meeting room.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800">
              See the board <span aria-hidden>→</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[12.5px] font-medium text-ink-950 transition-colors hover:border-ink-950">
              Book the long table
            </button>
          </div>
        </div>
        <div className="p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Today
          </p>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            {[
              ["Pour", "Ethiopia Yirgacheffe"],
              ["Loaf", "Sourdough focaccia"],
              ["Soup", "Lentil with miso"],
              ["Wifi", "ness-cafe / open"],
              ["Music", "low, instrumental"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-baseline justify-between">
                <span className="text-ink-500">{k}</span>
                <span className="text-right text-ink-950">{v}</span>
              </li>
            ))}
          </ul>
          <hr className="my-5 border-ink-100" />
          <p className="text-[11.5px] text-ink-500">
            Updated 11 min ago by{" "}
            <span className="font-mono text-ink-700">@kofi</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Mock C: a vibe-forward print-style poster. Single column, big serif. */
function CafeMockC() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-paper">
      <div className="border-b border-ink-100 bg-paper-tint px-6 py-3 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
          Mock C · Poster / print
        </p>
      </div>
      <div className="px-6 py-14 text-center sm:px-10 sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-500">
          Ness Cafe · the ground floor
        </p>
        <h2 className="serif mx-auto mt-4 max-w-2xl text-[56px] leading-[0.98] text-ink-950 sm:text-[88px]">
          Quiet espresso,
          <br />
          <span className="italic">good company,</span>
          <br />
          and the long table.
        </h2>
        <div className="mx-auto mt-8 max-w-md">
          <div className="divider" />
        </div>
        <p className="mx-auto mt-6 max-w-md text-[14px] leading-[1.7] text-ink-700">
          Open every day. Closed when the city is. Bring something to read.
          Bring someone you mean to catch up with. Pay in USDC or cash.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Chip dot="bg-garden-500" label="Open today" />
          <Chip muted label="07:30 to 20:00" />
          <Chip muted label="11 seats inside" />
        </div>
        <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink-400">
          ness.city / cafe
        </p>
      </div>
    </div>
  );
}
