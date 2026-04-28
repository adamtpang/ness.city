"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Problem } from "@/lib/types";
import { getCitizen, bountyTotal } from "@/lib/data";
import { StatusBadge, CategoryTag } from "./StatusBadge";
import { Avatar } from "./Avatar";

export function ProblemCard({ problem }: { problem: Problem }) {
  const reporter = getCitizen(problem.reporterId);
  const total = bountyTotal(problem);
  const goal = problem.bounty?.goal ?? 0;
  const pct = goal > 0 ? Math.min(100, (total / goal) * 100) : 0;

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

        {problem.bounty && (
          <div className="mt-5 rounded-xl border border-ink-200 bg-paper-tint px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Bounty
              </span>
              <span className="font-mono text-[12px] tabular-nums text-ink-700">
                ${total} / ${goal}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-ink-950"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-500">
              <span>
                {problem.bounty.pledges.length}{" "}
                {problem.bounty.pledges.length === 1 ? "patron" : "patrons"}
              </span>
              <span className="capitalize">{problem.bounty.state}</span>
            </div>
          </div>
        )}

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
            {problem.proposals.length > 0 ? (
              <span className="text-ink-700">
                {problem.proposals.length}{" "}
                {problem.proposals.length === 1 ? "proposal" : "proposals"}
              </span>
            ) : (
              <span className="text-ink-400">no proposals yet</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
