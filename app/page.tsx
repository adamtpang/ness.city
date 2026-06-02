import {
  dbProblemToTownhall,
  getEngineStats,
  listAllProposals,
  listProblems,
} from "@/lib/db/queries";
import { FadeIn } from "@/components/motion/FadeIn";
import { TownhallForum } from "./townhall/TownhallForum";
import type { Problem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Home = the engine. You land, you see the community's problems sorted by
 * what matters most, and you act: explain, fund, or fix. Nameless on
 * purpose — ness.city does one thing. No marketing rooms.
 */
export default async function Home() {
  const [rows, proposals, stats] = await Promise.all([
    listProblems(),
    listAllProposals(),
    getEngineStats(),
  ]);
  const problems: Problem[] = rows.map((r) =>
    dbProblemToTownhall({ ...r, proposals: [], bounty: null, documentation: null }),
  );

  const kpis = [
    { label: "Open", value: stats.open.toLocaleString() },
    { label: "Solved", value: stats.solved.toLocaleString() },
    { label: "Pledged", value: `$${stats.pledgedUsd.toLocaleString()}` },
    { label: "Fixers", value: stats.fixers.toLocaleString() },
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
      <FadeIn>
        <header>
          <h1 className="serif text-[56px] leading-[0.95] text-ink-950 sm:text-[88px]">
            Loch in.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.5] text-ink-700 sm:text-[18px]">
            The community solves its own problems, in the open. Surface one,
            the community sorts it by what matters, then anyone can explain,
            fund, or fix it.
          </p>
        </header>
      </FadeIn>

      {/* KPI strip */}
      <FadeIn delay={0.06}>
        <div className="mt-8 grid grid-cols-4 overflow-hidden rounded-xl border border-ink-200 bg-paper">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className={`px-4 py-4 ${i > 0 ? "border-l border-ink-100" : ""}`}
            >
              <div className="serif text-[28px] leading-none text-ink-950 sm:text-[34px]">
                {k.value}
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                {k.label}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* The engine */}
      <FadeIn delay={0.12}>
        <div className="mt-10">
          <TownhallForum problems={problems} proposals={proposals} />
        </div>
      </FadeIn>
    </main>
  );
}
