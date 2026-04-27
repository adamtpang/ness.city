import Link from "next/link";
import type { Problem } from "@/lib/types";
import { getCitizen } from "@/lib/data";
import { StatusBadge, CategoryTag } from "./StatusBadge";
import { Avatar } from "./Avatar";

export function ProblemCard({ problem }: { problem: Problem }) {
  const reporter = getCitizen(problem.reporterId);
  const solverIds = Array.from(new Set(problem.solutions.map((s) => s.authorId)));

  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="group block rounded-xl border border-ink-800 bg-ink-900/60 p-5 transition-all hover:border-ink-700 hover:bg-ink-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <CategoryTag category={problem.category} />
            <span className="text-ink-700">·</span>
            <StatusBadge status={problem.status} />
          </div>
          <h3 className="text-[15px] font-semibold leading-snug text-ink-50 group-hover:text-ember-400 transition-colors">
            {problem.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-400">
            {problem.summary}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-lg font-semibold text-ink-100 tabular-nums">{problem.upvotes}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-500">signal</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-800 pt-3">
        <div className="flex items-center gap-2 text-[12px] text-ink-500">
          {reporter && (
            <>
              <Avatar initials={reporter.avatar} seed={reporter.id} size={20} />
              <span>
                <span className="text-ink-400">{reporter.handle}</span>
                <span className="text-ink-700"> · </span>
                <span>{problem.affected} affected</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-[12px]">
          {problem.solutions.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {solverIds.slice(0, 3).map((id) => {
                  const c = getCitizen(id);
                  return c ? <Avatar key={id} initials={c.avatar} seed={c.id} size={20} /> : null;
                })}
              </div>
              <span className="text-emerald-400">
                {problem.solutions.length} {problem.solutions.length === 1 ? "solution" : "solutions"}
              </span>
            </div>
          ) : (
            <span className="text-ink-500">no solutions yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}
