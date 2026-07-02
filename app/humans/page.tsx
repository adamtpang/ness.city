"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { FadeIn } from "@/components/motion/FadeIn";
import { HUMANS, initialsOf, type Human } from "@/lib/humans";

/**
 * /humans, the directory of the city.
 *
 * Design steals one thing from each of the great people-platforms:
 *  - Instagram: a faces-first, scannable grid
 *  - Twitter: the one-line bio as the highest-signal identity
 *  - LinkedIn / Polywork: "what I'm building" + endorsements (vouches)
 *  - Discord / Snap Map: presence (who is on campus now) + role badges (tiers)
 *  - Letterboxd: the profile is a body of work (shipped contributions)
 *  - Are.na / Path: calm, curated, exclusive, not an infinite noisy feed
 *
 * Real profiles are opt-in and claimed by the person. The scraped directory is
 * never published here.
 */

type Filter = "all" | "campus" | "trusted" | "steward";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "campus", label: "On campus now" },
  { key: "trusted", label: "Trusted +" },
  { key: "steward", label: "Stewards" },
];

export default function HumansPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const q = query.trim().toLowerCase();
  const shown = useMemo(() => {
    return HUMANS.filter((h) => {
      const matchesQuery =
        !q ||
        `${h.name} ${h.handle} ${h.building} ${h.role} ${h.location} ${h.tagline}`
          .toLowerCase()
          .includes(q);
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "campus"
            ? h.onCampus
            : filter === "trusted"
              ? h.tier === "trusted" || h.tier === "steward"
              : h.tier === "steward";
      return matchesQuery && matchesFilter;
    });
  }, [q, filter]);

  const onCampusCount = HUMANS.filter((h) => h.onCampus).length;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
          Directory · Humans
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.03] text-ink-950 sm:text-[58px]">
          The humans of the city.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.65] text-ink-700">
          The people you would want to cowork with, curated not crowded. Who is
          here, what they are building, who vouches for them. Quality compounds.
        </p>
        <p className="mt-4 font-mono text-[12px] text-ink-500">
          <span className="text-ink-900">{HUMANS.length}</span> humans ·{" "}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-ink-900">{onCampusCount}</span> on campus now
          </span>
        </p>
      </FadeIn>

      {/* Controls */}
      <FadeIn delay={0.06}>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, what they're building, role..."
            autoComplete="off"
            className="w-full max-w-sm rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  filter === f.key
                    ? "border-ink-950 bg-ink-950 text-paper"
                    : "border-ink-200 bg-paper text-ink-700 hover:border-ink-950"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Grid */}
      <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((h) => (
          <HumanCard key={h.handle} h={h} />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-10 text-center text-[14px] text-ink-500">
          No humans match that. Clear the search or try another filter.
        </p>
      )}

      {/* Claim CTA */}
      <FadeIn delay={0.1}>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-ink-200 bg-paper-tint p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="serif text-[22px] leading-tight text-ink-950">
              This is your city. Claim your place in it.
            </h2>
            <p className="mt-1.5 max-w-lg text-[14px] leading-[1.6] text-ink-600">
              Every profile is opt-in and yours to edit. Add yourself, say what
              you are building, and let the people you trust vouch for you.
            </p>
          </div>
          <Link
            href="/join"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Claim your profile <span aria-hidden>→</span>
          </Link>
        </div>
      </FadeIn>

      <p className="mt-6 text-center font-mono text-[11px] text-ink-400">
        Profiles shown are illustrative seeds. Real profiles are opt-in. Part of
        interneta.world.
      </p>
    </main>
  );
}

const TIER_STYLE: Record<Human["tier"], { label: string; cls: string }> = {
  provisional: { label: "Provisional", cls: "border-ink-200 text-ink-400" },
  member: { label: "Member", cls: "border-ink-300 text-ink-600" },
  trusted: { label: "Trusted", cls: "border-blue-300 text-blue-700" },
  steward: { label: "Steward", cls: "border-amber-300 text-amber-700" },
};

function HumanCard({ h }: { h: Human }) {
  const tier = TIER_STYLE[h.tier];
  return (
    <div className="group flex flex-col rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-950">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar initials={initialsOf(h.name)} seed={h.handle} size={48} />
          {h.onCampus && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-paper"
              title="On campus now"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[15px] font-semibold text-ink-950">
              {h.name}
            </div>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${tier.cls}`}
            >
              {tier.label}
            </span>
          </div>
          <div className="truncate font-mono text-[11.5px] text-ink-500">
            @{h.handle} · {h.role}
          </div>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-[1.5] text-ink-800">{h.tagline}</p>

      <div className="mt-3 border-t border-ink-100 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-400">
          Building
        </p>
        <p className="mt-1 text-[13.5px] leading-[1.45] text-ink-700">
          {h.building}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[11.5px] text-ink-500">
          <span title="Vouches" className="inline-flex items-center gap-1">
            <span className="text-ink-400">◇</span>
            {h.vouches}
          </span>
          <span title="Shipped contributions" className="inline-flex items-center gap-1">
            <span className="text-ink-400">⚡</span>
            {h.shipped}
          </span>
          <span className="text-ink-400">·</span>
          <span className="truncate text-ink-400">{h.location}</span>
        </div>
        {h.x && (
          <a
            href={`https://x.com/${h.x}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-ink-400 transition-colors hover:text-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            x ↗
          </a>
        )}
      </div>
    </div>
  );
}
