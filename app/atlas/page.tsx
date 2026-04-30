import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function AtlasPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/60 px-3 py-1 font-mono text-[11px] text-amber-900">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          In design
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <h1 className="serif mt-4 text-[52px] leading-[1.02] text-ink-950 sm:text-[64px]">
          Atlas.
          <br />
          <span className="italic">A map of the city.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-5 text-[17px] leading-[1.7] text-ink-700">
          The second tool in the Ness platform. A social PageRank experiment.
          Citizens list their closest five relationships. We crawl, render,
          and rank. The way Zuck did it at Harvard, but for a community of
          network founders.
        </p>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-12 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            What it answers
          </p>
          <ul className="mt-4 space-y-3 text-[15.5px] leading-[1.7] text-ink-800">
            <li className="flex gap-3">
              <span className="serif w-6 text-ink-400">·</span>
              Who are the connectors? The people whose presence raises everyone&apos;s rank.
            </li>
            <li className="flex gap-3">
              <span className="serif w-6 text-ink-400">·</span>
              Who are the quiet ones? The people no-one named but who showed up every day.
            </li>
            <li className="flex gap-3">
              <span className="serif w-6 text-ink-400">·</span>
              Where does information actually flow? Whose conversations seed the most fixes on Townhall?
            </li>
            <li className="flex gap-3">
              <span className="serif w-6 text-ink-400">·</span>
              How does the graph evolve cohort to cohort? Are we building a city or a tourist stop?
            </li>
          </ul>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            How it works
          </p>
          <ol className="mt-4 space-y-4 text-[15.5px] leading-[1.7] text-ink-700">
            <li>
              <span className="serif text-ink-400">01.</span> Each citizen
              names their five closest people in the city. Private to them,
              public in aggregate.
            </li>
            <li>
              <span className="serif text-ink-400">02.</span> The graph runs a
              PageRank iteration nightly.
            </li>
            <li>
              <span className="serif text-ink-400">03.</span> Each citizen sees
              their score, their rank, and the cohort heatmap. Nothing about
              other people&apos;s individual scores.
            </li>
            <li>
              <span className="serif text-ink-400">04.</span> Connectors are
              celebrated (with consent) so the people supporting everyone else
              get supported back.
            </li>
          </ol>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Privacy stance
          </p>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Atlas is meant to surface who&apos;s been supporting the
            community, not to gamify popularity. Individual rankings stay
            private. Aggregate connector data needs explicit opt-in. If the
            city decides Atlas isn&apos;t a city it wants, Atlas dies.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to Ness
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            See the platform plan
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}
