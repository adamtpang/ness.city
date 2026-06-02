import { dbProblemToTownhall, listAllProposals, listProblems } from "@/lib/db/queries";
import { FadeIn } from "@/components/motion/FadeIn";
import { TownhallForum } from "./TownhallForum";
import type { Problem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * /townhall — the Townhall.
 * The community's problem board (the old standalone townhall.town, now
 * the core feature of ness.city). Server fetches; client shell handles
 * tabs, search, filters, sort. GitHub-Issues structure: Open/Closed
 * tabs, filter dropdowns, dense ledger of one-line rows.
 */
export default async function TownhallPage() {
  const [rows, proposals] = await Promise.all([listProblems(), listAllProposals()]);
  const problems: Problem[] = rows.map((r) =>
    dbProblemToTownhall({ ...r, proposals: [], bounty: null, documentation: null }),
  );

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-6">
      <FadeIn>
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              Townhall · the open-source repo of the community
            </p>
            <h1 className="serif mt-1 text-[36px] leading-[1.02] text-ink-950 sm:text-[44px]">
              Problems.
            </h1>
          </div>
          <p className="max-w-sm text-[13px] leading-[1.55] text-ink-600">
            Anyone files. Anyone proposes. Patrons pledge. A Fixer ships and
            gets paid. Public, attributed, permanent.
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={0.05}>
        <TownhallForum problems={problems} proposals={proposals} />
      </FadeIn>
    </main>
  );
}
