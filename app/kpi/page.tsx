import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

/**
 * /kpi — Network State KPI dashboard.
 *
 * Top-level community health metrics across all of ness.city's domains.
 * Complementary to /pulse (which is Discord-channel analytics). This page
 * answers "is the network actually growing and shipping?" at the platform
 * level.
 *
 * Originally a separate concept (nskpi.com) — folded into ness.city after
 * the 2026-05-22 source-loss incident as a native route. Strategically
 * correct: KPIs of the network belong inside the network.
 *
 * Data sources (per pillar):
 *   - Citizens   → lib/data.ts (citizens table or similar)
 *   - Problems   → /problems route's underlying store
 *   - Bounties   → BountyPanel data + USDC settlement events
 *   - Karma      → lib/points.ts
 *   - Market     → lib/market.ts (active listings)
 *   - Jobs       → lib/jobs.ts
 *   - Tools      → lib/tools.ts
 *   - WhatsApp   → lib/whatsapp.ts (group counts)
 *
 * Wiring is stubbed in this V0 — replace `kpiPlaceholder()` with real
 * server-action / DB calls when the data sources are ready. Stub values
 * are clearly labeled so they never get mistaken for real metrics.
 */

const KPI_DESCRIPTION =
  "Network State KPI dashboard. Citizens, problems, bounties, karma, market, jobs, tools. The civic layer's vital signs, on one page.";

export const metadata: Metadata = {
  title: "KPI · Ness",
  description: KPI_DESCRIPTION,
  alternates: { canonical: "/kpi" },
  openGraph: {
    title: "KPI · Ness",
    description: KPI_DESCRIPTION,
    url: "https://ness.city/kpi",
    siteName: "Ness",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KPI · Ness",
    description: KPI_DESCRIPTION,
  },
};

type Pillar = {
  key: string;
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  href?: string;
  stub: boolean;
};

// V0 placeholders. Replace each with a real server-side fetch from the
// referenced lib/ module. Marked `stub: true` so the UI can render a
// "placeholder" badge until real data lands.
function kpiPlaceholder(): Pillar[] {
  return [
    {
      key: "citizens",
      label: "Citizens",
      value: "—",
      hint: "Registered profiles, all-time.",
      href: "/citizens",
      stub: true,
    },
    {
      key: "problems",
      label: "Problems surfaced",
      value: "—",
      hint: "Open problems awaiting root-cause + bounty.",
      href: "/townhall",
      stub: true,
    },
    {
      key: "bounties",
      label: "Open bounties (USDC)",
      value: "—",
      hint: "Sum of unsettled bounty escrow.",
      href: "/bounties",
      stub: true,
    },
    {
      key: "karma",
      label: "Karma awarded",
      value: "—",
      hint: "Lifetime karma points across all fixers.",
      href: "/points",
      stub: true,
    },
    {
      key: "market",
      label: "Market listings",
      value: "—",
      hint: "Active listings on ness.city/market (30-day TTL).",
      href: "/market",
      stub: true,
    },
    {
      key: "jobs",
      label: "Jobs posted",
      value: "—",
      hint: "Open roles posted by NS-aligned societies.",
      href: "/jobs",
      stub: true,
    },
    {
      key: "tools",
      label: "Tools listed",
      value: "—",
      hint: "Open-source tools indexed for the community.",
      href: "/tools",
      stub: true,
    },
    {
      key: "whatsapp",
      label: "WhatsApp groups",
      value: "—",
      hint: "Active interest groups bridged into Ness.",
      href: "/whatsapp",
      stub: true,
    },
  ];
}

export default function KpiPage() {
  const pillars = kpiPlaceholder();
  const generatedAt = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <FadeIn>
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Civic vitals
          </p>
          <h1 className="serif mt-2 text-[32px] leading-tight text-ink-950">
            KPI
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.65] text-ink-700">
            {KPI_DESCRIPTION}
          </p>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            snapshot: {generatedAt}
          </p>
        </header>
      </FadeIn>

      <FadeInOnView>
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const card = (
              <div
                key={p.key}
                className="group h-full rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-300"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    {p.label}
                  </p>
                  {p.stub && (
                    <span className="rounded-full border border-ink-200 bg-paper-tint px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
                      placeholder
                    </span>
                  )}
                </div>
                <p className="mt-3 font-mono text-[40px] leading-none text-ink-950">
                  {p.value}
                </p>
                {p.delta && (
                  <p className="mt-1 font-mono text-[11px] text-accent">
                    {p.delta}
                  </p>
                )}
                {p.hint && (
                  <p className="mt-3 text-[12px] leading-[1.55] text-ink-600">
                    {p.hint}
                  </p>
                )}
              </div>
            );
            return p.href ? (
              <Link
                key={p.key}
                href={p.href}
                className="no-underline transition-transform hover:-translate-y-[1px]"
              >
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-12 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How this is computed
          </p>
          <h2 className="serif mt-2 text-[20px] leading-tight text-ink-950">
            Honest about the methodology
          </h2>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.65] text-ink-700">
            <li>
              <span className="font-mono text-[11px] text-ink-500">
                Citizens
              </span>{" "}
              counts unique authenticated profiles, lifetime. Does not
              double-count linked identities.
            </li>
            <li>
              <span className="font-mono text-[11px] text-ink-500">
                Problems
              </span>{" "}
              counts open problems with at least one proposed root cause
              awaiting a bounty.
            </li>
            <li>
              <span className="font-mono text-[11px] text-ink-500">
                Bounties (USDC)
              </span>{" "}
              sums escrowed amounts in active bounties only. Settled
              bounties move to lifetime karma.
            </li>
            <li>
              <span className="font-mono text-[11px] text-ink-500">Karma</span>{" "}
              counts lifetime points awarded across all fixers; does not
              decay.
            </li>
            <li>
              <span className="font-mono text-[11px] text-ink-500">Market</span>{" "}
              counts listings within the 30-day TTL window.
            </li>
            <li>
              <span className="font-mono text-[11px] text-ink-500">Jobs</span>,{" "}
              <span className="font-mono text-[11px] text-ink-500">Tools</span>,{" "}
              <span className="font-mono text-[11px] text-ink-500">
                WhatsApp
              </span>{" "}
              count current-active rows in their respective tables.
            </li>
            <li>
              No personally identifying data is exposed. All figures are
              aggregates.
            </li>
          </ul>
          <p className="mt-5 text-[13px] leading-[1.6] text-ink-600">
            Related views: <Link href="/pulse" className="underline">/pulse</Link>{" "}
            (Discord-channel analytics, narrative themes),{" "}
            <Link href="/points" className="underline">/points</Link>{" "}
            (leaderboard of karma by citizen).
          </p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Provenance
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
            This dashboard absorbs the role of the earlier nskpi.com
            prototype. Original source was lost in a 2026-05-22 incident
            and never had a remote backup. Rather than rebuild a separate
            site, KPIs of the network belong inside the network. One layer,
            one source of truth.
          </p>
        </div>
      </FadeInOnView>
    </main>
  );
}
