import Link from "next/link";
import {
  getEngineStats,
  getLeaderboards,
  listProblemsWithCounts,
  type LeaderEntry,
  type ProblemWithCounts,
} from "@/lib/db/queries";
import { isDbConfigured } from "@/lib/db";
import { NewProblemModal } from "@/components/NewProblemModal";
import { VoteCell } from "@/components/VoteCell";
import { Avatar } from "@/components/Avatar";
import { demoBoards, demoProblems, demoStats, type DemoProblem, type DemoSolver } from "@/lib/demo-seed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-ink-400", label: "Open" },
  investigating: { dot: "bg-amber-500", label: "Investigating" },
  "in-progress": { dot: "bg-blue-500", label: "In progress" },
  solved: { dot: "bg-emerald-500", label: "Solved" },
};

const IMPORTANT = 25;
const URGENT = 25;
// Problem -> Priority -> Solution -> Bounty.
const COLS = "grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)_6rem]";

type Item = {
  p: ProblemWithCounts;
  importance: number;
  urgency: number;
  emoji: string;
  solution: string | null;
  solver: DemoSolver | null;
  surfaced: string;
  bountyUsd: number;
};

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function timeAgo(d: Date): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const byPriority = (a: Item, b: Item) =>
  b.importance - a.importance || b.urgency - a.urgency;

/**
 * Home = the engine, as the civic pipeline. Problems flow Problem ->
 * Priority -> Solution -> Bounty, grouped into Eisenhower quadrants by
 * community importance and urgency. Patrons rail left, Solvers right, both in
 * USDC. When the DB has no problems yet, a curated demo set renders.
 */
export default async function Home() {
  const [liveProblems, liveBoards, liveStats] = await Promise.all([
    listProblemsWithCounts(),
    getLeaderboards(),
    getEngineStats(),
  ]);
  // Demo board only when there is no database at all. Once the DB is wired,
  // the board is real: empty until the community files the first problem.
  const usingDemo = !isDbConfigured;
  const problems = usingDemo ? demoProblems : liveProblems;
  const boards = usingDemo ? demoBoards : liveBoards;
  const stats = usingDemo ? demoStats : liveStats;

  const items: Item[] = problems.map((p) => {
    const d = p as Partial<DemoProblem> & ProblemWithCounts;
    return {
      p,
      importance: p.upvotes,
      urgency: d.urgency ?? 0,
      emoji: d.emoji ?? "🧩",
      solution: d.solution ?? null,
      solver: d.solver ?? null,
      surfaced: d.surfaced ?? timeAgo(p.createdAt),
      bountyUsd: d.bountyUsd ?? 0,
    };
  });
  const q1 = items.filter((i) => i.importance >= IMPORTANT && i.urgency >= URGENT).sort(byPriority);
  const q2 = items.filter((i) => i.importance >= IMPORTANT && i.urgency < URGENT).sort(byPriority);
  const archived = items.filter((i) => i.importance < IMPORTANT).sort(byPriority);
  // Live problems have no urgency votes yet (that ships with identity), so
  // the Eisenhower split would dump everything into "Archived". Until a
  // second axis exists, render one honest list ranked by importance.
  const hasUrgency = items.some((i) => i.urgency > 0);
  const ranked = [...items].sort(byPriority);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-8 pt-4">
      {/* Compact header: title + KPIs + action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink-200 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="serif text-[24px] leading-none text-ink-950">Loch in.</span>
          <span className="hidden text-[12.5px] text-ink-500 sm:inline">
            The community solves its own problems, in the open.
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#2775CA]/40 bg-[#2775CA]/5 px-3 py-1.5">
            <UsdcMark />
            <div>
              <div className="serif text-[19px] leading-none text-ink-950">
                ${stats.pledgedUsd.toLocaleString()}
              </div>
              <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#2775CA]">
                Bounty value · USDC on Base
              </div>
            </div>
          </div>
          <Kpi label="Open" value={stats.open} />
          <Kpi label="Solved" value={stats.solved} />
          <NewProblemModal
            trigger={
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[#2563eb] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1d4ed8]">
                <span aria-hidden>+</span> New problem
              </button>
            }
          />
        </div>
      </div>

      {/* The board */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_180px]">
        <Rail title="Patrons" sub="USDC in" entries={boards.patrons} empty="No patrons yet" />

        {/* Center: the pipeline */}
        <div className="min-h-[72vh] overflow-hidden rounded-xl border-2 border-ink-300 bg-paper">
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div
                className={`grid ${COLS} items-center gap-3 border-b-2 border-ink-300 bg-paper-tint px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500 sm:px-4`}
              >
                <div>Problem</div>
                <div className="text-center">Priority</div>
                <div>Solution</div>
                <div className="text-right">Bounty</div>
              </div>

              {items.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-[14px] text-ink-700">No problems yet.</p>
                  <p className="mt-1 text-[12px] text-ink-500">
                    File the first, it shows up here instantly.
                  </p>
                </div>
              ) : hasUrgency ? (
                <div>
                  <QuadrantSection label="Q1 — Important + urgent" sub="Do now" accent="bg-amber-500" items={q1} />
                  <QuadrantSection label="Q2 — Important, not urgent" sub="Schedule + fund" accent="bg-blue-500" items={q2} />
                  <QuadrantSection label="Archived — not a priority now" sub="Community can revisit" accent="bg-ink-300" items={archived} muted />
                </div>
              ) : (
                <QuadrantSection
                  label="Open problems — ranked by importance"
                  sub="Vote to reorder"
                  accent="bg-blue-500"
                  items={ranked}
                />
              )}
            </div>
          </div>
        </div>

        <Rail title="Solvers" sub="USDC earned" entries={boards.fixers} empty="No solvers yet" />
      </div>
    </main>
  );
}

