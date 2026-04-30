import Link from "next/link";
import {
  getSampleCitizen,
  getSampleProblem,
  sampleBountyTotal,
} from "@/lib/sample";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { Avatar } from "@/components/Avatar";
import { NessieLogo } from "@/components/NessieLogo";

export default function AboutPage() {
  const wifi = getSampleProblem("wifi-drops-coworking-3pm")!;
  const reporter = getSampleCitizen(wifi.reporterId)!;
  const proposalAuthor = getSampleCitizen(wifi.proposals[0].authorId)!;
  const solver = getSampleCitizen(wifi.bounty!.claimedBy!)!;
  const total = sampleBountyTotal(wifi);

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-14">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          How Ness works
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <h1 className="serif mt-3 text-[52px] leading-[1.02] text-ink-950 sm:text-[64px]">
          A city that
          <br />
          <span className="italic">fixes itself.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-ink-200 bg-paper-tint px-4 py-2 text-[13px] text-ink-700">
          <div className="text-ink-950">
            <NessieLogo className="h-4 w-7" withWater={false} />
          </div>
          <span className="serif italic">
            &ldquo;Whatever the core team can do, they should do. Whatever the
            community can do, we should do.&rdquo;
          </span>
        </div>
      </FadeIn>

      <FadeInOnView>
        <p className="mt-10 text-[18px] leading-[1.7] text-ink-800">
          Every community has a core team. Call them the government. They keep
          the lights on. They keep the visas working. They keep the roof
          intact. They are good at their jobs. They are also outnumbered.
        </p>
      </FadeInOnView>

      <FadeInOnView>
        <p className="mt-6 text-[18px] leading-[1.7] text-ink-800">
          A real city, one with a thousand small frictions every day,
          doesn&apos;t survive top-down. It survives because citizens notice
          things, name them, fund them, and quietly fix them.
        </p>
      </FadeInOnView>

      <FadeInOnView>
        <p className="mt-6 text-[18px] leading-[1.7] text-ink-800">
          Ness is the engine that turns notice into shipped fixes, in five
          steps. The same shape an open-source repo has, applied to a
          community: issues become problems, pull requests become solutions,
          attribution sticks to the people who actually shipped.
        </p>
      </FadeInOnView>

      {/* Worked example header */}
      <FadeInOnView>
        <div className="mt-16 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Worked example · sample data
          </p>
          <h2 className="serif mt-2 text-[26px] leading-tight text-ink-950">
            {wifi.title}
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">
            We&apos;ll walk through how this single problem moved through Ness,
            from one citizen noticing, to a paid-out, documented fix. The
            actual platform starts empty. This is how it&apos;s designed to
            work once people use it.
          </p>
          <Link
            href={`/problems/${wifi.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-ink-950 hover:opacity-70"
          >
            Open the example problem page
            <span aria-hidden>→</span>
          </Link>
        </div>
      </FadeInOnView>

      {/* Step 1 */}
      <Step
        n="01"
        title="Surface"
        actor={
          <span className="inline-flex items-center gap-2">
            <Avatar initials={reporter.avatar} seed={reporter.id} size={20} />
            <span className="text-ink-950">{reporter.name}</span>
            <span className="text-ink-500">noticed it</span>
          </span>
        }
      >
        <p>
          Priya files the problem in 90 seconds. The form requires a real
          diagnosis, not a complaint. She writes:
        </p>
        <Quote>{wifi.summary}</Quote>
        <p className="mt-4">
          Filing earns <KarmaPill>+5</KarmaPill> for surfacing with a real
          diagnosis. <em>&ldquo;The wifi sucks&rdquo;</em> would have earned
          zero.
        </p>
      </Step>

      {/* Step 2 */}
      <Step n="02" title="Explain" actor="The community refines the why">
        <p>
          The post asks for a root cause, not a symptom. Within a day,
          Priya, Marcus, and three others converge on:
        </p>
        <Quote>{wifi.rootCause}</Quote>
        <p className="mt-4">
          The diagnosis is now load-bearing. The next step has something to fix
          against.
        </p>
      </Step>

      {/* Step 3 */}
      <Step
        n="03"
        title="Propose"
        actor={
          <span className="inline-flex items-center gap-2">
            <Avatar initials={proposalAuthor.avatar} seed={proposalAuthor.id} size={20} />
            <span className="text-ink-950">{proposalAuthor.name}</span>
            <span className="text-ink-500">drafts a fix</span>
          </span>
        }
      >
        <p>
          Marcus knows networks. He proposes a concrete, two-step fix with a
          parts list:
        </p>
        <Quote>{wifi.proposals[0].summary}</Quote>
        <p className="mt-4">
          Proposals are scoped: parts, hours, expected outcome. They&apos;re
          how the bounty gets sized.
        </p>
      </Step>

      {/* Step 4 */}
      <Step n="04" title="Bounty" actor="The community pledges money">
        <p>
          Patrons crowdfund the proposal. Each pledge is public. Each
          patron earns attribution forever. For this fix:
        </p>
        <div className="mt-5 rounded-xl border border-ink-200 bg-paper p-5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="serif text-[28px] leading-none text-ink-950">
              ${total}
            </span>
            <span className="font-mono text-[11px] text-ink-500">
              {wifi.bounty!.pledges.length} patrons
            </span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {wifi.bounty!.pledges.slice(0, 3).map((pl) => {
              const p = getSampleCitizen(pl.patronId);
              if (!p) return null;
              return (
                <li
                  key={pl.patronId}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className="flex items-center gap-2">
                    <Avatar initials={p.avatar} seed={p.id} size={18} />
                    <span className="text-ink-700">{p.name}</span>
                  </span>
                  <span className="font-mono tabular-nums text-ink-700">
                    ${pl.amount}
                  </span>
                </li>
              );
            })}
            <li className="text-[12px] text-ink-500">
              + {wifi.bounty!.pledges.length - 3} more
            </li>
          </ul>
        </div>
        <p className="mt-4">
          Patrons earn no karma. They earn{" "}
          <span className="text-ink-950">attribution</span>. Their name lives
          on the fix forever, even when they leave the city.
        </p>
      </Step>

      {/* Step 5 */}
      <Step
        n="05"
        title="Solve & document"
        actor={
          <span className="inline-flex items-center gap-2">
            <Avatar initials={solver.avatar} seed={solver.id} size={20} />
            <span className="text-ink-950">{solver.name}</span>
            <span className="text-ink-500">claims the bounty, ships</span>
          </span>
        }
      >
        <p>
          Once funded, any citizen can claim the bounty. They have to ship
          AND write up what they did. The documentation is the deliverable.
        </p>
        <Quote>{wifi.documentation!.body}</Quote>
        <p className="mt-4">
          Marcus earns <KarmaPill>+25</KarmaPill> for documentation,{" "}
          <KarmaPill>+{wifi.documentation!.upvotes * 8}</KarmaPill> for
          community upvotes, and the cash bounty. The fix becomes part of the
          city&apos;s permanent memory. The next person doesn&apos;t start
          from zero.
        </p>
      </Step>

      <FadeInOnView>
        <div className="mt-16 rounded-2xl border border-ink-950 bg-ink-950 p-7 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            The engine
          </p>
          <h2 className="serif mt-2 text-[26px] leading-tight">
            Surface. Explain. Propose. Bounty. Ship.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-ink-200">
            Two leaderboards keep score. <strong>Solvers</strong> earn karma.{" "}
            <strong>Patrons</strong> earn attribution. Neither one runs the
            city alone. Together they do.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-opacity hover:opacity-90"
            >
              See the leaderboards →
            </Link>
            <Link
              href="/bounties"
              className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Open bounties →
            </Link>
          </div>
        </div>
      </FadeInOnView>

      {/* Bigger picture */}
      <FadeInOnView>
        <div className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            The bigger picture
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            Ness is one node in <span className="italic">interneta</span>.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-ink-700">
            Ness is one tool in a larger umbrella Adam Pang is building called{" "}
            <span className="text-ink-950">interneta</span>: civic
            infrastructure for the kind of community that lives partly online,
            partly off, and answers to its citizens. The thinking comes from
            Balaji&apos;s The Network State. The shape comes from how
            open-source repos work: issues, pull requests, attribution that
            sticks. The first community Ness was built at gave us the
            constraints. The platform is general.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill href="https://thenetworkstate.com">thenetworkstate.com</Pill>
            <Pill>interneta.world (soon)</Pill>
          </div>
        </div>
      </FadeInOnView>

      {/* Roadmap */}
      <FadeInOnView>
        <div className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            What&apos;s coming
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            The full city, in phases.
          </h2>
        </div>
      </FadeInOnView>

      <div className="mt-8 space-y-3">
        <FadeInOnView>
          <RoadmapRow
            phase="Now"
            title="Townhall UI + draft form + open-source repo"
            body="The civic-layer UI is live. Drafts persist locally. Repo is public on GitHub under MIT, with branch protection so Adam controls the merge button."
            status="shipped"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Now"
            title="Feedback widget"
            body="Floating button on every page. One tap rates Ness 1 to 5. If under 5, it asks why. The submission files a labeled GitHub issue into adamtpang/ness."
            status="shipped"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Now"
            title="Jobs board"
            body="Curated public openings, filtered by role and remote. v1 is hand-curated. v2 will pull from approved sources via direct integration, not user-token scraping."
            status="shipped"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Now"
            title="A3 application + permissioning"
            body="Operating as an Unofficial A3 App. One-month initial term. Symbiotic, not parasitic. Permission-first relationship with the host community."
            status="next"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Next"
            title="Postgres + auth + real writes"
            body="Vercel Postgres for the data. Clerk for auth in beta, with a path to community-directory single sign-on once approved. Real submit, pledge, claim, upvote."
            status="next"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Next"
            title="USDC bounties on Base"
            body="No Stripe. Community members already hold USDC wallets. Pledges escrow on Base, payout wallet to wallet when a bounty is claimed and shipped. Ness handles the schema, the chain handles the money."
            status="next"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Next"
            title="Weekly in-person townhalls + pulse reports"
            body="One hour a week, in person. Open bounties get pitched, claimed, retired. A parallel weekly pulse interviews citizens and publishes a clean field report back to the host community's leadership."
            status="next"
          />
        </FadeInOnView>
        <FadeInOnView>
          <RoadmapRow
            phase="Later"
            title="Atlas + Market"
            body="The remaining tools. Atlas (social graph). Market (products, services, assets). Each one earns its place by solving something real."
            status="later"
          />
        </FadeInOnView>
      </div>

      <FadeInOnView>
        <div className="mt-16 flex flex-wrap gap-3 border-t border-ink-200 pt-10">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Surface a problem
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            See the feed
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function Step({
  n,
  title,
  actor,
  children,
}: {
  n: string;
  title: string;
  actor: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <FadeInOnView>
      <div className="mt-10 grid gap-5 sm:grid-cols-[60px_1fr]">
        <div className="hidden sm:block">
          <div className="serif text-[40px] leading-none text-ink-300">{n}</div>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="serif text-[24px] leading-tight text-ink-950">
              {title}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 sm:hidden">
              Step {n}
            </span>
          </div>
          <div className="mt-2 text-[13px] text-ink-500">{actor}</div>
          <div className="mt-5 space-y-0 text-[15.5px] leading-[1.7] text-ink-700">
            {children}
          </div>
        </div>
      </div>
    </FadeInOnView>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-4 border-l-2 border-ink-950 pl-4 text-[15px] italic text-ink-700">
      {children}
    </blockquote>
  );
}

function KarmaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink-300 bg-paper-tint px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink-950">
      {children}
    </span>
  );
}

function Pill({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1.5 font-mono text-[12px] text-ink-700";
  if (!href) {
    return <span className={`${cls} opacity-60`}>{children}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} transition-colors hover:border-ink-950 hover:text-ink-950`}
    >
      {children}
      <span aria-hidden className="text-ink-400">↗</span>
    </a>
  );
}

function RoadmapRow({
  phase,
  title,
  body,
  status,
}: {
  phase: string;
  title: string;
  body: string;
  status: "shipped" | "next" | "later";
}) {
  const dot =
    status === "shipped"
      ? "bg-emerald-600"
      : status === "next"
        ? "bg-amber-500"
        : "bg-ink-400";
  return (
    <div className="grid grid-cols-[80px_1fr] gap-5 rounded-2xl border border-ink-200 bg-paper p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
          {phase}
        </span>
      </div>
      <div>
        <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-600">{body}</p>
      </div>
    </div>
  );
}
