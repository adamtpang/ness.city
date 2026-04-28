import Link from "next/link";
import { activeBounties, bountyTotal, getCitizen, stats } from "@/lib/data";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/Avatar";
import { CategoryTag } from "@/components/StatusBadge";

const stateLabel: Record<string, string> = {
  collecting: "Collecting",
  funded: "Fully funded",
  claimed: "In progress",
};

export default function BountiesPage() {
  const list = activeBounties();
  const empty = list.length === 0;

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Open bounties
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950">
          Pay for what you wish was fixed.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          Patrons pledge. Solvers claim. The community votes with dollars.
          Fully-funded bounties bubble to the top. They are the ones someone
          is about to ship.
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ink-200">
          <Stat label="Active bounties" value={`${stats.activeBounties}`} />
          <Stat label="Total pledged" value={`$${stats.totalPledged.toLocaleString()}`} />
          <Stat label="Patrons" value={`${stats.citizens}`} />
        </div>
      </FadeIn>

      {empty ? (
        <FadeIn delay={0.1}>
          <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              No bounties yet
            </p>
            <h2 className="serif mt-2 text-[28px] leading-tight text-ink-950">
              A bounty appears once a problem has a proposal.
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
              Patrons can pledge to fund any open proposal. Once a bounty is
              fully funded, any citizen can claim it.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Surface a problem
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
              >
                See an example bounty
              </Link>
            </div>
          </div>
        </FadeIn>
      ) : (
        <StaggerList className="mt-10 grid gap-3">
          {list.map((p) => {
            const reporter = getCitizen(p.reporterId);
            const total = bountyTotal(p);
            const goal = p.bounty!.goal;
            const pct = Math.min(100, (total / goal) * 100);
            return (
              <StaggerItem key={p.id}>
                <Link
                  href={`/problems/${p.slug}`}
                  className="group block rounded-2xl border border-ink-200 bg-paper p-6 transition-colors hover:border-ink-400"
                >
                  <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
                    <div>
                      <div className="flex items-center gap-3">
                        <CategoryTag category={p.category} />
                        <span className="text-ink-300">·</span>
                        <span className="text-[12px] text-ink-700">
                          {stateLabel[p.bounty!.state] ?? p.bounty!.state}
                        </span>
                      </div>
                      <h3 className="serif mt-2 text-[22px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-600">
                        {p.summary}
                      </p>
                      {reporter && (
                        <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-500">
                          <Avatar initials={reporter.avatar} seed={reporter.id} size={20} />
                          <span>
                            surfaced by{" "}
                            <span className="text-ink-700">@{reporter.handle}</span>
                            {" · "}
                            {p.affected} affected
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="rounded-xl border border-ink-200 bg-paper-tint p-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="serif text-[26px] leading-none text-ink-950">
                          ${total}
                        </span>
                        <span className="text-[12px] text-ink-500">/ ${goal}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-ink-950"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
                        <span>{p.bounty!.pledges.length} patrons</span>
                        <span>{pct.toFixed(0)}% funded</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerList>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-5 py-6">
      <div className="serif text-[28px] leading-none tabular-nums text-ink-950">
        {value}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  );
}
