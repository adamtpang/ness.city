import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db";
import { listProblems } from "@/lib/db/queries";
import { AdminProblemRow } from "@/components/AdminProblemRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">{children}</main>;
}

export default async function AdminPage({
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
          Append <code className="text-ink-800">?token=YOUR_AGENT_API_TOKEN</code> to manage the
          board.
        </p>
      </Shell>
    );
  }

  if (!isDbConfigured) {
    return (
      <Shell>
        <h1 className="serif text-[32px] text-ink-950">Admin</h1>
        <p className="mt-3 text-[14px] text-amber-700">
          Database not connected. Set DATABASE_URL in Vercel and redeploy.
        </p>
      </Shell>
    );
  }

  const problems = await listProblems();

  return (
    <Shell>
      <div className="flex items-baseline justify-between gap-3 border-b border-ink-200 pb-3">
        <h1 className="serif text-[34px] leading-none text-ink-950">Admin</h1>
        <span className="font-mono text-[13px] text-ink-600">{problems.length} problems</span>
      </div>

      {problems.length === 0 ? (
        <p className="mt-6 text-[14px] text-ink-500">
          Board is clean. Filed problems will show up here to manage.
        </p>
      ) : (
        <ul className="mt-4">
          {problems.map((p) => (
            <AdminProblemRow
              key={p.id}
              slug={p.slug}
              title={p.title}
              reporter={p.reporterDisplayName}
              token={token}
            />
          ))}
        </ul>
      )}
    </Shell>
  );
}
