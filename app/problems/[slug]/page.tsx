import Link from "next/link";
import { notFound } from "next/navigation";
import { getCitizen, getProblem, problems } from "@/lib/data";
import { StatusBadge, CategoryTag } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

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
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-10">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to feed
        </Link>
      </FadeIn>

      <article className="mt-8">
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryTag category={problem.category} />
            <span className="text-ink-300">·</span>
            <StatusBadge status={problem.status} />
            <span className="text-ink-300">·</span>
            <span className="font-mono text-[12px] text-ink-500">
              {new Date(problem.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="serif mt-4 text-[40px] leading-[1.05] text-ink-950 sm:text-[52px] sm:leading-[1.02]">
            {problem.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-5 flex items-center gap-3 text-[13px] text-ink-600">
            {reporter && (
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 transition-colors hover:text-ink-950"
              >
                <Avatar initials={reporter.avatar} seed={reporter.id} size={24} />
                <span>
                  Surfaced by <span className="text-ink-950">{reporter.name}</span>
                </span>
              </Link>
            )}
            <span className="text-ink-300">·</span>
            <span>{problem.affected} citizens affected</span>
            <span className="text-ink-300">·</span>
            <span className="tabular-nums">{problem.upvotes} signal</span>
          </div>
        </FadeIn>

        <FadeInOnView>
          <Section title="Summary">
            <p className="text-[17px] leading-[1.7] text-ink-800">{problem.summary}</p>
          </Section>
        </FadeInOnView>

        <FadeInOnView>
          <Section title="Why it happens" pull>
            <p className="text-[17px] leading-[1.7] text-ink-800">
              {problem.rootCause}
            </p>
          </Section>
        </FadeInOnView>

        <FadeInOnView>
          <Section title={`Solutions (${problem.solutions.length})`}>
            {problem.solutions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-10 text-center">
                <p className="serif text-[20px] text-ink-950">No solutions yet.</p>
                <p className="mt-1.5 text-[13px] text-ink-500">
                  First documented fix earns the credit.
                </p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
                  Propose a solution
                  <span aria-hidden>→</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {problem.solutions.map((s) => {
                  const author = getCitizen(s.authorId);
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-ink-200 bg-paper p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {author && (
                            <>
                              <Avatar initials={author.avatar} seed={author.id} size={36} />
                              <div>
                                <div className="text-[14px] font-medium text-ink-950">
                                  {author.name}
                                </div>
                                <div className="font-mono text-[11px] text-ink-500">
                                  @{author.handle}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {s.shippedAt && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Shipped{" "}
                            {new Date(s.shippedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      <h3 className="serif mt-4 text-[22px] leading-tight text-ink-950">
                        {s.summary}
                      </h3>
                      <p className="mt-2.5 text-[15px] leading-[1.65] text-ink-700">
                        {s.body}
                      </p>

                      <div className="mt-5 flex items-center gap-5 border-t border-ink-200 pt-3.5 text-[12px] text-ink-500">
                        <button className="transition-colors hover:text-ink-950">
                          ↑ {s.upvotes}
                        </button>
                        <button className="transition-colors hover:text-ink-950">
                          Comment
                        </button>
                        <span className="ml-auto font-mono text-ink-700">
                          +{s.upvotes * 8} credit awarded
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </FadeInOnView>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
  pull,
}: {
  title: string;
  children: React.ReactNode;
  pull?: boolean;
}) {
  return (
    <section className={`mt-10 ${pull ? "rounded-2xl bg-paper-tint p-6 sm:p-8" : ""}`}>
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
