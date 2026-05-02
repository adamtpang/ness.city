import Link from "next/link";
import { dbProblemToTownhall, listProblems } from "@/lib/db/queries";
import { ProblemCard } from "@/components/ProblemCard";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STEPS = [
  { n: "01", title: "Surface", body: "Post the problem." },
  { n: "02", title: "Propose", body: "Pitch the fix." },
  { n: "03", title: "Pledge", body: "Fund the bounty." },
  { n: "04", title: "Ship", body: "Document. Get paid." },
];

export default async function SolvePage() {
  const rows = await listProblems();
  const problems = rows.map((r) =>
    dbProblemToTownhall({
      ...r,
      proposals: [],
      bounty: null,
      documentation: null,
    }),
  );
  const sorted = [...problems].sort((a, b) => {
    const order: Record<string, number> = {
      open: 0,
      investigating: 1,
      "in-progress": 2,
      solved: 3,
    };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.upvotes - a.upvotes;
  });
  const empty = sorted.length === 0;

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16">
      {/* Hero */}
      <section className="pt-14 pb-10 sm:pt-20">
        <FadeIn>
          <h1 className="serif text-[56px] leading-[1.0] text-ink-950 sm:text-[88px]">
            Solve.
          </h1>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="mt-3 max-w-xl text-[16px] leading-[1.55] text-ink-600 sm:text-[17px]">
            Post a problem. Someone proposes a fix. Patrons pledge. The solver
            ships, documents, and gets paid.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-7">
            <Link
              href="/solve/new"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeIn>

        {/* Steps strip */}
        <FadeIn delay={0.18}>
          <ol className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-paper px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  {s.n}
                </span>
                <h3 className="serif mt-1 text-[20px] leading-tight text-ink-950">
                  {s.title}
                </h3>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-ink-600">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </FadeIn>
      </section>

      {/* Feed */}
      <section className="pt-2 pb-10">
        {empty ? (
          <FadeInOnView>
            <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-6 py-10 text-center">
              <p className="serif text-[24px] text-ink-950">
                Nothing to fix yet.
              </p>
              <p className="mt-2 text-[13.5px] text-ink-600">
                Be the first.
              </p>
              <Link
                href="/solve/new"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Surface a problem
                <span aria-hidden>→</span>
              </Link>
            </div>
          </FadeInOnView>
        ) : (
          <StaggerList className="grid gap-3">
            {sorted.map((p) => (
              <StaggerItem key={p.id}>
                <ProblemCard problem={p} />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section>
    </main>
  );
}
