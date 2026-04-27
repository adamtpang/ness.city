import Link from "next/link";
import { problems, stats } from "@/lib/data";
import { ProblemCard } from "@/components/ProblemCard";

export default function Home() {
  const sorted = [...problems].sort((a, b) => {
    const order: Record<string, number> = { open: 0, investigating: 1, "in-progress": 2, solved: 3 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.upvotes - a.upvotes;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="relative overflow-hidden border-b border-ink-800 py-14 sm:py-20">
        <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900/60 px-3 py-1 text-[11px] font-mono text-ink-400">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500 animate-pulse" />
            citizens online · {stats.citizens} active
          </div>
          <h1 className="mt-5 max-w-3xl text-[34px] sm:text-[48px] font-semibold leading-[1.05] tracking-tight text-ink-50">
            The civic layer for{" "}
            <span className="text-ember-400">Network School</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-300">
            The core team can&apos;t see every problem. Ness is where citizens surface
            issues, name root causes, ship fixes, and earn social credit for the
            documentation they leave behind.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-md bg-ember-500 px-4 py-2 text-[13px] font-medium text-ink-950 hover:bg-ember-400 transition-colors"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-md border border-ink-700 px-4 py-2 text-[13px] font-medium text-ink-200 hover:bg-ink-800 transition-colors"
            >
              How Ness works
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:max-w-2xl">
            <Stat label="Problems open" value={stats.problemsOpen} />
            <Stat label="Problems solved" value={stats.problemsSolved} />
            <Stat label="Total credit issued" value={stats.totalCredit.toLocaleString()} />
            <Stat label="Citizens" value={stats.citizens} />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight text-ink-50">
              The feed
            </h2>
            <p className="mt-1 text-[13px] text-ink-400">
              Most-needed problems first. Open issues rise; solved issues sink.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 rounded-md border border-ink-800 bg-ink-900/60 p-1 text-[12px]">
            <button className="rounded px-2.5 py-1 bg-ink-800 text-ink-100">All</button>
            <button className="rounded px-2.5 py-1 text-ink-400 hover:text-ink-100">Open</button>
            <button className="rounded px-2.5 py-1 text-ink-400 hover:text-ink-100">In progress</button>
            <button className="rounded px-2.5 py-1 text-ink-400 hover:text-ink-100">Solved</button>
          </div>
        </div>

        <div className="grid gap-3">
          {sorted.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-3">
      <div className="text-[20px] font-semibold tabular-nums text-ink-50">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
