import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function MatchPage() {
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
          Match.
          <br />
          <span className="italic">Resume to opportunities.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-5 text-[17px] leading-[1.7] text-ink-700">
          Drop a resume. We score it against every open job, every active
          bounty, and every founder posting a co-builder hunt. The top 5
          matches above 80% land in your inbox with concrete next steps:
          who to reach out to, what to say, what to ship.
        </p>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-12 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How it works
          </p>
          <ol className="mt-4 space-y-4 text-[15.5px] leading-[1.7] text-ink-800">
            <li>
              <span className="serif text-ink-400">01.</span> Upload a PDF or
              paste a LinkedIn URL. Stays on your device until you opt in.
            </li>
            <li>
              <span className="serif text-ink-400">02.</span> An LLM extracts
              your stack, comp expectations, location preferences, work
              constraints. You confirm the read.
            </li>
            <li>
              <span className="serif text-ink-400">03.</span> We score every
              live opportunity against the profile. Compatibility, comp fit,
              location, stack. Below 80% gets hidden by default.
            </li>
            <li>
              <span className="serif text-ink-400">04.</span> Each match comes
              with three concrete next steps: a tailored intro, a portfolio
              project to ship, a person to message.
            </li>
            <li>
              <span className="serif text-ink-400">05.</span> Optional weekly
              digest. New matches only. No spam, no recruiter blasts.
            </li>
          </ol>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Card
            title="What we score against"
            items={[
              "Curated public job listings (Jobs tab)",
              "Active bounties (Townhall, paid solvers)",
              "Co-founder posts (when surfaced)",
              "Fellowships and accelerators",
            ]}
          />
          <Card
            title="What we don't do"
            items={[
              "Auto-apply or auto-spam recruiters",
              "Sell your data, ever",
              "Show low-quality matches",
              "Hide comp ranges",
            ]}
          />
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Privacy stance
          </p>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Resume parsing happens in-browser by default. The structured
            profile only leaves your machine when you explicitly opt in to
            scoring. We don&apos;t store the original document. We never share
            with third parties. If you delete your profile, the underlying
            scores delete with it.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Status
          </p>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Skeleton, no upload yet. Building this on top of the Postgres
            backend that ships next. The first version will support PDF
            upload + the curated jobs board. Bounty matching follows once
            real bounties exist on the platform.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Browse the Jobs board now
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Back to Ness
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
      <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.6] text-ink-700">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="text-ink-400">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
