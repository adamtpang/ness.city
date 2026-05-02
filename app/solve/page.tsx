import Link from "next/link";
import { dbProblemToTownhall, listProblems } from "@/lib/db/queries";
import { ProblemCard } from "@/components/ProblemCard";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { CountUp } from "@/components/motion/CountUp";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { sql } from "drizzle-orm";

async function loadStats() {
  if (!isDbConfigured) {
    return { problemsOpen: 0, problemsSolved: 0, totalKarma: 0, totalPledged: 0 };
  }
  const db = getDb();
  const [counts] = (await db.execute(sql.raw(`
    select
      coalesce(sum(case when status <> 'solved' then 1 else 0 end), 0)::int as open_count,
      coalesce(sum(case when status = 'solved' then 1 else 0 end), 0)::int as solved_count
    from problems
  `))) as unknown as Array<{ open_count: number; solved_count: number }>;
  const [karmaRow] = (await db.execute(sql.raw(`
    select coalesce(sum(karma), 0)::int as total from citizens
  `))) as unknown as Array<{ total: number }>;
  const [pledgesRow] = (await db.execute(sql.raw(`
    select coalesce(sum(amount_cents), 0)::int as total from pledges
  `))) as unknown as Array<{ total: number }>;
  return {
    problemsOpen: counts?.open_count ?? 0,
    problemsSolved: counts?.solved_count ?? 0,
    totalKarma: karmaRow?.total ?? 0,
    totalPledged: Math.round((pledgesRow?.total ?? 0) / 100),
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SolvePage() {
  const [rows, stats] = await Promise.all([listProblems(), loadStats()]);
  const problems = rows.map((r) =>
    dbProblemToTownhall({
      ...r,
      proposals: [],
      bounty: null,
      documentation: null,
    }),
  );
  const sorted = [...problems].sort((a, b) => {
    const order: Record<string, number> = {
      open: 0,
      investigating: 1,
      "in-progress": 2,
      solved: 3,
    };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.upvotes - a.upvotes;
  });
  const empty = sorted.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16">
      <section className="pt-12 pb-8 sm:pt-16">
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Townhall
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
            What needs fixing.
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-ink-600 sm:text-[16px]">
            Citizens surface problems with real diagnoses. Patrons crowdfund
            the fixes in USDC. Solvers ship and document. The whole loop is
            public, attributed, and permanent.
          </p>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/solve/new"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/bounties"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              See open bounties
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              Worked example →
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-4">
            <Stat label="Problems open" value={stats.problemsOpen} />
            <Stat label="Problems solved" value={stats.problemsSolved} />
            <Stat label="Pledged" value={stats.totalPledged} prefix="$" />
            <Stat label="Karma issued" value={stats.totalKarma} />
          </div>
        </FadeIn>
      </section>

      <div className="divider" />

      <section className="py-10">
        <FadeInOnView>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                The feed
              </p>
              <h2 className="serif mt-2 text-[28px] leading-tight text-ink-950">
                Sorted by signal
              </h2>
              <p className="mt-2 max-w-md text-[13.5px] text-ink-600">
                Open problems rise. Solved problems sink into the city&apos;s
                memory.
              </p>
            </div>
          </div>
        </FadeInOnView>

        {empty ? (
          <FadeInOnView>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  The feed is open
                </p>
                <h3 className="serif mt-2 text-[24px] leading-tight text-ink-950">
                  Be the first to surface a problem.
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
                  Every entry will be a real problem from a real citizen.
                  Earns +5 karma on submit.
                </p>
                <Link
                  href="/solve/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
                >
                  Surface a problem
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <Link
                href="/about"
                className="group rounded-2xl border border-ink-200 bg-paper p-8 transition-colors hover:border-ink-950"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Worked example
                </p>
                <h3 className="serif mt-2 text-[24px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
                  See how a fix moves through Ness.
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
                  Five steps end-to-end. Same flow that ships every fix on
                  the live feed.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-ink-950">
                  Read the walkthrough
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </div>
          </FadeInOnView>
        ) : (
          <StaggerList className="mt-8 grid gap-3">
            {sorted.map((p) => (
              <StaggerItem key={p.id}>
                <ProblemCard problem={p} />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  prefix = "",
}: {
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="bg-paper px-5 py-6">
      <div className="serif text-[32px] leading-none tabular-nums text-ink-950">
        {prefix}
        <CountUp to={value} />
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  );
}
