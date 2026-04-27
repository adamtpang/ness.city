import Link from "next/link";
import { notFound } from "next/navigation";
import { getCitizen, getProblem, problems } from "@/lib/data";
import { StatusBadge, CategoryTag } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const reporter = getCitizen(problem.reporterId);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-ink-200 transition-colors"
      >
        <span aria-hidden>←</span> back to feed
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-2">
          <CategoryTag category={problem.category} />
          <span className="text-ink-700">·</span>
          <StatusBadge status={problem.status} />
          <span className="text-ink-700">·</span>
          <span className="text-[12px] text-ink-500 font-mono">
            {new Date(problem.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-3 text-[28px] sm:text-[34px] font-semibold leading-tight tracking-tight text-ink-50">
          {problem.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-[13px] text-ink-400">
          {reporter && (
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 hover:text-ink-100 transition-colors"
            >
              <Avatar initials={reporter.avatar} seed={reporter.id} size={24} />
              <span>
                Surfaced by <span className="text-ink-100">{reporter.name}</span>
              </span>
            </Link>
          )}
          <span className="text-ink-700">·</span>
          <span>{problem.affected} citizens affected</span>
          <span className="text-ink-700">·</span>
          <span className="tabular-nums">{problem.upvotes} signal</span>
        </div>

        <Section title="Summary">
          <p className="text-[15px] leading-relaxed text-ink-200">{problem.summary}</p>
        </Section>

        <Section title="Why it happens" accent>
          <p className="text-[15px] leading-relaxed text-ink-200">{problem.rootCause}</p>
        </Section>

        <Section title={`Solutions (${problem.solutions.length})`}>
          {problem.solutions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-700 bg-ink-900/40 p-8 text-center">
              <p className="text-[14px] text-ink-300">No solutions yet.</p>
              <p className="mt-1 text-[12px] text-ink-500">
                First documented fix earns the credit.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-ember-500 px-4 py-2 text-[13px] font-medium text-ink-950 hover:bg-ember-400 transition-colors">
                Propose a solution
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {problem.solutions.map((s) => {
                const author = getCitizen(s.authorId);
                return (
                  <div
                    key={s.id}
                    className="rounded-xl border border-ink-800 bg-ink-900/60 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {author && (
                          <>
                            <Avatar initials={author.avatar} seed={author.id} size={32} />
                            <div>
                              <div className="text-[14px] font-medium text-ink-50">
                                {author.name}
                              </div>
                              <div className="text-[11px] text-ink-500 font-mono">
                                @{author.handle}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {s.shippedAt && (
                        <span className="rounded-full bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-900/60">
                          Shipped {new Date(s.shippedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-[15px] font-semibold text-ink-50">{s.summary}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-300">{s.body}</p>

                    <div className="mt-4 flex items-center gap-4 border-t border-ink-800 pt-3 text-[12px] text-ink-500">
                      <button className="hover:text-ember-400 transition-colors">
                        ↑ {s.upvotes}
                      </button>
                      <button className="hover:text-ink-200 transition-colors">Comment</button>
                      <span className="ml-auto font-mono">+{s.upvotes * 8} credit awarded</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="mt-8">
      <h2
        className={`text-[11px] font-mono uppercase tracking-wider mb-3 ${
          accent ? "text-ember-400" : "text-ink-500"
        }`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
