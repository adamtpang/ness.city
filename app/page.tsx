import Link from "next/link";
import { NessCityMap } from "@/components/NessCityMap";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

const QUICK_LINKS = [
  { href: "/about", label: "Welcome Center", note: "How Ness works" },
  { href: "/solve", label: "Townhall", note: "Surface, fund, ship" },
  { href: "/citizens", label: "Citizens Hall", note: "Leaderboards" },
  { href: "/pagerank", label: "Observatory", note: "Map who knows whom" },
  { href: "/bounties", label: "Bounty Bureau", note: "Open bounties" },
  { href: "/solve/new", label: "The Loch", note: "Surface a problem" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5">
      {/* Hero with city map */}
      <section className="pt-12 pb-12 sm:pt-16">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3 py-1 font-mono text-[11px] text-ink-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-950 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-950" />
            </span>
            in beta · open-source · MIT
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1 className="serif mt-6 max-w-3xl text-[44px] leading-[1.02] text-ink-950 sm:text-[64px] sm:leading-[1.0]">
            Welcome to Ness.
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-4 max-w-xl text-[15.5px] leading-[1.55] text-ink-600 sm:text-[17px]">
            A small city of tools for builders. Click any landmark to enter.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-8">
            <NessCityMap />
          </div>
        </FadeIn>

        {/* Text fallback / accessibility */}
        <FadeIn delay={0.24}>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-[13px] sm:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="group flex items-baseline gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-paper-tint"
                >
                  <span className="font-medium text-ink-950 group-hover:text-nessie-700">
                    {q.label}
                  </span>
                  <span className="text-ink-500">·</span>
                  <span className="text-ink-500">{q.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      <div className="divider" />

      {/* The loop, in one paragraph */}
      <section className="py-14">
        <FadeInOnView>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            The loop
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            Post a problem. Fund the fix. Ship it. Repeat.
          </h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.65] text-ink-700">
            Citizens surface real problems with real diagnoses. Anyone can
            propose a fix. Patrons crowdfund the proposal in USDC. The first
            citizen to claim and ship the fix gets the bounty and the karma.
            The whole loop is public, attributed, and permanent.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/solve"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Open Townhall
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              Read the walkthrough
            </Link>
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
              Read the code. Fork the city.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-ink-200">
              Public on GitHub under MIT. PRs reviewed weekly by the maintainer.
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
            </div>
          </div>
        </FadeInOnView>
      </section>
    </main>
  );
}
