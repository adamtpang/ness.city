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

  return (
    <main className="mx-auto max-w-5xl px-5">
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-950 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-950" />
            </span>
            {stats.citizens} citizens online
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
            The core team can&apos;t see every problem. Ness is where citizens
            surface issues, name root causes, ship fixes, and earn social credit
            for the documentation they leave behind.
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
              How Ness works
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.28}>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-4">
            <Stat label="Problems open" value={stats.problemsOpen} />
            <Stat label="Problems solved" value={stats.problemsSolved} />
            <Stat label="Credit issued" value={stats.totalCredit} />
            <Stat label="Citizens" value={stats.citizens} />
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
            <div className="hidden items-center gap-1 rounded-full border border-ink-200 bg-paper p-1 text-[12px] sm:flex">
              <button className="rounded-full bg-ink-950 px-3 py-1.5 text-paper">All</button>
              <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">Open</button>
              <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">In progress</button>
              <button className="rounded-full px-3 py-1.5 text-ink-600 hover:text-ink-950">Solved</button>
            </div>
          </div>
        </FadeInOnView>

        <StaggerList className="mt-8 grid gap-3">
          {sorted.map((p) => (
            <StaggerItem key={p.id}>
              <ProblemCard problem={p} />
            </StaggerItem>
          ))}
        </StaggerList>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper px-5 py-6">
      <div className="serif text-[36px] leading-none tabular-nums text-ink-950">
        <CountUp to={value} />
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  );
}
