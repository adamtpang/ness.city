"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  contactHref,
  contactLabel,
  daysAgo,
  formatListingPrice,
  kindStyles,
  listingKinds,
  listings,
  type Listing,
  type ListingKind,
} from "@/lib/market";
import { Avatar } from "@/components/Avatar";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

type Filter = ListingKind | "all";

export default function MarketPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return listings
      .filter((l) => filter === "all" || l.kind === filter)
      .filter((l) => l.status === "open")
      .sort((a, b) => (b.postedAt > a.postedAt ? 1 : -1));
  }, [filter]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: listings.filter((l) => l.status === "open").length };
    for (const l of listings) {
      if (l.status !== "open") continue;
      acc[l.kind] = (acc[l.kind] ?? 0) + 1;
    }
    return acc;
  }, []);

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            The Market
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
            Buy, sell, swap, share.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.55] text-ink-600 sm:text-[16px]">
            Local craigslist for the city. Things people are selling, giving
            away, looking for, or driving to. Reply directly. Every author
            here is a citizen you can find on the map.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-7 flex flex-wrap gap-3">
          <Stat label="Open listings" value={`${counts.all}`} />
          <Stat label="For sale" value={`${counts.forsale ?? 0}`} />
          <Stat label="Free" value={`${counts.free ?? 0}`} />
          <Stat label="Housing" value={`${counts.housing ?? 0}`} />
          <Stat label="Rides" value={`${counts.ride ?? 0}`} />
        </div>
      </FadeIn>

      {/* Filter pills */}
      <FadeIn delay={0.14}>
        <div className="sticky top-16 z-20 mt-8 -mx-5 border-b border-ink-200 bg-paper/85 px-5 py-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            {listingKinds.map((k) => {
              const active = filter === k.id;
              const count = counts[k.id] ?? 0;
              return (
                <button
                  key={k.id}
                  onClick={() => setFilter(k.id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    active ? "text-paper" : "text-ink-700 hover:text-ink-950"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="market-tab-pill"
                      className="absolute inset-0 rounded-full bg-ink-950"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {k.label}{" "}
                    <span
                      className={`ml-0.5 font-mono text-[10px] tabular-nums ${
                        active ? "text-paper/70" : "text-ink-400"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Listings */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-10 text-center">
              <p className="serif text-[22px] text-ink-950">
                Nothing in this filter.
              </p>
              <p className="mt-2 text-[13px] text-ink-500">
                Try a different category, or post the first one.
              </p>
            </div>
          ) : (
            <StaggerList className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
              {filtered.map((l, idx) => (
                <StaggerItem key={l.id}>
                  <ListingRow
                    listing={l}
                    divider={idx > 0}
                    revealed={revealed.has(l.id)}
                    onToggle={() => toggleReveal(l.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <FadeInOnView>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-paper p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Post a listing
            </p>
            <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
              Got something to sell, give, or find?
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-600">
              Until the dedicated form lands, file your listing as a Townhall
              problem with the title prefixed{" "}
              <span className="font-mono text-ink-950">[market]</span>. We
              triage daily.
            </p>
            <Link
              href="/solve/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface a listing
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Etiquette
            </p>
            <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.65] text-ink-700">
              <li>· Real names. Real prices. Real photos when you can.</li>
              <li>· Mark sold or claimed quickly. Keeps the feed fresh.</li>
              <li>· Pay each other in USDC, cash, or the Costco order.</li>
              <li>· Don&apos;t list anything sketchy. Citizens see each other.</li>
            </ul>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            About this board
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            Ness Market is the local craigslist for an NS-shaped city. Built
            tight on purpose: dense rows, no images bloat, real names,
            instant reply via WhatsApp / Telegram / Discord. Listings expire
            after 30 days. Consolidates the spirit of nsmarket.app and
            redmart.xyz; previously two separate prototypes, now one.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to the city
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/whatsapp"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Browse interest groups
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function ListingRow({
  listing,
  divider,
  revealed,
  onToggle,
}: {
  listing: Listing;
  divider: boolean;
  revealed: boolean;
  onToggle: () => void;
}) {
  const k = kindStyles[listing.kind];
  const initials = listing.authorName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const priceLabel = formatListingPrice(listing);

  return (
    <div
      className={`grid grid-cols-12 items-start gap-3 px-4 py-4 transition-colors hover:bg-paper-tint sm:gap-4 sm:px-5 ${
        divider ? "border-t border-ink-100" : ""
      }`}
    >
      <div className="col-span-12 sm:col-span-7">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${k.dot}`} aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
            {k.label}
          </span>
          <span className="text-ink-300">·</span>
          <span className="text-[10.5px] text-ink-400">
            {daysAgo(listing.postedAt)}
          </span>
        </div>
        <h3 className="mt-1 text-[15px] font-medium leading-tight text-ink-950">
          {listing.title}
        </h3>
        <p className="mt-1 text-[12.5px] leading-[1.55] text-ink-600">
          {listing.body}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-500">
          <Avatar initials={initials} seed={listing.authorHandle} size={18} />
          <span className="text-ink-700">{listing.authorName}</span>
          <span className="text-ink-300">·</span>
          <span className="font-mono text-[11px]">@{listing.authorHandle}</span>
        </div>
      </div>

      <div className="col-span-6 flex flex-col items-start gap-1 sm:col-span-2 sm:items-end">
        <span className="font-mono text-[14px] tabular-nums text-ink-950">
          {priceLabel}
        </span>
      </div>

      <div className="col-span-6 flex flex-col items-end gap-2 sm:col-span-3">
        {!revealed ? (
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Reply
            <span aria-hidden>↓</span>
          </button>
        ) : (
          <div className="flex flex-col items-end gap-1.5">
            <a
              href={contactHref(listing.contactKind, listing.contactValue)}
              target={listing.contactKind === "discord" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-950 bg-paper px-3 py-1 font-mono text-[11px] text-ink-950 transition-colors hover:bg-ink-950 hover:text-paper"
            >
              {contactLabel(listing.contactKind)} →
            </a>
            <span className="font-mono text-[10.5px] text-ink-500">
              {listing.contactValue}
            </span>
            <button
              onClick={onToggle}
              className="text-[10px] text-ink-400 transition-colors hover:text-ink-950"
            >
              hide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1 text-[12px]">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-950">{value}</span>
    </span>
  );
}
