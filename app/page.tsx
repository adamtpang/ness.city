import Link from "next/link";
import { problems, stats } from "@/lib/data";
import { ProblemCard } from "@/components/ProblemCard";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { CountUp } from "@/components/motion/CountUp";

export default function Home() {
  const sorted = [...problems].sort((a, b) => {
    const order: Record<string, number> = { open: 0, investigating: 1, "in-progress": 2, solved: 3 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.upvotes - a.upvotes;
  });
  const empty = sorted.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-5">
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-950 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-950" />
            </span>
            in beta · open-sourcing Network School
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <h1 className="serif mt-7 max-w-3xl text-[44px] leading-[1.02] text-ink-950 sm:text-[68px] sm:leading-[1.0]">
            The civic layer
            <br />
            for{" "}
            <span className="italic">Network School</span>.
          </h1>
        </FadeIn>

        <FadeIn delay={0.12}>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.6] text-ink-600 sm:text-[17px]">
            Surface problems. Diagnose root causes. Fund the fixes. Solvers earn
            karma. Patrons earn attribution. Think of it as ns.com with issues
            and pull requests.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              See the worked example
            </Link>
            <Link
              href="/bounties"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              Open bounties →
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.28}>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-4">
            <Stat label="Problems open" value={stats.problemsOpen} />
            <Stat label="Problems solved" value={stats.problemsSolved} />
            <Stat label="Pledged" value={stats.totalPledged} prefix="$" />
            <Stat label="Karma issued" value={stats.totalKarma} />
          </div>
        </FadeIn>
      </section>

      <div className="divider" />

      <section className="py-14">
        <FadeInOnView>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                The feed
              </p>
              <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
                What needs fixing
              </h2>
              <p className="mt-2 max-w-md text-[14px] text-ink-600">
                Open problems rise. Solved problems sink into the city&apos;s
                memory. Sorted by signal.
              </p>
            </div>
            {!empty && (
              <div className="hidden items-center gap-1 rounded-full border border-ink-200 bg-paper p-1 text-[12px] sm:flex">
                <button className="rounded-full bg-ink-950 px-3 py-1.5 text-paper">All</button>
                <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">Open</button>
                <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">In progress</button>
                <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">Solved</button>
              </div>
            )}
          </div>
        </FadeInOnView>

        {empty ? (
          <FadeInOnView>
            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  The feed is open
                </p>
                <h3 className="serif mt-2 text-[26px] leading-tight text-ink-950">
                  Be the first to surface a problem.
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
                  Ness starts empty. Every entry on the feed will be a real
                  problem from a real citizen. The seed for everything that
                  follows: bounty, fix, documentation, karma.
                </p>
                <Link
                  href="/submit"
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
                <h3 className="serif mt-2 text-[26px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
                  See how a real fix moves through Ness.
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
                  We walk through one bounty end to end. Priya surfaces a wifi
                  problem. Marcus proposes a fix. Five patrons crowdfund $240.
                  Marcus ships and documents.
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
      <div className="serif text-[36px] leading-none tabular-nums text-ink-950">
        {prefix}
        <CountUp to={value} />
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  );
}
