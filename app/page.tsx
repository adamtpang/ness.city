import Link from "next/link";
import {
  getEngineStats,
  getLeaderboards,
  listProblemsWithCounts,
  type LeaderEntry,
  type ProblemWithCounts,
} from "@/lib/db/queries";
import { NewProblemModal } from "@/components/NewProblemModal";
import { demoBoards, demoProblems, demoStats } from "@/lib/demo-seed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-ink-400", label: "Open" },
  investigating: { dot: "bg-amber-500", label: "Investigating" },
  "in-progress": { dot: "bg-blue-500", label: "In progress" },
  solved: { dot: "bg-emerald-500", label: "Solved" },
};

// Community thresholds for the Eisenhower split.
const IMPORTANT = 25;
const URGENT = 25;
const COLS = "grid-cols-[1fr_2.25rem_2.25rem_3rem_4.5rem]";

type Item = { p: ProblemWithCounts; urgency: number };

function urgencyOf(p: ProblemWithCounts): number {
  return (p as { urgency?: number }).urgency ?? 0;
}

/**
 * Home = the engine as an Eisenhower quest board. Problems are sorted by
 * community importance and urgency into Q1 (do now), Q2 (schedule and fund),
 * and Archived (revisit later). Patrons rail left, Solvers rail right. When
 * the DB has no problems yet, a curated demo set renders so the board is full.
 */
export default async function Home() {
  const [liveProblems, liveBoards, liveStats] = await Promise.all([
    listProblemsWithCounts(),
    getLeaderboards(),
    getEngineStats(),
  ]);
  const usingDemo = liveProblems.length === 0;
  const problems = usingDemo ? demoProblems : liveProblems;
  const boards = usingDemo ? demoBoards : liveBoards;
  const stats = usingDemo ? demoStats : liveStats;

  const items: Item[] = problems.map((p) => ({ p, urgency: urgencyOf(p) }));
  const q1 = items.filter((i) => i.p.upvotes >= IMPORTANT && i.urgency >= URGENT);
  const q2 = items.filter((i) => i.p.upvotes >= IMPORTANT && i.urgency < URGENT);
  const archived = items.filter((i) => i.p.upvotes < IMPORTANT);

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

        {/* Center: prioritized quest board */}
        <div className="flex min-h-[72vh] flex-col overflow-hidden rounded-xl border border-ink-200 bg-paper">
          <div
            className={`grid ${COLS} items-center gap-2 border-b border-ink-200 bg-paper-tint px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500 sm:px-4`}
          >
            <div>Problem</div>
            <div className="text-center" title="Community importance">Imp</div>
            <div className="text-center" title="Community urgency">Urg</div>
            <div className="text-center" title="Explanations and solutions">Disc</div>
            <div className="text-right">Status</div>
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-[14px] text-ink-700">No problems yet.</p>
              <p className="mt-1 text-[12px] text-ink-500">
                File the first, it shows up here instantly.
              </p>
            </div>
          ) : (
            <div>
              <QuadrantSection label="Q1 — Important + urgent" sub="Do now" accent="bg-amber-500" items={q1} />
              <QuadrantSection label="Q2 — Important, not urgent" sub="Schedule + fund" accent="bg-blue-500" items={q2} />
              <QuadrantSection label="Archived — not a priority now" sub="Community can revisit" accent="bg-ink-300" items={archived} muted />
            </div>
          )}
        </div>

        <Rail title="Solvers" unit="" entries={boards.fixers} empty="No solvers yet" />
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

function QuadrantSection({
  label,
  sub,
  accent,
  items,
  muted,
}: {
  label: string;
  sub: string;
  accent: string;
  items: Item[];
  muted?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-paper-tint/60 px-3 py-1.5 sm:px-4">
        <span className={`h-1.5 w-1.5 rounded-full ${accent}`} aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
          {label}
        </span>
        <span className="hidden font-mono text-[10px] text-ink-400 sm:inline">· {sub}</span>
        <span className="ml-auto font-mono text-[10px] tabular-nums text-ink-400">{items.length}</span>
      </div>
      <ul className={muted ? "opacity-70" : ""}>
        {items.map((i) => (
          <Row key={i.p.id} item={i} />
        ))}
      </ul>
    </section>
  );
}

function Row({ item }: { item: Item }) {
  const { p, urgency } = item;
  const s = STATUS[p.status] ?? STATUS.open;
  return (
    <li className="border-b border-ink-100 last:border-0">
      <div className={`grid ${COLS} items-center gap-2 px-3 py-2.5 transition-colors hover:bg-paper-tint sm:px-4`}>
        <Link href={`/townhall/${p.slug}`} className="min-w-0">
          <span className="block truncate text-[13.5px] font-medium text-ink-950">{p.title}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
            {p.category} · {p.affected} affected
          </span>
        </Link>
        <span className="text-center font-mono text-[13px] font-medium tabular-nums text-ink-950">
          {p.upvotes}
        </span>
        <span className="text-center font-mono text-[13px] tabular-nums text-ink-600">
          {urgency}
        </span>
        <Link
          href={`/townhall/${p.slug}`}
          className="text-center font-mono text-[11px] tabular-nums text-ink-600"
          title="Explanations · solutions"
        >
          {p.commentCount}e·{p.proposalCount}s
        </Link>
        <div className="flex items-center justify-end gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
          <span className="hidden text-[11px] text-ink-600 sm:inline">{s.label}</span>
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
              className={`flex items-center justify-between gap-2 px-3 py-2 ${i > 0 ? "border-t border-ink-100" : ""}`}
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
