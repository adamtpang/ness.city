"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { topSolvers, topPatrons } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

type Tab = "solvers" | "patrons";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("solvers");

  const solvers = topSolvers();
  const patrons = topPatrons();
  const list = tab === "solvers" ? solvers : patrons;
  const empty = list.length === 0;
  const max =
    tab === "solvers"
      ? Math.max(1, ...solvers.map((c) => c.karma))
      : Math.max(1, ...patrons.map((c) => c.patronage));

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-12">
      <FadeIn>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Citizens
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950">
            Who showed up.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
            Two ways to leave the city better than you found it. Solvers ship
            the fixes. Patrons fund them. Both compound.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-ink-200 bg-paper p-1">
          <TabButton active={tab === "solvers"} onClick={() => setTab("solvers")}>
            Solvers · karma
          </TabButton>
          <TabButton active={tab === "patrons"} onClick={() => setTab("patrons")}>
            Patrons · pledged
          </TabButton>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        {empty ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              No citizens yet
            </p>
            <h2 className="serif mt-2 text-[26px] leading-tight text-ink-950">
              {tab === "solvers"
                ? "Karma is earned by shipping documented fixes."
                : "Attribution is earned by funding open bounties."}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
              {tab === "solvers"
                ? "First solver of the city: see the example fix to learn the pattern."
                : "First patrons of the city: pick an open bounty and pledge."}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                See the example
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/bounties"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
              >
                Open bounties
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200">
            <div className="grid grid-cols-12 gap-4 border-b border-ink-200 bg-paper-tint px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Citizen</div>
              <div className="col-span-2 text-right">
                {tab === "solvers" ? "Solved" : "Funded"}
              </div>
              <div className="col-span-4 text-right">
                {tab === "solvers" ? "Karma" : "Pledged"}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <StaggerList>
                  {list.map((c, idx) => {
                    const value = tab === "solvers" ? c.karma : c.patronage;
                    const count = tab === "solvers" ? c.solved : c.funded;
                    return (
                      <StaggerItem key={c.id}>
                        <div className="grid grid-cols-12 gap-4 border-b border-ink-100 bg-paper px-5 py-4 last:border-0 hover:bg-paper-tint">
                          <div className="col-span-1 flex items-center font-mono text-[13px] tabular-nums text-ink-400">
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                          <div className="col-span-5 flex min-w-0 items-center gap-3">
                            <Avatar initials={c.avatar} seed={c.id} size={34} />
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-medium text-ink-950">
                                {c.name}
                              </div>
                              <div className="font-mono text-[11px] text-ink-500">
                                @{c.handle}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center justify-end text-[14px] tabular-nums text-ink-700">
                            {count}
                          </div>
                          <div className="col-span-4 flex items-center justify-end gap-3">
                            <div className="hidden max-w-[140px] flex-1 sm:block">
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                                <div
                                  className="h-full rounded-full bg-ink-950"
                                  style={{ width: `${(value / max) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="min-w-[80px] text-right serif text-[18px] tabular-nums text-ink-950">
                              {tab === "solvers"
                                ? value.toLocaleString()
                                : `$${value.toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerList>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              How Solvers earn karma
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] text-ink-800">
              <Rule v="+5" t="Surface a problem with a real diagnosis" />
              <Rule v="+25" t="Document a shipped solution" />
              <Rule v="+8" t="Per upvote on a shipped solution" />
              <Rule v="+50" t="When a fix stays unbroken for 30 days" />
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              How Patrons earn attribution
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] text-ink-800">
              <Rule v="$" t="Pledge to any open bounty" />
              <Rule v="+1" t="Funded counter increments per problem" />
              <Rule v="★" t="First-pledger badge for kicking off a bounty" />
              <Rule v="∞" t="Permanent attribution on shipped fix" />
            </ul>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 text-[13px] transition-colors ${
        active ? "text-paper" : "text-ink-600 hover:text-ink-950"
      }`}
    >
      {active && (
        <motion.span
          layoutId="leaderboard-tab-pill"
          className="absolute inset-0 rounded-full bg-ink-950"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

function Rule({ v, t }: { v: string; t: string }) {
  return (
    <li className="flex gap-3">
      <span className="serif w-10 shrink-0 text-[16px] tabular-nums text-ink-950">{v}</span>
      <span className="text-ink-700">{t}</span>
    </li>
  );
}
