"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Problem } from "@/lib/types";
import { getCitizen } from "@/lib/data";
import { StatusBadge, CategoryTag } from "./StatusBadge";
import { Avatar } from "./Avatar";

export function ProblemCard({ problem }: { problem: Problem }) {
  const reporter = getCitizen(problem.reporterId);
  const solverIds = Array.from(new Set(problem.solutions.map((s) => s.authorId)));

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/problems/${problem.slug}`}
        className="group block rounded-2xl border border-ink-200 bg-paper p-6 transition-colors hover:border-ink-400"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-3">
              <CategoryTag category={problem.category} />
              <span className="text-ink-300">·</span>
              <StatusBadge status={problem.status} />
            </div>

            <h3 className="serif text-[22px] leading-[1.15] text-ink-950 transition-opacity group-hover:opacity-70">
              {problem.title}
            </h3>

            <p className="mt-2.5 line-clamp-2 text-[14px] leading-relaxed text-ink-600">
              {problem.summary}
            </p>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <div className="font-mono text-[24px] tabular-nums text-ink-950">
              {problem.upvotes}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
              signal
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-200 pt-4">
          <div className="flex items-center gap-2.5 text-[12px] text-ink-500">
            {reporter && (
              <>
                <Avatar initials={reporter.avatar} seed={reporter.id} size={20} />
                <span>
                  <span className="text-ink-700">@{reporter.handle}</span>
                  <span className="text-ink-300"> · </span>
                  <span>{problem.affected} affected</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-[12px]">
            {problem.solutions.length > 0 ? (
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-1.5">
                  {solverIds.slice(0, 3).map((id) => {
                    const c = getCitizen(id);
                    return c ? (
                      <Avatar key={id} initials={c.avatar} seed={c.id} size={20} />
                    ) : null;
                  })}
                </div>
                <span className="text-emerald-700">
                  {problem.solutions.length}{" "}
                  {problem.solutions.length === 1 ? "solution" : "solutions"}
                </span>
              </div>
            ) : (
              <span className="text-ink-400">no solutions yet</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
