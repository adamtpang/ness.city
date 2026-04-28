import { topCitizens } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

export default function LeaderboardPage() {
  const ranked = topCitizens();
  const max = Math.max(...ranked.map((c) => c.credit));

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
            Credit is earned by documenting solutions. The leaderboard isn&apos;t
            about who posts the most — it&apos;s about who leaves the city more
            legible than they found it.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-ink-200">
          <div className="grid grid-cols-12 gap-4 border-b border-ink-200 bg-paper-tint px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Citizen</div>
            <div className="col-span-2 text-right">Solved</div>
            <div className="col-span-4 text-right">Credit</div>
          </div>

          <StaggerList>
            {ranked.map((c, idx) => (
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
                    {c.solved}
                  </div>
                  <div className="col-span-4 flex items-center justify-end gap-3">
                    <div className="hidden max-w-[140px] flex-1 sm:block">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-ink-950"
                          style={{ width: `${(c.credit / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="min-w-[60px] text-right serif text-[18px] tabular-nums text-ink-950">
                      {c.credit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            How credit works
          </h2>
          <ul className="mt-4 space-y-3 text-[15px] text-ink-800">
            <li className="flex gap-4">
              <span className="serif text-[18px] tabular-nums text-ink-950">
                +5
              </span>
              <span>Surface a problem with a real diagnosis (not just a complaint)</span>
            </li>
            <li className="flex gap-4">
              <span className="serif text-[18px] tabular-nums text-ink-950">
                +25
              </span>
              <span>Document a solution with steps and outcomes</span>
            </li>
            <li className="flex gap-4">
              <span className="serif text-[18px] tabular-nums text-ink-950">
                +8
              </span>
              <span>Per upvote on a shipped solution from another citizen</span>
            </li>
            <li className="flex gap-4">
              <span className="serif text-[18px] tabular-nums text-ink-950">
                +50
              </span>
              <span>Bonus when a solution stays unbroken for 30 days</span>
            </li>
          </ul>
        </div>
      </FadeIn>
    </main>
  );
}
