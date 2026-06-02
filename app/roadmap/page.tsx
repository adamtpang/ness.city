import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

/**
 * /roadmap — the living public roadmap.
 *
 * Synthesis of the problems Adam discussed with Donovan Sung. Plotted on
 * Eisenhower (urgent × important). Each row carries quantity affected,
 * priority (1-5), time est., capital est., and NS-core owner where known.
 *
 * This page IS one of the unowned Q2 items in its own table ("No public
 * roadmap / KPI dashboard"). The bug is its own first fix.
 */

export const metadata: Metadata = {
  title: "Roadmap · Ness",
  description:
    "Living public roadmap of NS-side problems and their owners. Synthesized from conversations with the core team. Eisenhower-prioritized.",
};

type Owner =
  | "Jackson"
  | "Chance"
  | "Otavio"
  | "Balaji"
  | "Donovan"
  | "Unowned";

type Item = {
  title: string;
  qty: number;
  /** 1-5 (5 = highest priority/quality). */
  quality: number;
  /** Weeks. null = unscoped. */
  timeWeeks: number | null;
  /** USD. */
  capitalUsd: number;
  owner: Owner;
  ness?: string; // what Ness.city ships toward this; null if pure-NS
};

const Q1: Item[] = [
  {
    title: "Customer feedback loops only exist for food; not applied to community, events, ops, infra",
    qty: 500, quality: 5, timeWeeks: 1, capitalUsd: 1000, owner: "Jackson",
    ness: "Build the survey infra + dashboards; Jackson runs the loop and acts on signals.",
  },
  {
    title: "Member quality declining. No vouching for referrals; volume-incentivized instead of quality",
    qty: 500, quality: 5, timeWeeks: 1, capitalUsd: 0, owner: "Chance",
    ness: "Ship the vouching ledger UI + decay; Chance sets the bar and runs admissions.",
  },
  {
    title: "Visa work not prioritized; existential for affected members",
    qty: 300, quality: 5, timeWeeks: 1, capitalUsd: 0, owner: "Otavio",
    ness: "Hands off. Pure NS internal.",
  },
  {
    title: "School product hasn't materialized after 18 months",
    qty: 500, quality: 4, timeWeeks: 8, capitalUsd: 100_000, owner: "Balaji",
    ness: "Surface /school once core commits direction. Not before.",
  },
];

const Q2: Item[] = [
  {
    title: "No year-in-review for renewals (both directions); no exit interviews when high-quality members leave",
    qty: 100, quality: 4, timeWeeks: 1, capitalUsd: 0, owner: "Chance",
    ness: "Ship the exit-interview template + monthly synthesis surface.",
  },
  {
    title: "No public roadmap / public KPI dashboard tied to NS's actual goals (population, GDP, real estate)",
    qty: 500, quality: 4, timeWeeks: 1, capitalUsd: 0, owner: "Unowned",
    ness: "Shipping this page is the first fix. KPI dashboard once NS core commits numbers.",
  },
  {
    title: "Longtermers treated as customers, not partners (people came to co-create thenetworkstate.com)",
    qty: 100, quality: 3, timeWeeks: null, capitalUsd: 0, owner: "Unowned",
    ness: "Once partner roles are defined, surface them on /citizens.",
  },
  {
    title: "Trial-to-Core paths haven't converted; clearer success criteria + exit terms upfront (Britt model: time-bound contracts)",
    qty: 40, quality: 3, timeWeeks: 1, capitalUsd: 0, owner: "Donovan",
    ness: "Could be /townhall-tracked; largely an HR flow.",
  },
  {
    title: "Only entry is full residency; no day or week passes (try before you buy)",
    qty: 1000, quality: 2, timeWeeks: 1, capitalUsd: 1000, owner: "Unowned",
    ness: "Once priced, list passes on the site. Pricing decision is NS core.",
  },
  {
    title: "Longtermer lunches happen but no public changelog format (compare changelog.shopify.com)",
    qty: 500, quality: 2, timeWeeks: 1, capitalUsd: 0, owner: "Jackson",
    ness: "Ship /changelog next. Jackson writes the entries.",
  },
];

const OWNER_TONE: Record<Owner, { bg: string; fg: string; border: string }> = {
  Jackson:  { bg: "bg-blue-50",     fg: "text-blue-800",     border: "border-blue-200" },
  Chance:   { bg: "bg-emerald-50",  fg: "text-emerald-800",  border: "border-emerald-200" },
  Otavio:   { bg: "bg-amber-50",    fg: "text-amber-800",    border: "border-amber-200" },
  Balaji:   { bg: "bg-rose-50",     fg: "text-rose-800",     border: "border-rose-200" },
  Donovan:  { bg: "bg-violet-50",   fg: "text-violet-800",   border: "border-violet-200" },
  Unowned:  { bg: "bg-paper-tint",  fg: "text-ink-500",      border: "border-ink-200" },
};

function OwnerChip({ owner }: { owner: Owner }) {
  const t = OWNER_TONE[owner];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${t.bg} ${t.border} ${t.fg}`}>
      {owner}
    </span>
  );
}

function PriorityDots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5 align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${i <= n ? "bg-ink-950" : "bg-ink-200"}`}
        />
      ))}
    </span>
  );
}

function fmtTime(w: number | null) {
  if (w == null) return "—";
  if (w === 1) return "1 wk";
  return `${w} wks`;
}

