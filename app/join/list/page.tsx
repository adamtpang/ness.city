import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db";
import { ensureWaitlistTable, listWaitlist, type WaitlistRow } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Waitlist",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">{children}</main>
  );
}

export default async function WaitlistListPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const expected = process.env.AGENT_API_TOKEN ?? "";

  if (!expected || token !== expected) {
    return (
      <Shell>
        <p className="font-mono text-[13px] text-ink-500">
          Append <code className="text-ink-800">?token=YOUR_AGENT_API_TOKEN</code> to view the
          waitlist.
        </p>
      </Shell>
    );
  }

  if (!isDbConfigured) {
    return (
      <Shell>
        <h1 className="serif text-[32px] text-ink-950">Waitlist</h1>
        <p className="mt-3 text-[14px] text-amber-700">
          Database not connected. Add DATABASE_URL in Vercel (Production) and redeploy, then
          signups will appear here.
        </p>
      </Shell>
    );
  }

  let rows: WaitlistRow[] = [];
  let error: string | null = null;
  try {
    await ensureWaitlistTable();
    rows = await listWaitlist();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load";
  }

  const allEmails = rows.map((r) => r.email).join("\n");

  return (
    <Shell>
      <div className="flex items-baseline justify-between gap-3 border-b border-ink-200 pb-3">
        <h1 className="serif text-[34px] leading-none text-ink-950">Waitlist</h1>
        <span className="font-mono text-[13px] text-ink-600">{rows.length} signups</span>
      </div>

      {error && <p className="mt-4 text-[13px] text-amber-700">{error}</p>}

      {rows.length === 0 ? (
        <p className="mt-6 text-[14px] text-ink-500">
          No signups yet. Share ness.city/join or the QR and they will show up here.
        </p>
      ) : (
        <>
          <table className="mt-5 w-full text-left">
            <thead>
              <tr className="border-b border-ink-100 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                <th className="py-2 pr-3 font-normal">#</th>
                <th className="py-2 pr-3 font-normal">Email</th>
                <th className="py-2 font-normal">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.email}-${i}`} className="border-b border-ink-100">
                  <td className="py-2 pr-3 font-mono text-[12px] tabular-nums text-ink-400">
                    {rows.length - i}
                  </td>
                  <td className="py-2 pr-3 text-[14px] text-ink-950">{r.email}</td>
                  <td className="py-2 font-mono text-[12px] text-ink-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
              All emails (copy)
            </p>
            <textarea
              readOnly
              value={allEmails}
              className="mt-2 h-40 w-full resize-y rounded-lg border border-ink-200 bg-paper-tint p-3 font-mono text-[12px] text-ink-800 focus:outline-none"
            />
          </div>
        </>
      )}
    </Shell>
  );
}
