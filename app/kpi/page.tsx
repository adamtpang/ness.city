import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { getEngineStats } from "@/lib/db/queries";
import { isDbConfigured, getDb } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NESS_MANIFEST, CIVIC_VERSION } from "@/lib/civic/protocol";

/**
 * /kpi, aka nskpi.com (see middleware.ts: nskpi.com rewrites here).
 *
 * The Network State Dashboard (thenetworkstate.com) lists ~38 startup
 * societies with a one-line blurb each. It answers "who exists." This page
 * answers "how are they actually doing" — the vital signs a directory
 * doesn't publish: population, participation, open problems, where people
 * are headed. It reads from the Civic Protocol (docs/CIVIC-PROTOCOL.md),
 * so any node that implements the protocol can appear here, not just this
 * one.
 *
 * Originally a separate site (nskpi.com), whose source was lost in a
 * 2026-05-22 incident. Rebuilt here rather than as a standalone codebase:
 * KPIs of the network belong inside the network, one source of truth, and
 * this way the dashboard is itself Civic Protocol node #1's own numbers.
 *
 * Registry: REGISTRY_NODES below lists every node this page polls. Today
 * that's ness.city. Add a manifest URL here to add a node — no approval,
 * no central authority, just a URL that answers /.well-known/civic.json.
 */

const KPI_DESCRIPTION =
  "Vital signs for the network state movement. Population, participation, open problems, real numbers, not just a list of who exists.";

