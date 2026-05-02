import Link from "next/link";
import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

const DIFFERENTIATION_ROWS: { dim: string; them: string; us: string }[] = [
  {
    dim: "Shape",
    them: "Index of links to external apps",
    us: "Integrated platform with its own tools",
  },
  {
    dim: "Loop",
    them: "Browse what exists, suggest what's missing",
    us: "Surface, fund, ship, document. Karma + USDC.",
  },
  {
    dim: "Visual mode",
    them: "Color-coded canvas of nodes",
    us: "Editorial monochrome, serif headlines, Nessie",
  },
  {
    dim: "Auth",
    them: "Discord-gated, members only",
    us: "Open. No login required to browse or draft",
  },
  {
    dim: "Voice",
    them: "Neutral aggregator",
    us: "Opinionated. Adam's POV. Wrong on purpose sometimes",
  },
  {
    dim: "Goal",
    them: "Map the ecosystem",
    us: "Pave streets in one specific city",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5">
      {/* Hero */}
      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-950 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-950" />
            </span>
            in beta · open-source · MIT
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <h1 className="serif mt-7 max-w-3xl text-[44px] leading-[1.02] text-ink-950 sm:text-[68px] sm:leading-[1.0]">
            Civic infrastructure
            <br />
            for <span className="italic">builders</span>.
          </h1>
        </FadeIn>

        <FadeIn delay={0.12}>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.65] text-ink-600 sm:text-[17px]">
            Ness is a portfolio of small, opinionated tools for ambitious
            communities. The first tool, Townhall, turns problems into
            bounties into shipped fixes. The next ones map who knows whom,
            match resumes to opportunities, and run the local economy.
            Everything is free to use, public to read, and easy to fork.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/solve"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Open Townhall
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              Browse Jobs
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              How it works →
            </Link>
          </div>
        </FadeIn>
      </section>

      <div className="divider" />

      {/* Tools grid */}
      <section id="tools" className="scroll-mt-24 py-14">
        <FadeInOnView>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              The platform
            </p>
            <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
              Four tools. One city.
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-600">
              Each tool solves a specific problem the community keeps hitting.
              The civic layer ships first. The rest follow.
            </p>
          </div>
        </FadeInOnView>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {tools.map((t) => (
            <FadeInOnView key={t.id}>
              <ToolCard tool={t} />
            </FadeInOnView>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* What's free */}
      <section className="py-14">
        <FadeInOnView>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            What you can do right now
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            Free, in five clicks.
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-600">
            No login, no email gate, no paywall. Free tooling builds trust.
            Trust builds networks.
          </p>
        </FadeInOnView>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FadeInOnView>
            <FreeCard
              eyebrow="Townhall"
              title="Surface a problem in 90 seconds"
              body="A real diagnosis, not a complaint. Earns +5 karma when writes go live. Until then, drafts persist locally."
              href="/solve/new"
              cta="Start drafting"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="Jobs"
              title="Curated openings, no login"
              body="36 hand-picked public jobs across engineering, AI, design, product. Direct apply links to the company's own page."
              href="/jobs"
              cta="Browse jobs"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="Townhall"
              title="See an end-to-end fix"
              body="A walkthrough of one bounty. Five patrons crowdfund $240. A solver ships, documents, claims. The pattern in 8 minutes."
              href="/about"
              cta="Read the walkthrough"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="Citizens"
              title="Two leaderboards, both free"
              body="Solvers earn karma. Patrons earn permanent attribution. The board is the city's memory of who showed up."
              href="/citizens"
              cta="See the leaderboards"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="Match · soon"
              title="Resume → top opportunities"
              body="Drop a resume. We score it against every open role and every bounty. Get back the 80%+ matches with next steps."
              href="/match"
              cta="See the plan"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="PageRank"
              title="Map your ring in six rounds"
              body="Name 1, then 2, then 4, then 8, then 16, then 32. Save state on your device. See who the city has named most."
              href="/pagerank"
              cta="Start mapping"
            />
          </FadeInOnView>
          <FadeInOnView>
            <FreeCard
              eyebrow="Tools · soon"
              title="The free utility belt"
              body="NS points calculator. Visa-run planner. Bounty USD-to-karma converter. Small calculators, no login."
              href="/tools"
              cta="Peek at the roadmap"
            />
          </FadeInOnView>
        </div>
      </section>

      <div className="divider" />

      {/* Differentiation */}
      <section className="py-14">
        <FadeInOnView>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Not a directory
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            Ness builds. Directories index.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-ink-600">
            There are good directories of community tooling already. Ness is
            something different: a small set of integrated tools with their
            own opinions and an economic loop attached. Same neighbourhood,
            different building.
          </p>
        </FadeInOnView>

        <FadeInOnView>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-px border-b border-ink-200 bg-ink-200">
              <div className="bg-paper-tint px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                What it is
              </div>
              <div className="bg-paper-tint px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Directories (e.g. tools.ns.com, nstools.xyz)
              </div>
              <div className="bg-paper-tint px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-nessie-700">
                Ness
              </div>
            </div>
            {DIFFERENTIATION_ROWS.map((row, idx) => (
              <div
                key={row.dim}
                className={`grid grid-cols-[1fr_1fr_1fr] gap-px ${
                  idx > 0 ? "border-t border-ink-100" : ""
                }`}
              >
                <div className="bg-paper px-4 py-3 text-[12.5px] text-ink-700">
                  {row.dim}
                </div>
                <div className="bg-paper px-4 py-3 text-[12.5px] text-ink-500">
                  {row.them}
                </div>
                <div className="bg-paper px-4 py-3 text-[12.5px] text-ink-950">
                  {row.us}
                </div>
              </div>
            ))}
          </div>
        </FadeInOnView>
      </section>

      <div className="divider" />

      {/* Open source */}
      <section className="py-14">
        <FadeInOnView>
          <div className="rounded-2xl border border-ink-950 bg-ink-950 p-7 text-paper sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
              Open source · MIT
            </p>
            <h2 className="serif mt-2 text-[28px] leading-tight sm:text-[36px]">
              Read the code. Fork the city. Send a PR.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-ink-200">
              The repo is public on GitHub under MIT. The merge button is mine.
              That&apos;s the deal: anyone can read, fork, suggest, and learn.
              Adam reviews and merges PRs from outside collaborators on the
              same bar as internal ones: clarity, correctness, taste.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/adamtpang/ness"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-opacity hover:opacity-90"
              >
                Open the repo
                <span aria-hidden>↗</span>
              </a>
              <a
                href="https://github.com/adamtpang/ness/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                How to contribute
              </a>
              <a
                href="https://github.com/adamtpang/ness/issues?q=label%3Afeedback"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium text-ink-300 transition-colors hover:text-paper"
              >
                See feedback issues →
              </a>
            </div>
          </div>
        </FadeInOnView>
      </section>
    </main>
  );
}

function FreeCard({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-950"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {eyebrow}
      </p>
      <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-[1.6] text-ink-600">
        {body}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-950">
        {cta}
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
