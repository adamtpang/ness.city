"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

/**
 * The brand landing. Loch in is the catchphrase. Two image slots —
 * /nessie-loch.jpg and /ness-city-vision.jpg — gracefully fall back to
 * SVG placeholders if the JPGs aren't dropped in public/ yet. Every
 * other surface still has its own URL; this is the front door for
 * brand and orientation. CTAs route into the live product (Market,
 * Forum).
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Hero */}
      <section className="grid items-center gap-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-12">
        <div>
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              ness.city · open-source community OS · MIT
            </p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="serif mt-6 text-[64px] leading-[0.95] text-ink-950 sm:text-[112px] sm:leading-[0.92]">
              Loch in.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.55] text-ink-700 sm:text-[19px]">
              The bottom-up coordination platform for the community.
              Marketplace, problem-solving forum, social graph, all in one
              repo. Free, public, MIT.
            </p>
          </FadeIn>
          <FadeIn delay={0.16}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/market"
                className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Open the market <span aria-hidden>→</span>
              </Link>
              <Link
                href="/solve"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-6 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
              >
                Open the forum
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.22}>
          <MaybeImage
            src="/nessie-loch.jpg"
            alt="Nessie surfacing in Loch Ness — the brand mascot"
            aspect="3/4"
            caption="Loch Ness, 1934 — Nessie"
            fallback={<NessieSilhouette />}
          />
        </FadeIn>
      </section>

      <Divider />

      {/* Vision strip */}
      <section className="grid items-center gap-8 py-16 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <FadeInOnView>
          <MaybeImage
            src="/ness-city-vision.jpg"
            alt="A solarpunk vision of what Forest City could become"
            aspect="3/4"
            caption="Forest City, one possible future"
            fallback={<SolarpunkPlaceholder />}
          />
        </FadeInOnView>
        <FadeInOnView>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Vision
            </p>
            <h2 className="serif mt-3 text-[40px] leading-[1.02] text-ink-950 sm:text-[56px]">
              What Forest City becomes
              <br />
              <span className="italic">if we build it together.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-[1.6] text-ink-700 sm:text-[16px]">
              A solarpunk, optimistic, fun city. Coordinated bottom-up by
              the citizens who live here. The platform is the tool; the
              people are the product.
            </p>
          </div>
        </FadeInOnView>
      </section>

      <Divider />

      {/* Nessie agent teaser */}
      <FadeInOnView>
        <section className="rounded-3xl border border-ink-950 bg-ink-950 px-7 py-10 text-paper sm:px-12 sm:py-14">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-[32px] leading-none" aria-hidden>🦕</span>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
              Coming · Nessie
            </p>
          </div>
          <h2 className="serif mt-4 text-[36px] leading-[1.02] sm:text-[52px]">
            A 24/7 community coordinator.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-ink-200 sm:text-[16px]">
            Nessie is the AI agent that triages problems, surfaces
            patterns, drafts proposals, watches the changelog, and never
            sleeps. Built on the same open-source rails as the rest of
            ness.city, listening to the community 24/7 so the founders
            don&apos;t have to.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://github.com/adamtpang/ness.city"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-opacity hover:opacity-90"
            >
              Read the spec on GitHub
              <span aria-hidden>↗</span>
            </a>
            <a
              href="https://discord.gg/fNmdFWcMU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:border-paper"
            >
              Discuss on Discord
              <span aria-hidden>↗</span>
            </a>
          </div>
        </section>
      </FadeInOnView>

      {/* Rooms grid */}
      <FadeInOnView>
        <section className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Every room in Ness
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Room href="/market" name="The Market" body="Buy, sell, share. Like craigslist, with real handles." status="live" />
            <Room href="/solve" name="The Forum" body="File problems. Propose fixes. Patrons pledge. Ship and get paid." status="live" />
            <Room href="/pagerank" name="PageRank" body="Map your ring. See who the community has named." status="live" />
            <Room href="/guide" name="The Guide" body="An honest, independent guide to Network School. Loch in." status="live" />
            <Room href="/citizens" name="Citizens" body="Solver karma · patron pledged. Two leaderboards." status="live" />
            <Room href="https://discord.gg/fNmdFWcMU" name="Discord" body="Open chat, bug-reports, feature-requests, support." status="external" external />
          </div>
        </section>
      </FadeInOnView>
    </main>
  );
}

/* ----------------------------------------------------------- */
/* Bits                                                        */
/* ----------------------------------------------------------- */

function Divider() {
  return (
    <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
  );
}