export const metadata: Metadata = {
  title: "KPI · Ness",
  description: KPI_DESCRIPTION,
  alternates: { canonical: "/kpi" },
  openGraph: {
    title: "nskpi — network state vital signs",
    description: KPI_DESCRIPTION,
    url: "https://nskpi.com",
    siteName: "nskpi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nskpi — network state vital signs",
    description: KPI_DESCRIPTION,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Pillar = { key: string; label: string; value: string; hint: string; href?: string; stub: boolean };

async function getCivicStats() {
  if (!isDbConfigured) return { known: 0, listed: 0, problems: 0, destinations: 0 };
  const db = getDb();
  const [row] = (await db.execute(sql`
    select
      (select count(*)::int from directory_profiles) as known,
      (select count(*)::int from member_plans) as listed,
      (select count(*)::int from problems where status <> 'solved') as problems,
      (select count(distinct lower(btrim(destination)))::int from member_plans) as destinations
  `)) as unknown as Array<{ known: number; listed: number; problems: number; destinations: number }>;
  return row ?? { known: 0, listed: 0, problems: 0, destinations: 0 };
}

// Nodes this dashboard polls. Add a manifest URL to add a node to the
// registry. No gatekeeper: any node implementing the Civic Protocol qualifies.
const REGISTRY_NODES = [{ manifest: "https://ness.city/.well-known/civic.json" }];

type RegistryNode = {
  ok: boolean;
  id: string;
  name: string;
  url: string;
  operator: string;
  stats: { known: number; listed: number; problems: number; destinations: number };
};

async function pollRegistry(): Promise<RegistryNode[]> {
  const results = await Promise.all(
    REGISTRY_NODES.map(async (n): Promise<RegistryNode> => {
      try {
        const base = new URL(n.manifest).origin;
        const res = await fetch(`${base}/api/civic/node`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        return {
          ok: true,
          id: data.id ?? base,
          name: data.name ?? base,
          url: data.url ?? base,
          operator: data.operator ?? "unknown",
          stats: data.stats ?? { known: 0, listed: 0, problems: 0, destinations: 0 },
        };
      } catch {
        return {
          ok: false, id: n.manifest, name: n.manifest, url: n.manifest,
          operator: "unreachable", stats: { known: 0, listed: 0, problems: 0, destinations: 0 },
        };
      }
    }),
  );
  return results;
}

export default async function KpiPage() {
  const [engine, civic, registry] = await Promise.all([getEngineStats(), getCivicStats(), pollRegistry()]);
  const generatedAt = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";

  const totals = registry.reduce(
    (a, n) => ({
      known: a.known + n.stats.known,
      listed: a.listed + n.stats.listed,
      problems: a.problems + n.stats.problems,
      destinations: Math.max(a.destinations, n.stats.destinations),
    }),
    { known: 0, listed: 0, problems: 0, destinations: 0 },
  );

  const pillars: Pillar[] = [
    { key: "known", label: "People known", value: totals.known.toLocaleString(), hint: "Across every registered node. A roster size, not a headcount claim.", stub: false },
    { key: "listed", label: "Opted in publicly", value: totals.listed.toLocaleString(), hint: "People who said where they're headed next. Never the full roster.", href: "/members", stub: false },
    { key: "problems", label: "Open problems", value: totals.problems.toLocaleString(), hint: "Surfaced, awaiting a fix, across every node.", href: "/townhall", stub: false },
    { key: "destinations", label: "Destinations tracked", value: totals.destinations.toLocaleString(), hint: "Distinct places people are heading, right now.", href: "/members", stub: false },
    { key: "pledged", label: "Pledged (USDC)", value: `$${engine.pledgedUsd.toLocaleString()}`, hint: "Active bounty escrow on ness.city.", href: "/townhall", stub: false },
    { key: "fixers", label: "Fixers with karma", value: engine.fixers.toLocaleString(), hint: "Citizens who've shipped at least one fix.", href: "/points", stub: false },
    { key: "population", label: "Population over time", value: "-", hint: "Man-months at NS, cohort sizes over time. Needs arrival/departure dates.", stub: true },
    { key: "realestate", label: "Real estate footprint", value: "-", hint: "Units occupied, Borovoe + Astana. Admin-entered when confirmed public.", stub: true },
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <FadeIn>
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">nskpi.com</p>
          <h1 className="serif mt-2 text-[32px] leading-tight text-ink-950">Network state vital signs.</h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.65] text-ink-700">
            {KPI_DESCRIPTION} Directories list who exists. This reads live numbers
            from the <Link href="/civic" className="underline">Civic Protocol</Link> —
            open, MIT, no gatekeeper. Every node here chose to publish these numbers.
          </p>
          <p className="mt-3 font-mono text-[11px] text-ink-500">snapshot: {generatedAt}</p>
        </header>
      </FadeIn>

      <FadeInOnView>
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const card = (
              <div key={p.key} className="group h-full rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-300">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{p.label}</p>
                  {p.stub && (
                    <span className="rounded-full border border-ink-200 bg-paper-tint px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
                      needs data
                    </span>
                  )}
                </div>
                <p className="mt-3 font-mono text-[40px] leading-none text-ink-950">{p.value}</p>
                <p className="mt-3 text-[12px] leading-[1.55] text-ink-600">{p.hint}</p>
              </div>
            );
            return p.href ? (
              <Link key={p.key} href={p.href} className="no-underline transition-transform hover:-translate-y-[1px]">{card}</Link>
            ) : card;
          })}
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">The registry</p>
          <h2 className="serif mt-2 text-[22px] leading-tight text-ink-950">{registry.length} {registry.length === 1 ? "node" : "nodes"} publishing.</h2>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.6] text-ink-600">
            Every row below answered <code className="font-mono text-[12px] text-ink-800">/.well-known/civic.json</code> live,
            just now. No node had to ask permission to be here, and none can be
            removed by anyone but itself.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-200">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 border-b border-ink-200 bg-paper-tint px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500">
              <div>Node</div><div>Operator</div><div className="text-right">Known</div><div className="text-right">Listed</div><div className="text-right">Problems</div>
            </div>
            {registry.map((n) => (
              <div key={n.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b border-ink-100 bg-paper px-4 py-3 text-[13.5px] last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-1.5 w-1.5 flex-none rounded-full ${n.ok ? "bg-garden-500" : "bg-ink-300"}`} aria-hidden />
                  <a href={n.url} target="_blank" rel="noreferrer" className="truncate text-ink-950 underline-offset-2 hover:underline">{n.name}</a>
                </div>
                <div className="font-mono text-[11px] text-ink-500">{n.operator}</div>
                <div className="text-right font-mono text-[13px] tabular-nums text-ink-800">{n.stats.known.toLocaleString()}</div>
                <div className="text-right font-mono text-[13px] tabular-nums text-ink-800">{n.stats.listed.toLocaleString()}</div>
                <div className="text-right font-mono text-[13px] tabular-nums text-ink-800">{n.stats.problems.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-12 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Why this exists</p>
          <h2 className="serif mt-2 text-[20px] leading-tight text-ink-950">A network state that can't publish its own vital signs isn't one.</h2>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-[1.65] text-ink-700">
            In July 2026 the Network School in Forest City was ordered to cease
            operations over a licensing issue. Within a day, a new deal in
            Kazakhstan. The founder called it &ldquo;restoring from cloud backup&rdquo;
            — but the backup was his, not the community&apos;s. Members owned no part
            of their own roster, events or reputation, so when the venue closed
            the network had nothing of its own to stand on.
          </p>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-[1.65] text-ink-700">
            The Civic Protocol is the fix: an open, MIT-licensed contract any
            node can implement in an afternoon, so a network can prove it&apos;s
            real without depending on any one operator to say so.
          </p>
          <p className="mt-5 font-mono text-[11px] text-ink-500">v{CIVIC_VERSION} · {NESS_MANIFEST.node.license} · <Link href="/civic" className="underline">read the spec</Link></p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">How this is computed</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.6] text-ink-600">
            <li><span className="font-mono text-[11px] text-ink-500">Known</span> is a roster size a node reports, not a claim anyone verified.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Listed</span> is only people who took a public action, e.g. saying where they&apos;re headed next. Never a scraped directory.</li>
            <li><span className="font-mono text-[11px] text-ink-500">Problems, Pledged, Fixers</span> read live from ness.city&apos;s own database.</li>
            <li>Rows marked <span className="font-mono text-[10px]">needs data</span> are honest gaps, not placeholders dressed as numbers.</li>
          </ul>
          <p className="mt-4 text-[13px] leading-[1.6] text-ink-600">
            Add your node: implement <Link href="/civic" className="underline">the protocol</Link>, then open a PR adding your manifest URL to <code className="font-mono text-[12px]">REGISTRY_NODES</code> in this page&apos;s source.
          </p>
        </div>
      </FadeInOnView>
    </main>
  );
}
