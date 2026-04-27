import { topCitizens } from "@/lib/data";
import { Avatar } from "@/components/Avatar";

export default function LeaderboardPage() {
  const ranked = topCitizens();
  const max = Math.max(...ranked.map((c) => c.credit));

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-ink-50">Citizens</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-400 max-w-xl">
          Credit is earned by documenting solutions. The leaderboard isn&apos;t about who
          posts the most — it&apos;s about who leaves the city more legible than they
          found it.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-ink-800 bg-ink-900/40">
        <div className="grid grid-cols-12 gap-4 border-b border-ink-800 px-5 py-3 text-[11px] font-mono uppercase tracking-wider text-ink-500">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Citizen</div>
          <div className="col-span-2 text-right">Solved</div>
          <div className="col-span-4 text-right">Credit</div>
        </div>

        {ranked.map((c, idx) => (
          <div
            key={c.id}
            className="grid grid-cols-12 gap-4 border-b border-ink-800/50 px-5 py-4 last:border-0 hover:bg-ink-900/60 transition-colors"
          >
            <div className="col-span-1 flex items-center text-[14px] tabular-nums text-ink-500">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <Avatar initials={c.avatar} seed={c.id} size={32} />
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium text-ink-50">{c.name}</div>
                <div className="text-[11px] text-ink-500 font-mono">@{c.handle}</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-end text-[14px] tabular-nums text-ink-300">
              {c.solved}
            </div>
            <div className="col-span-4 flex items-center justify-end gap-3">
              <div className="hidden sm:block flex-1 max-w-[140px]">
                <div className="h-1.5 w-full rounded-full bg-ink-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-400"
                    style={{ width: `${(c.credit / max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-[14px] font-semibold tabular-nums text-ember-400 min-w-[60px] text-right">
                {c.credit.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink-800 bg-ink-900/40 p-5">
        <h2 className="text-[13px] font-mono uppercase tracking-wider text-ink-500">
          How credit works
        </h2>
        <ul className="mt-3 space-y-2 text-[14px] text-ink-300">
          <li className="flex gap-3">
            <span className="font-mono text-ember-400 tabular-nums">+5</span>
            <span>Surface a problem with a real diagnosis (not just a complaint)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-ember-400 tabular-nums">+25</span>
            <span>Document a solution with steps and outcomes</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-ember-400 tabular-nums">+8</span>
            <span>Per upvote on a shipped solution from another citizen</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-ember-400 tabular-nums">+50</span>
            <span>Bonus when a solution stays unbroken for 30 days</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
