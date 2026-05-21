import Link from "next/link";
import { dbProblemToTownhall, listProblems } from "@/lib/db/queries";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Problem, ProblemStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * /solve — the Forum.
 * GitHub-Issues-style: dense rows in one bordered ledger. Status dot,
 * category, title, signal, author. Click = problem detail. No magazine
 * cards, no onboarding fluff (the loop is documented on /about).
 */

const STATUS_TONE: Record<ProblemStatus, { dot: string; label: string; chip: string }> = {
  open: { dot: "bg-ink-400", label: "OPEN", chip: "text-ink-500" },
  investigating: { dot: "bg-amber-500", label: "INVEST", chip: "text-amber-700" },
  "in-progress": { dot: "bg-blue-500", label: "IN PROG", chip: "text-blue-700" },
  solved: { dot: "bg-emerald-500", label: "SOLVED", chip: "text-emerald-700" },
};

const STATUS_ORDER: Record<ProblemStatus, number> = {
  open: 0,
  investigating: 1,
  "in-progress": 2,
  solved: 3,
};

export default async function SolvePage() {
  const rows = await listProblems();
  const problems: Problem[] = rows.map((r) =>
    dbProblemToTownhall({ ...r, proposals: [], bounty: null, documentation: null }),
  );
  const sorted = [...problems].sort((a, b) => {
    if (STATUS_ORDER[a.status] !== STATUS_ORDER[b.status])
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    return b.upvotes - a.upvotes;
  });

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-8">
      <FadeIn>
        <header className="flex items-end justify-between gap-4 border-b border-ink-200 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              Forum · {sorted.length} {sorted.length === 1 ? "problem" : "problems"}
            </p>
            <h1 className="serif mt-1 text-[40px] leading-[1.02] text-ink-950 sm:text-[52px]">
              Solve.
            </h1>
          </div>
          <Link
            href="/solve/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Surface a problem
            <span aria-hidden>→</span>
          </Link>
        </header>
      </FadeIn>

      <FadeIn delay={0.05}>
        {sorted.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-paper-tint px-6 py-10 text-center">
            <p className="serif text-[22px] leading-tight text-ink-950">
              Nothing to fix yet.
            </p>
            <p className="mt-2 text-[13px] text-ink-500">
              Be the first. The Forum needs a citizen to file a real problem.
            </p>
            <Link
              href="/solve/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper hover:bg-ink-800"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <ul className="mt-6 overflow-hidden rounded-xl border border-ink-200">
            {sorted.map((p) => (
              <ProblemRow key={p.id} problem={p} />
            ))}
          </ul>
        )}
      </FadeIn>
    </main>
  );
}

function ProblemRow({ problem }: { problem: Problem }) {
  const tone = STATUS_TONE[problem.status];
  return (
    <li className="border-b border-ink-100 last:border-b-0">
      <Link
        href={`/solve/${problem.slug}`}
        className="grid grid-cols-[10px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-tint sm:grid-cols-[10px_72px_72px_1fr_auto] sm:gap-4 sm:px-5"
      >
        <span className={`h-2 w-2 rounded-full ${tone.dot}`} aria-hidden />

        <span
          className={`hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:inline ${tone.chip}`}
        >
          {tone.label}
        </span>

        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 sm:inline">
          {problem.category}
        </span>

        <span className="min-w-0 truncate text-[14px] font-medium text-ink-950">
          {problem.title}
        </span>

        <span className="ml-auto flex items-center gap-1 font-mono text-[12px] tabular-nums text-ink-700">
          <span aria-hidden>↑</span>
          {problem.upvotes}
        </span>
      </Link>
    </li>
  );
}
