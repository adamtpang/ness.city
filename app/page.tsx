import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import {
  placesBySection,
  sectionLabels,
  sectionOrder,
  type Place,
} from "@/lib/places";

export default function Home() {
  const grouped = placesBySection();

  return (
    <main className="mx-auto max-w-5xl px-5">
      {/* Hero. Pure typography. No illustration. */}
      <section className="pt-20 pb-20 sm:pt-32 sm:pb-28">
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
          <h1 className="serif mt-8 max-w-4xl text-[44px] leading-[1.01] text-ink-950 sm:text-[80px] sm:leading-[0.98]">
            Bottom-up
            <br />
            <span className="italic">community coordination.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-8 max-w-2xl text-[16px] leading-[1.55] text-ink-700 sm:text-[19px] sm:leading-[1.5]">
            If the core team is the government, the community is the
            populace. Ness is how the populace coordinates with itself.
            Surface problems. Fund the fixes. Ship them. Free for anyone to
            use, open-source, public on day one.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
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
              How it works
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.26}>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-500">
            <a
              href="https://github.com/adamtpang/ness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink-950"
            >
              <span className="font-mono">→</span> Read the code on GitHub
            </a>
            <a
              href="https://discord.gg/fNmdFWcMU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink-950"
            >
              <span className="font-mono">→</span> Join the Discord
            </a>
            <a
              href="https://interneta.world"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink-950"
            >
              <span className="font-mono">→</span> Part of interneta.world
            </a>
          </div>
        </FadeIn>
      </section>

      <div className="divider" />

      {/* The loop */}
      <section className="py-16">
        <FadeInOnView>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            The loop
          </p>
          <h2 className="serif mt-2 text-[36px] leading-tight text-ink-950 sm:text-[44px]">
            Post a problem. Fund the fix. Ship it. Repeat.
          </h2>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.65] text-ink-700 sm:text-[17px]">
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

      {/* Every place in Ness directory */}
      <section className="py-16">
        <FadeInOnView>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              For newcomers
            </p>
            <h2 className="serif mt-2 text-[36px] leading-tight text-ink-950 sm:text-[44px]">
              Every place in Ness.
            </h2>
            <p className="mt-3 max-w-xl text-[14.5px] leading-[1.6] text-ink-600">
              Free to use, no login. Live means it works today. Coming soon
              is honestly labeled so you know what to expect.
            </p>
          </div>
        </FadeInOnView>

        <div className="mt-10 space-y-10">
          {sectionOrder.map((s) => {
            const items = grouped[s].filter((p) => p.inHeader !== false);
            if (items.length === 0) return null;
            return (
              <FadeInOnView key={s}>
                <div>
                  <div className="mb-4 flex items-baseline gap-3 border-b border-ink-100 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {sectionLabels[s].eyebrow}
                    </span>
                    <span className="text-ink-300">·</span>
                    <h3 className="serif text-[22px] leading-tight text-ink-950">
                      {sectionLabels[s].label}
                    </h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p) => (
                      <PlaceCard key={p.id} place={p} />
                    ))}
                  </div>
                </div>
              </FadeInOnView>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* Open source + community */}
      <section className="py-16">
        <FadeInOnView>
          <div className="rounded-2xl border border-ink-950 bg-ink-950 p-7 text-paper sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
              Open source · MIT licensed
            </p>
            <h2 className="serif mt-2 text-[32px] leading-tight sm:text-[40px]">
              Read the code. Fork the city.
              <br />
              Join the conversation.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-ink-200">
              The repo is public on GitHub under MIT. Anyone can read, fork,
              suggest, and learn. PRs reviewed weekly by the maintainer.
              Conversations happen on Discord.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/adamtpang/ness"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-opacity hover:opacity-90"
              >
                Open the GitHub repo
                <span aria-hidden>↗</span>
              </a>
              <a
                href="https://discord.gg/fNmdFWcMU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-5 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
              >
                Join the Discord
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

function PlaceCard({ place }: { place: Place }) {
  const isLive = place.status === "live";
  const statusLabel =
    place.status === "live"
      ? "Live"
      : place.status === "in-design"
        ? "Coming soon"
        : "Coming soon";
  const statusDot =
    place.status === "live"
      ? "bg-emerald-500"
      : "bg-amber-500";

  return (
    <Link
      href={place.href}
      className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-950"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="serif text-[20px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
            {place.name}
          </h3>
          {place.building && place.building !== place.name && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
              {place.building}
            </p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isLive
              ? "bg-emerald-50 text-emerald-900"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 flex-1 text-[13px] leading-[1.55] text-ink-600">
        {place.desc}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-ink-400 transition-colors group-hover:text-ink-700">
        {place.href}
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