function MaybeImage({
  src,
  alt,
  aspect,
  caption,
  fallback,
}: {
  src: string;
  alt: string;
  aspect: string;
  caption: string;
  fallback: React.ReactNode;
}) {
  // Progressive: SVG renders by default (server + first paint). If the
  // JPG actually exists, swap to it once preloaded. No broken-image
  // flash when public/ slots are empty.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = src;
  }, [src]);
  return (
    <figure className="overflow-hidden rounded-2xl border border-ink-200 bg-paper-tint">
      <div className="relative" style={{ aspectRatio: aspect }}>
        <div className="absolute inset-0">{fallback}</div>
        {loaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="border-t border-ink-100 bg-paper px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function NessieSilhouette() {
  return (
    <svg
      viewBox="0 0 200 260"
      className="h-full w-full bg-gradient-to-b from-ink-900 to-ink-700"
      aria-hidden
    >
      {/* abstract Nessie + ripples */}
      <g fill="none" stroke="#0a0a0a" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M30 165 Q40 130 60 165 Q70 145 85 165 Q92 155 95 140 Q100 110 130 100 Q160 95 170 115 Q172 125 165 128 Q155 130 145 128"
          strokeWidth="14"
          opacity="0.92"
        />
        <circle cx="158" cy="113" r="3" fill="#0a0a0a" opacity="0.92" />
        <path
          d="M15 180 Q40 175 65 180 T115 180 T165 180 T195 180"
          strokeWidth="1.5"
          opacity="0.35"
          stroke="#e5e5e5"
        />
        <path
          d="M5 200 Q30 196 55 200 T105 200 T155 200 T195 200"
          strokeWidth="1.5"
          opacity="0.3"
          stroke="#e5e5e5"
        />
        <path
          d="M0 220 Q30 217 60 220 T120 220 T180 220 T200 220"
          strokeWidth="1.5"
          opacity="0.22"
          stroke="#e5e5e5"
        />
      </g>
    </svg>
  );
}

function SolarpunkPlaceholder() {
  return (
    <svg
      viewBox="0 0 200 260"
      className="h-full w-full bg-gradient-to-b from-nessie-200 via-nessie-100 to-garden-100"
      aria-hidden
    >
      {/* abstract solarpunk skyline */}
      <g>
        {/* sun */}
        <circle cx="155" cy="55" r="22" fill="#fef3c7" opacity="0.85" />
        {/* hills */}
        <path d="M0 175 Q40 145 80 170 T160 165 T200 170 L200 260 L0 260 Z" fill="#bbf7d0" opacity="0.6" />
        {/* trees */}
        <g fill="#15803d" opacity="0.85">
          <circle cx="30" cy="170" r="14" />
          <circle cx="50" cy="178" r="10" />
          <circle cx="160" cy="170" r="14" />
          <circle cx="180" cy="178" r="10" />
        </g>
        {/* terraced buildings (white striped) */}
        <g fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" opacity="0.95">
          <rect x="55" y="130" width="32" height="60" rx="6" />
          <rect x="95" y="100" width="28" height="90" rx="6" />
          <rect x="130" y="120" width="26" height="70" rx="6" />
        </g>
        {/* horizontal stripes hinting solarpunk style */}
        <g stroke="#2563eb" strokeWidth="1" opacity="0.55">
          <line x1="55" y1="145" x2="87" y2="145" />
          <line x1="55" y1="158" x2="87" y2="158" />
          <line x1="55" y1="171" x2="87" y2="171" />
          <line x1="95" y1="115" x2="123" y2="115" />
          <line x1="95" y1="130" x2="123" y2="130" />
          <line x1="95" y1="145" x2="123" y2="145" />
          <line x1="95" y1="160" x2="123" y2="160" />
          <line x1="95" y1="175" x2="123" y2="175" />
          <line x1="130" y1="135" x2="156" y2="135" />
          <line x1="130" y1="150" x2="156" y2="150" />
          <line x1="130" y1="165" x2="156" y2="165" />
        </g>
        {/* paths */}
        <path d="M0 245 Q50 235 100 245 T200 245" stroke="#2563eb" strokeWidth="1.5" fill="none" opacity="0.45" />
      </g>
    </svg>
  );
}

function Room({
  href,
  name,
  body,
  status,
  external,
}: {
  href: string;
  name: string;
  body: string;
  status: "live" | "external";
  external?: boolean;
}) {
  const inner = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-950"
    >
      <div className="flex items-center justify-between">
        <h3 className="serif text-[22px] leading-tight text-ink-950">{name}</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-900">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {status === "external" ? "off-site" : "live"}
        </span>
      </div>
      <p className="mt-2 flex-1 text-[13px] leading-[1.55] text-ink-600">{body}</p>
      <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-ink-400 transition-colors group-hover:text-ink-700">
        {href} <span aria-hidden>{external ? "↗" : "→"}</span>
      </span>
    </motion.div>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href}>{inner}</Link>
  );
}