function fmtCapital(u: number) {
  if (u === 0) return "$0";
  if (u < 1000) return `$${u}`;
  if (u < 1_000_000) return `$${u / 1000}k`;
  return `$${(u / 1_000_000).toFixed(1)}m`;
}

function ItemRow({ item, divider }: { item: Item; divider: boolean }) {
  return (
    <div className={`grid grid-cols-12 items-start gap-3 px-4 py-3.5 sm:px-5 ${divider ? "border-t border-ink-100" : ""}`}>
      <div className="col-span-12 sm:col-span-6">
        <p className="text-[14px] leading-[1.45] text-ink-950">{item.title}</p>
        {item.ness && (
          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-500">
            <span className="font-mono uppercase tracking-[0.14em] text-ink-400">ness ·</span> {item.ness}
          </p>
        )}
      </div>
      <div className="col-span-3 flex items-center sm:col-span-2">
        <PriorityDots n={item.quality} />
        <span className="ml-2 font-mono text-[11px] tabular-nums text-ink-700">{item.quality}/5</span>
      </div>
      <div className="col-span-3 font-mono text-[11px] tabular-nums text-ink-700 sm:col-span-1">
        ~{item.qty.toLocaleString()}
      </div>
      <div className="col-span-3 font-mono text-[11px] tabular-nums text-ink-700 sm:col-span-1">
        {fmtTime(item.timeWeeks)}
      </div>
      <div className="col-span-3 font-mono text-[11px] tabular-nums text-ink-700 sm:col-span-1">
        {fmtCapital(item.capitalUsd)}
      </div>
      <div className="col-span-12 sm:col-span-1">
        <OwnerChip owner={item.owner} />
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="hidden grid-cols-12 gap-3 border-b border-ink-200 bg-paper-tint px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 sm:grid">
      <div className="col-span-6">Problem</div>
      <div className="col-span-2">Quality</div>
      <div className="col-span-1">Affected</div>
      <div className="col-span-1">Time</div>
      <div className="col-span-1">Capital</div>
      <div className="col-span-1">Owner</div>
    </div>
  );
}

export default function RoadmapPage() {
  const allOwners: Owner[] = ["Jackson", "Chance", "Otavio", "Balaji", "Donovan", "Unowned"];
  const ownerCounts = allOwners.map((o) => ({
    owner: o,
    count: [...Q1, ...Q2].filter((i) => i.owner === o).length,
  }));

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
      <FadeIn>
        <header className="border-b border-ink-200 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Roadmap · public · living document
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.02] text-ink-950 sm:text-[60px]">
            What NS should fix.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.55] text-ink-700 sm:text-[16px]">
            Synthesized with Donovan Sung from a year of community feedback.
            Prioritized on Eisenhower (urgency × importance). Each row carries
            an estimate of who&apos;s affected, priority, time, capital, and
            the NS-core team member who&apos;d own the fix.
          </p>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            This page is itself a fix for one of the rows below ("no public roadmap"). The bug is its own first patch.
          </p>
        </header>
      </FadeIn>

      {/* Owner key */}
      <FadeIn delay={0.05}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Owners ·
          </span>
          {ownerCounts.map((o) => (
            <span key={o.owner} className="inline-flex items-center gap-1.5">
              <OwnerChip owner={o.owner} />
              <span className="font-mono text-[11px] tabular-nums text-ink-500">{o.count}</span>
            </span>
          ))}
        </div>
      </FadeIn>

      {/* Q1 */}
      <FadeInOnView>
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-rose-700">
              Q1 · Important + Urgent
            </h2>
            <span className="font-mono text-[10px] text-ink-500">{Q1.length} items</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-ink-200 bg-paper">
            <HeaderRow />
            {Q1.map((item, i) => (
              <ItemRow key={i} item={item} divider={i > 0} />
            ))}
          </div>
        </section>
      </FadeInOnView>

      {/* Q2 */}
      <FadeInOnView>
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-700">
              Q2 · Important + Not Urgent
            </h2>
            <span className="font-mono text-[10px] text-ink-500">{Q2.length} items</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-ink-200 bg-paper">
            <HeaderRow />
            {Q2.map((item, i) => (
              <ItemRow key={i} item={item} divider={i > 0} />
            ))}
          </div>
        </section>
      </FadeInOnView>

      {/* How this works */}
      <FadeInOnView>
        <section className="mt-12 rounded-xl border border-ink-200 bg-paper p-6">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How to read this
          </h3>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.6] text-ink-700">
            <li><span className="font-mono text-[11px] text-ink-500">Quality</span> · 1–5. Composite of severity × impact. 5 = ship-stopper.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Affected</span> · order-of-magnitude estimate of members impacted.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Time / Capital</span> · rough cost of the fix.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Owner</span> · who'd land the fix on the NS side.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Ness</span> · what ness.city ships toward this row. Most are partnership-shaped.</li>
          </ul>
          <p className="mt-4 text-[13px] leading-[1.6] text-ink-600">
            Anyone in the community can propose a fix on{" "}
            <Link href="/townhall" className="underline-offset-2 hover:underline">/townhall</Link>{" "}
            or open a GitHub issue. Patrons can fund any open bounty.
          </p>
        </section>
      </FadeInOnView>
    </main>
  );
}
