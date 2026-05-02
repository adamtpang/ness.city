import Link from "next/link";
import { notFound } from "next/navigation";
import { dbProblemToTownhall, getProblemBySlug } from "@/lib/db/queries";
import {
  getSampleCitizen,
  getSampleProblem,
  sampleProblems,
} from "@/lib/sample";
import { StatusBadge, CategoryTag } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { BountyPanel } from "@/components/BountyPanel";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import {
  ProposeForm,
  StartBountyForm,
  PledgeForm,
  DocumentForm,
} from "@/components/TownhallActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// We still pre-render the sample slugs so /about's worked-example link
// works even if there are no real entries yet.
export function generateStaticParams() {
  return sampleProblems.map((p) => ({ slug: p.slug }));
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbRow = await getProblemBySlug(slug);
  const sampleProblem = !dbRow ? getSampleProblem(slug) : undefined;
  const problem = dbRow
    ? dbProblemToTownhall(dbRow)
    : sampleProblem;
  const isSample = !dbRow && !!sampleProblem;

  if (!problem) notFound();

  const reporter = isSample
    ? getSampleCitizen(problem.reporterId)
    : null; // db reporters resolve through the embedded reporterDisplayName instead

  const reporterName =
    reporter?.name ??
    (dbRow?.reporterDisplayName ?? "Anonymous");
  const reporterAvatar =
    reporter?.avatar ??
    (dbRow?.reporterDisplayName ?? "AN")
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const reporterSeed =
    reporter?.id ?? (dbRow?.reporterId ?? slug);

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
                  Sample data from the Ness walkthrough. Real problems live in
                  the DB and render with full proposal / bounty / pledge / doc
                  forms.
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
          href="/solve"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to townhall
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
              <Link
                href="/citizens"
                className="flex items-center gap-2 transition-colors hover:text-ink-950"
              >
                <Avatar initials={reporterAvatar} seed={reporterSeed} size={24} />
                <span>
                  Surfaced by{" "}
                  <span className="text-ink-950">{reporterName}</span>
                </span>
              </Link>
              <span className="text-ink-300">·</span>
              <span>{problem.affected} citizens affected</span>
            </div>
          </FadeIn>

          <FadeInOnView>
            <Section title="Summary">
              <p className="text-[17px] leading-[1.7] text-ink-800">
                {problem.summary}
              </p>
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
                <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-7 text-center">
                  <p className="serif text-[20px] text-ink-950">
                    No proposals yet.
                  </p>
                  <p className="mt-1.5 text-[13px] text-ink-500">
                    First proposal anchors the bounty.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {problem.proposals.map((p) => {
                    const author = isSample
                      ? getSampleCitizen(p.authorId)
                      : null;
                    const name = author?.name ?? "Anonymous";
                    const initials =
                      author?.avatar ??
                      name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-ink-200 bg-paper p-6"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={initials}
                            seed={author?.id ?? p.id}
                            size={32}
                          />
                          <div>
                            <div className="text-[14px] font-medium text-ink-950">
                              {name}
                            </div>
                            {author && (
                              <div className="font-mono text-[11px] text-ink-500">
                                @{author.handle}
                              </div>
                            )}
                          </div>
                        </div>
                        <h3 className="serif mt-4 text-[22px] leading-tight text-ink-950">
                          {p.summary}
                        </h3>
                        <p className="mt-2.5 text-[15px] leading-[1.65] text-ink-700">
                          {p.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </FadeInOnView>

          {/* Live action: propose */}
          {!isSample && problem.status !== "solved" && (
            <FadeInOnView>
              <div className="mt-6">
                <ProposeForm problemSlug={problem.slug} />
              </div>
            </FadeInOnView>
          )}

          {/* Live action: open bounty (if proposals exist but no bounty) */}
          {!isSample && !problem.bounty && problem.proposals.length > 0 && (
            <FadeInOnView>
              <div className="mt-3">
                <StartBountyForm
                  problemSlug={problem.slug}
                  proposals={problem.proposals.map((p) => ({
                    id: p.id,
                    summary: p.summary,
                  }))}
                />
              </div>
            </FadeInOnView>
          )}

          {problem.documentation && (
            <FadeInOnView>
              <Section title="Documentation. What shipped.">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
                  <p className="text-[14px] font-medium text-ink-950">
                    Solver: {problem.documentation.authorId}
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.7] text-ink-800">
                    {problem.documentation.body}
                  </p>
                  {problem.documentation.cost !== undefined && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-700">
                      Spent ${problem.documentation.cost}
                    </div>
                  )}
                </div>
              </Section>
            </FadeInOnView>
          )}

          {/* Live action: ship documentation (when funded or claimed) */}
          {!isSample &&
            problem.bounty &&
            (problem.bounty.state === "funded" ||
              problem.bounty.state === "claimed") &&
            !problem.documentation && (
              <FadeInOnView>
                <div className="mt-6">
                  <DocumentForm problemSlug={problem.slug} />
                </div>
              </FadeInOnView>
            )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FadeIn delay={0.2}>
            <BountyPanel problem={problem} sampleMode={isSample} />
          </FadeIn>
          {/* Live action: pledge */}
          {!isSample &&
            problem.bounty &&
            problem.bounty.state !== "paid" &&
            dbRow?.bounty?.id && (
              <FadeIn delay={0.26}>
                <div className="mt-3 rounded-2xl border border-ink-200 bg-paper p-5">
                  <PledgeForm bountyId={dbRow.bounty.id} />
                </div>
              </FadeIn>
            )}
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
    <section
      className={`mt-10 ${pull ? "rounded-2xl bg-paper-tint p-6 sm:p-8" : ""}`}
    >
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
