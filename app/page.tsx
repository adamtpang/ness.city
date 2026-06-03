import Link from "next/link";
import {
  getEngineStats,
  getLeaderboards,
  listProblemsWithCounts,
  type LeaderEntry,
  type ProblemWithCounts,
} from "@/lib/db/queries";
import { UpvoteButton } from "@/components/UpvoteButton";
import { NewProblemModal } from "@/components/NewProblemModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-ink-400", label: "Open" },
  investigating: { dot: "bg-amber-500", label: "Investigating" },
  "in-progress": { dot: "bg-blue-500", label: "In progress" },
  solved: { dot: "bg-emerald-500", label: "Solved" },
};

/**
 * Home = the engine, compressed. One viewport: a tight header, then a
 * three-column board, Patrons (left), the problem table (center),
 * Fixers (right). Filing a problem is a modal. No scrolling to reach
 * the thing that matters.
 */
export default async function Home() {
  const [problems, boards, stats] = await Promise.all([
    listProblemsWithCounts(),
    getLeaderboards(),
    getEngineStats(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-8 pt-4">
      {/* Compact header: title + KPIs + action, one row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="serif text-[24px] leading-none text-ink-950">Loch in.</span>
          <span className="hidden text-[12.5px] text-ink-500 sm:inline">
            The community solves its own problems, in the open.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Kpi label="Bounty value" value={`$${stats.pledgedUsd.toLocaleString()}`} />
          <Kpi label="Open" value={stats.open} />
          <Kpi label="Solved" value={stats.solved} />
          <NewProblemModal
            trigger={
              <button className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800">
                <span aria-hidden>+</span> New problem
              </button>
            }
          />
        </div>
      </div>

      {/* The board */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_180px]">
        <Rail title="Patrons" unit="$" entries={boards.patrons} empty="No patrons yet" />

        {/* Center: problem table */}
        <div className="flex min-h-[72vh] flex-col overflow-hidden rounded-xl border border-ink-200 bg-paper">
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-ink-200 bg-paper-tint px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-500 sm:px-4">
            <div>Problem</div>
            <div className="w-14 text-center" title="Importance, votes">Importance</div>
            <div className="w-16 text-center" title="Explanations and solutions">Discussion</div>
            <div className="w-20 text-right">Execution</div>
          </div>
          {problems.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-[14px] text-ink-700">No problems yet.</p>
              <p className="mt-1 text-[12px] text-ink-500">
                File the first, it shows up here instantly.
              </p>
            </div>
          ) : (
            <ul>
              {problems.map((p) => (
                <Row key={p.id} p={p} />
              ))}
            </ul>
          )}
        </div>

        <Rail title="Fixers" unit="" entries={boards.fixers} empty="No fixers yet" />
      </div>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-right">
      <div className="serif text-[18px] leading-none text-ink-950">{value}</div>
      <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink-500">
        {label}
      </div>
    </div>
  );
}

function Row({ p }: { p: ProblemWithCounts }) {
  const s = STATUS[p.status] ?? STATUS.open;
  return (
    <li className="border-b border-ink-100 last:border-0">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-paper-tint sm:px-4">
        <Link href={`/townhall/${p.slug}`} className="min-w-0">
          <span className="block truncate text-[13.5px] font-medium text-ink-950">
            {p.title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
            {p.category} · {p.affected} affected
          </span>
        </Link>
        <div className="flex w-14 justify-center">
          <UpvoteButton slug={p.slug} initial={p.upvotes} variant="inline" />
        </div>
        <Link
          href={`/townhall/${p.slug}`}
          className="w-16 text-center font-mono text-[11.5px] tabular-nums text-ink-600"
          title="Explanations · solutions"
        >
          {p.commentCount}e · {p.proposalCount}s
        </Link>
        <div className="flex w-20 items-center justify-end gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
          <span className="text-[11px] text-ink-600">{s.label}</span>
        </div>
      </div>
    </li>
  );
}

function Rail({
  title,
  unit,
  entries,
  empty,
}: {
  title: string;
  unit: string;
  entries: LeaderEntry[];
  empty: string;
}) {
  return (
    <aside className="overflow-hidden rounded-xl border border-ink-200 bg-paper">
      <div className="border-b border-ink-200 bg-paper-tint px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-500">
        {title}
      </div>
      {entries.length === 0 ? (
        <p className="px-3 py-4 text-[11.5px] text-ink-400">{empty}</p>
      ) : (
        <ul>
          {entries.map((e, i) => (
            <li
              key={e.handle}
              className={`flex items-center justify-between gap-2 px-3 py-2 ${
                i > 0 ? "border-t border-ink-100" : ""
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-[12px] text-ink-950">{e.name}</span>
                <span className="font-mono text-[10px] text-ink-400">@{e.handle}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-700">
                {unit}
                {e.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/citizens"
        className="block border-t border-ink-100 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-ink-950"
      >
        full board →
      </Link>
    </aside>
  );
}
