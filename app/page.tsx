import Link from "next/link";
import { NessCityMap } from "@/components/NessCityMap";
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
            A small city of tools for builders. Click any landmark on the
            map, or browse the full feature index below.
          </p>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-8">
            <NessCityMap />
          </div>
        </FadeIn>
      </section>

      <div className="divider" />

      {/* Every place in Ness — newcomer-friendly directory */}
      <section className="py-14">
        <FadeInOnView>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              For newcomers
            </p>
            <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
              Every place in Ness.
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-[1.6] text-ink-600">
              The full index. Each place is a different tool with its own
              use. Live now means it works today. In design and planned
              are honestly labeled so you know what to expect.
            </p>
          </div>
        </FadeInOnView>

        <div className="mt-8 space-y-10">
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

function PlaceCard({ place }: { place: Place }) {
  const isLive = place.status === "live";
  const statusLabel =
    place.status === "live"
      ? "Live"
      : place.status === "in-design"
        ? "In design"
        : "Planned";
  const statusDot =
    place.status === "live"
      ? "bg-emerald-500"
      : place.status === "in-design"
        ? "bg-amber-500"
        : "bg-ink-400";

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
              : place.status === "in-design"
                ? "bg-amber-50 text-amber-900"
                : "bg-paper-tint text-ink-700"
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
