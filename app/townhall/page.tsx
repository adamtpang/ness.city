import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

/**
 * /townhall — the town square.
 *
 * Absorbs the former standalone townhall.town project. townhall's whole loop
 * (surface a problem, propose a fix, anchor a bounty, pledge, ship, earn
 * karma) already lives inside ness.city as the components in
 * TownhallActions.tsx wired through /solve, /bounties, /points. This page is
 * the named front door that ties those surfaces into one civic narrative, so
 * "townhall" is a destination, not just scattered actions.
 *
 * townhall.town the standalone repo is archived (was empty on GitHub; only
 * ever deployed to Vercel). This route is its real home.
 */

const TOWNHALL_DESCRIPTION =
  "The town square for builders. Surface a problem, propose a fix, anchor a bounty, ship it, earn karma. Public by default.";

export const metadata: Metadata = {
  title: "Townhall · Ness",
  description: TOWNHALL_DESCRIPTION,
  alternates: { canonical: "/townhall" },
  openGraph: {
    title: "Townhall · Ness",
    description: TOWNHALL_DESCRIPTION,
    url: "https://ness.city/townhall",
    siteName: "Ness",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Townhall · Ness",
    description: TOWNHALL_DESCRIPTION,
  },
};

type Step = {
  n: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

const loop: Step[] = [
  {
    n: "01",
    title: "Surface a problem",
    body: "Name something broken in the community. Concrete beats abstract. A problem with a clear edge gets solved.",
    href: "/solve",
    cta: "See open problems",
  },
  {
    n: "02",
    title: "Propose a fix",
    body: "Concrete fix, parts list, hours. Proposals are public so the best one wins on merit, not volume.",
    href: "/solve",
    cta: "Propose a solution",
  },
  {
    n: "03",
    title: "Anchor a bounty",
    body: "Pin a USD bounty to a proposal. Patrons pledge toward the goal. When it funds, the work is worth doing.",
    href: "/bounties",
    cta: "Open bounties",
  },
  {
    n: "04",
    title: "Ship and document",
    body: "Do the work, document what you did, mark it shipped. The bounty pays out and you earn karma.",
    href: "/points",
    cta: "See the leaderboard",
  },
];

export default function TownhallPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Townhall
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[52px]">
          The town square for builders.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          {TOWNHALL_DESCRIPTION} A problem becomes a proposal becomes a bounty
          becomes a shipped fix. Every step is public. Karma accrues to the
          people who actually do the work.
        </p>
      </FadeIn>

      <FadeInOnView>
        <section className="mt-10 space-y-3">
          {loop.map((step) => (
            <Link
              key={step.n}
              href={step.href}
              className="group block rounded-2xl border border-ink-200 bg-paper p-5 no-underline transition-colors hover:border-ink-300"
            >
              <div className="flex items-start gap-4">
                <span className="serif text-[28px] leading-none text-land">
                  {step.n}
                </span>
                <div className="flex-1">
                  <h2 className="serif text-[20px] leading-tight text-ink-950">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-600">
                    {step.body}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-accent">
                    {step.cta} <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Where the conversation lives
          </p>
          <h2 className="serif mt-2 text-[20px] leading-tight text-ink-950">
            Public by default.
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
            No private inbox, no triage shadow queue. Feedback lives on{" "}
            <Link href="/feedback" className="underline">
              GitHub Issues
            </Link>
            , chat lives on Discord. If it is worth saying, it is worth saying
            where everyone can see it.
          </p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Provenance
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
            This absorbs the former townhall.town. The feedback-iteration
            engine, the propose-and-fund loop, the karma system all live here
            now as one civic layer. One place, one source of truth.
          </p>
        </div>
      </FadeInOnView>
    </main>
  );
}
