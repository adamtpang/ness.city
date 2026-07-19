import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db";
import { getCounters, getDashboardRows, logDashboardView } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";
import { MEMBER_CONFIG } from "@/lib/members/config";

/**
 * Core-team dashboard — the full ranked table with every column. Role-gated
 * by ?token=AGENT_API_TOKEN (same gate as /admin). Every load is logged with
 * viewer + timestamp. Unlike the public ranking, this shows raw numbers, no
 * reveal gate, no self-hiding. Never indexed.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Members · core dashboard",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-5xl px-5 pb-24 pt-10">{children}</main>;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; as?: string }>;
}) {
  const { token, as } = await searchParams;
  const expected = process.env.AGENT_API_TOKEN ?? "";

  if (!expected || token !== expected) {
    return (
      <Shell>
        <p className="font-mono text-[13px] text-ink-500">
          Append <code className="text-ink-800">?token=YOUR_AGENT_API_TOKEN</code> to view the core dashboard.
        </p>
      </Shell>
    );
  }
  if (!isDbConfigured) {
    return (
      <Shell>
        <h1 className="serif text-[32px] text-ink-950">Core dashboard</h1>
        <p className="mt-3 text-[14px] text-amber-700">Database not connected.</p>
      </Shell>
    );
  }

  const viewer = (as ?? "core-team").slice(0, 120);
  await logDashboardView(viewer, "/members/dashboard");

  const [rows, counters, settings] = await Promise.all([
    getDashboardRows(),
    getCounters(),
    getMemberSettings(),
  ]);

  const exportHref = `/api/members/export?token=${encodeURIComponent(token)}`;

  return (
    <Shell>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-200 pb-3">
        <h1 className="serif text-[34px] leading-none text-ink-950">Core dashboard</h1>
        <div className="flex items-center gap-4 font-mono text-[12px] text-ink-600">
          <span>{counters.ratersCount} raters · {counters.totalRatings} ratings · {counters.totalMembers} members</span>
          <a href={exportHref} className="rounded-full border border-ink-300 px-3 py-1 text-ink-800 transition-colors hover:border-ink-950">
            Export CSV ↓
          </a>
        </div>
      </div>

      {settings.ratingsFrozen && (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Ratings are currently frozen (kill switch on). The public page is down.
        </p>
      )}

      <p className="mt-4 text-[12.5px] text-ink-500">
        Ranked by shrunk score (prior {MEMBER_CONFIG.score.priorMean} × {MEMBER_CONFIG.score.priorWeight}).
        Rows with fewer than {MEMBER_CONFIG.score.minRatingsToRank} ratings are flagged — rank isn&apos;t trustworthy yet.
        Raw numbers, core-team only.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-[14px] text-ink-500">No ratings yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-ink-200">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-ink-200 bg-paper-tint font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                <th className="px-3 py-2.5 font-normal">#</th>
                <th className="px-3 py-2.5 font-normal">Member</th>
                <th className="px-3 py-2.5 text-right font-normal">Score</th>
                <th className="px-3 py-2.5 text-right font-normal">Mean</th>
                <th className="px-3 py-2.5 text-right font-normal">Median</th>
                <th className="px-3 py-2.5 text-right font-normal">Ratings</th>
                <th className="px-3 py-2.5 text-right font-normal">Raters</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={`border-b border-ink-100 last:border-0 ${r.insufficient ? "bg-paper-tint/40" : "bg-paper"}`}>
                  <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="text-[14px] text-ink-950">{r.displayName}</div>
                    <div className="font-mono text-[11px] text-ink-400">
                      @{r.handle}
                      {r.building ? ` · ${r.building}` : ""}
                      {r.insufficient ? " · insufficient data" : ""}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[13px] tabular-nums text-ink-950">{r.shrunk.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[12px] tabular-nums text-ink-600">{r.mean.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[12px] tabular-nums text-ink-600">{r.median.toFixed(1)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[12px] tabular-nums text-ink-700">{r.ratings}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[12px] tabular-nums text-ink-700">{r.raters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