function UsdcMark({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[#2775CA] font-bold text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.62) }}
      title="USDC on Base"
      aria-label="USDC"
    >
      $
    </span>
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
      <div className="flex items-center gap-2 border-b border-ink-200 bg-paper-tint px-3 py-1.5 sm:px-4">
        <span className={`h-2 w-2 rounded-full ${accent}`} aria-hidden />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-800">
          {label}
        </span>
        <span className="hidden font-mono text-[10px] text-ink-400 sm:inline">· {sub}</span>
        <span className="ml-auto font-mono text-[10px] tabular-nums text-ink-500">{items.length}</span>
      </div>
      <ul className={muted ? "opacity-65" : ""}>
        {items.map((i) => (
          <Row key={i.p.id} item={i} />
        ))}
      </ul>
    </section>
  );
}

function Row({ item }: { item: Item }) {
  const { p, importance, urgency, emoji, solution, solver, surfaced, bountyUsd } = item;
  const done = p.status === "solved" || (solver?.progress ?? 0) >= 100;
  return (
    <li className="border-b border-ink-200 last:border-0">
      <div className={`grid ${COLS} items-center gap-3 px-3 py-3 transition-colors hover:bg-paper-tint sm:px-4`}>
        {/* Problem */}
        <Link href={`/townhall/${p.slug}`} className="flex min-w-0 items-start gap-2">
          <span className="text-[17px] leading-none">{emoji}</span>
          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-medium text-ink-950">{p.title}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">
              {p.category} · {p.affected} hit · {surfaced}
            </span>
          </span>
        </Link>

        {/* Priority: importance + urgency votes. Importance persists via the
            vote API on real problems; demo rows (no DB) stay local-only. */}
        <div className="flex items-start justify-center gap-3">
          <div className="flex flex-col items-center">
            <VoteCell
              slug={p.id.startsWith("demo-") ? undefined : p.slug}
              initial={importance}
              axis="importance"
            />
            <span className="font-mono text-[8px] uppercase tracking-wide text-ink-400">imp</span>
          </div>
          <div className="flex flex-col items-center">
            <VoteCell initial={urgency} axis="urgency" />
            <span className="font-mono text-[8px] uppercase tracking-wide text-ink-400">urg</span>
          </div>
        </div>

        {/* Solution + who is on it */}
        <div className="min-w-0">
          {solution ? (
            <>
              <span className="block truncate text-[12.5px] leading-snug text-ink-700">{solution}</span>
              {solver && (
                <span className="mt-1 flex items-center gap-1.5">
                  <Avatar initials={initials(solver.name)} seed={solver.handle} size={14} />
                  <span className="font-mono text-[9.5px] text-ink-500">
                    @{solver.handle} · {solver.progress}%
                  </span>
                  <span className="h-1 w-12 overflow-hidden rounded-full bg-ink-200">
                    <span
                      className={`block h-full rounded-full ${done ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${Math.max(6, solver.progress)}%` }}
                    />
                  </span>
                </span>
              )}
            </>
          ) : (
            <span className="text-[11.5px] text-ink-400">Open for solutions</span>
          )}
        </div>

        {/* Bounty */}
        <div className="flex items-center justify-end">
          {bountyUsd > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <UsdcMark size={15} />
              <span className="font-mono text-[13px] font-semibold tabular-nums text-ink-900">
                ${bountyUsd.toLocaleString()}
              </span>
            </span>
          ) : (
            <Link
              href={`/townhall/${p.slug}`}
              className="font-mono text-[11px] font-medium text-[#2563eb] hover:underline"
            >
              Fund →
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function Rail({
  title,
  sub,
  entries,
  empty,
}: {
  title: string;
  sub: string;
  entries: LeaderEntry[];
  empty: string;
}) {
  return (
    <aside className="overflow-hidden rounded-xl border-2 border-ink-300 bg-paper">
      <div className="border-b-2 border-ink-300 bg-paper-tint px-3 py-2">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-700">{title}</div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#2775CA]">{sub}</div>
      </div>
      {entries.length === 0 ? (
        <p className="px-3 py-4 text-[11.5px] text-ink-400">{empty}</p>
      ) : (
        <ul>
          {entries.map((e, i) => (
            <li
              key={e.handle}
              className={`flex items-center gap-2 px-3 py-2 ${i > 0 ? "border-t border-ink-200" : ""}`}
            >
              <Avatar initials={initials(e.name)} seed={e.handle} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] text-ink-950">{e.name}</span>
                <span className="font-mono text-[10px] text-ink-400">@{e.handle}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] font-medium tabular-nums text-ink-800">
                ${e.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/citizens"
        className="block border-t-2 border-ink-300 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-ink-950"
      >
        full board →
      </Link>
    </aside>
  );
}
