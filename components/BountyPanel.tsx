"use client";

import { motion } from "framer-motion";
import type { Problem } from "@/lib/types";
import { getCitizen, bountyTotal } from "@/lib/data";
import { getSampleCitizen, sampleBountyTotal } from "@/lib/sample";
import { Avatar } from "./Avatar";

const stateLabel: Record<NonNullable<Problem["bounty"]>["state"], string> = {
  collecting: "Collecting pledges",
  funded: "Fully funded. Needs a Fixer.",
  claimed: "Claimed. Being shipped.",
  paid: "Paid out",
};

function initialsFrom(name: string): string {
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

/**
 * Bounty status card on the problem detail page.
 * Live CTAs scroll to the real forms (#propose / #pledge / #ship / #bounty)
 * so the panel never shows a dead button.
 */
export function BountyPanel({
  problem,
  sampleMode = false,
  liveMode = false,
}: {
  problem: Problem;
  sampleMode?: boolean;
  /** When true, CTAs are real anchors into forms on the same page. */
  liveMode?: boolean;
}) {
  const lookupCitizen = sampleMode ? getSampleCitizen : getCitizen;
  const totalFn = sampleMode ? sampleBountyTotal : bountyTotal;
  const interactive = liveMode || sampleMode;

  if (!problem.bounty) {
    const nextStep =
      problem.proposals.length === 0
        ? { href: "#propose", label: "Propose a fix first" }
        : { href: "#bounty", label: "Open a bounty" };
    return (
      <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-7">
        <h3 className="serif text-[22px] leading-tight text-ink-950">
          No bounty yet.
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">
          Once a solution is proposed, anyone can open a USD bounty and pledge
          to fund it. Patrons earn attribution. Fixers earn Ness karma.
        </p>
        {interactive ? (
          <a
            href={nextStep.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            {nextStep.label}
            <span aria-hidden>→</span>
          </a>
        ) : null}
      </div>
    );
  }

  const total = totalFn(problem);
  const pct = Math.min(
    100,
    problem.bounty.goal > 0 ? (total / problem.bounty.goal) * 100 : 0,
  );
  const sortedPledges = [...problem.bounty.pledges].sort(
    (a, b) => b.amount - a.amount,
  );
  const solver = problem.bounty.claimedBy
    ? lookupCitizen(problem.bounty.claimedBy)
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-paper">
      <div className="border-b border-ink-200 bg-paper-tint px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Bounty · USDC
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-700">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                problem.bounty.state === "paid"
                  ? "bg-emerald-600"
                  : problem.bounty.state === "claimed"
                    ? "bg-blue-500"
                    : problem.bounty.state === "funded"
                      ? "bg-amber-500"
                      : "bg-ink-400"
              }`}
            />
            {stateLabel[problem.bounty.state]}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-baseline gap-2">
          <span className="serif text-[40px] leading-none text-ink-950">
            ${total.toLocaleString()}
          </span>
          <span className="text-[14px] text-ink-500">
            of ${problem.bounty.goal.toLocaleString()} goal
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-ink-950"
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-ink-500">
          <span>
            {problem.bounty.pledges.length}{" "}
            {problem.bounty.pledges.length === 1 ? "patron" : "patrons"}
          </span>
          <span>{pct.toFixed(0)}% funded</span>
        </div>

        {interactive && problem.bounty.state === "collecting" && (
          <a
            href="#pledge"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Add to bounty
            <span aria-hidden>→</span>
          </a>
        )}

        {interactive &&
          (problem.bounty.state === "funded" ||
            problem.bounty.state === "claimed") && (
            <a
              href="#ship"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              {problem.bounty.state === "funded"
                ? "Claim & ship"
                : "Document the ship"}
              <span aria-hidden>→</span>
            </a>
          )}

        {solver && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-ink-200 bg-paper-tint p-3">
            <Avatar initials={solver.avatar} seed={solver.id} size={32} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-ink-700">
                {problem.bounty.state === "paid" ? "Paid out to" : "Claimed by"}
              </div>
              <div className="text-[14px] font-medium text-ink-950">
                {solver.name}{" "}
                <span className="font-mono text-[11px] text-ink-500">
                  @{solver.handle}
                </span>
              </div>
            </div>
            {problem.bounty.paidAt && (
              <span className="font-mono text-[11px] text-ink-500">
                {new Date(problem.bounty.paidAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        )}

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Patrons
          </p>
          {sortedPledges.length === 0 ? (
            <p className="mt-3 text-[13px] text-ink-500">
              No pledges yet. Be the first patron.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sortedPledges.map((pledge) => {
                const citizen = lookupCitizen(pledge.patronId);
                const name =
                  citizen?.name ??
                  pledge.patronDisplayName ??
                  "Patron";
                const avatar = citizen?.avatar ?? initialsFrom(name);
                const seed = citizen?.id ?? pledge.patronId;
                return (
                  <li
                    key={`${pledge.patronId}-${pledge.pledgedAt}`}
                    className="flex items-start justify-between gap-3 border-b border-ink-100 pb-2 last:border-0"
                  >
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Avatar initials={avatar} seed={seed} size={24} />
                      <div className="min-w-0">
                        <div className="text-[13px] text-ink-950">{name}</div>
                        {pledge.note && (
                          <div className="mt-0.5 text-[12px] italic text-ink-500">
                            &ldquo;{pledge.note}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[13px] tabular-nums text-ink-700">
                      ${pledge.amount}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
