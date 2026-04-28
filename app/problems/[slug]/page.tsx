import Link from "next/link";
import { notFound } from "next/navigation";
import { getCitizen, getProblem, problems } from "@/lib/data";
import {
  getSampleCitizen,
  getSampleProblem,
  sampleProblems,
} from "@/lib/sample";
import { StatusBadge, CategoryTag } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { BountyPanel } from "@/components/BountyPanel";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export function generateStaticParams() {
  const real = problems.map((p) => ({ slug: p.slug }));
  const sample = sampleProblems.map((p) => ({ slug: p.slug }));
  const seen = new Set<string>();
  return [...real, ...sample].filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const realProblem = getProblem(slug);
  const sampleProblem = !realProblem ? getSampleProblem(slug) : undefined;
  const problem = realProblem ?? sampleProblem;
  const isSample = !!sampleProblem;

  if (!problem) notFound();

  const lookupCitizen = isSample ? getSampleCitizen : getCitizen;
  const reporter = lookupCitizen(problem.reporterId);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
      {isSample && (
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50/70 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[12px]">
                ✦
              </span>
              <div>
                <div className="text-[13px] font-medium text-amber-950">
                  This is a worked example.
                </div>
                <div className="text-[12px] text-amber-900/80">
                  Sample data from the Ness walkthrough. Real problems will appear
                  here once citizens start surfacing them.
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400 bg-paper px-3 py-1 text-[12px] font-medium text-amber-950 transition-colors hover:bg-amber-100"
            >
              Read the walkthrough
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeIn>
      )}

      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to feed
        </Link>
      </FadeIn>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <article>
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
            <h1 className="serif mt-4 text-[40px] leading-[1.05] text-ink-950 sm:text-[48px] sm:leading-[1.02]">
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
            <Section title={`Solution proposals (${problem.proposals.length})`}>
              {problem.proposals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-10 text-center">
                  <p className="serif text-[20px] text-ink-950">No proposals yet.</p>
                  <p className="mt-1.5 text-[13px] text-ink-500">
                    First proposal anchors the bounty. +25 karma.
                  </p>
                  <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
                    Propose a solution
                    <span aria-hidden>→</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {problem.proposals.map((p) => {
                    const author = lookupCitizen(p.authorId);
                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-ink-200 bg-paper p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {author && (
                              <>
                                <Avatar initials={author.avatar} seed={author.id} size={32} />
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
                        </div>

                        <h3 className="serif mt-4 text-[22px] leading-tight text-ink-950">
                          {p.summary}
                        </h3>
                        <p className="mt-2.5 text-[15px] leading-[1.65] text-ink-700">
                          {p.body}
                        </p>

                        <div className="mt-5 flex items-center gap-5 border-t border-ink-200 pt-3.5 text-[12px] text-ink-500">
                          <button className="transition-colors hover:text-ink-950">
                            ↑ {p.upvotes}
                          </button>
                          <button className="transition-colors hover:text-ink-950">
                            Comment
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </FadeInOnView>

          {problem.documentation && (
            <FadeInOnView>
              <Section title="Documentation. What shipped.">
                {(() => {
                  const author = lookupCitizen(problem.documentation!.authorId);
                  const doc = problem.documentation!;
                  return (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {author && (
                            <>
                              <Avatar initials={author.avatar} seed={author.id} size={32} />
                              <div>
                                <div className="text-[14px] font-medium text-ink-950">
                                  {author.name}
                                </div>
                                <div className="font-mono text-[11px] text-ink-500">
                                  @{author.handle} · solver
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-900">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                          Shipped{" "}
                          {new Date(doc.shippedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-4 text-[15px] leading-[1.7] text-ink-800">
                        {doc.body}
                      </p>
                      {doc.cost !== undefined && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-700">
                          Spent ${doc.cost}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Section>
            </FadeInOnView>
          )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FadeIn delay={0.2}>
            <BountyPanel problem={problem} sampleMode={isSample} />
          </FadeIn>
        </aside>
      </div>
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
