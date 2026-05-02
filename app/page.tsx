import Link from "next/link";
import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { SolarpunkSkyline } from "@/components/SolarpunkSkyline";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5">
      {/* Hero with solarpunk skyline */}
      <section className="relative pt-16 pb-14 sm:pt-24 sm:pb-20">
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
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.6] text-ink-600 sm:text-[17px]">
            Surface a problem. Pledge to fix it. Solver ships, gets paid.
            That&apos;s Ness.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/solve"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Open Townhall
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              How it works →
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <SolarpunkSkyline className="mt-14" />
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
              Public on GitHub under MIT. The merge button is Adam&apos;s.
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
