"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ACTIVE_KINDS,
  contactHref,
  contactLabel,
  daysAgo,
  formatListingPrice,
  kindStyles,
  listingKinds,
  marketPhotoSrc,
  type Listing,
  type ListingKind,
} from "@/lib/market";
import { Avatar } from "@/components/Avatar";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Filter = ListingKind | "all";

const IDENTITY_KEY = "ness:identity:v1";

export default function MarketPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Listing | null>(null);
  const [live, setLive] = useState<Listing[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [myHandle, setMyHandle] = useState<string>("");
  const [marking, setMarking] = useState(false);

  // Restore the cached handle (the seller's identity from /market/new + pagerank).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { handle?: string };
        if (p.handle) setMyHandle(p.handle.toLowerCase());
      }
    } catch {
      /* noop */
    }
  }, []);

  async function markSold(listing: Listing) {
    if (marking) return;
    setMarking(true);
    try {
      const res = await fetch("/api/market/sold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: listing.id,
          sellerHandle: myHandle,
        }),
      });
      if (res.ok) {
        // Drop the listing from local state and close the Dialog.
        setLive((prev) => prev.filter((l) => l.id !== listing.id));
        setActive(null);
      }
    } catch {
      /* offline; user can retry */
    } finally {
      setMarking(false);
    }
  }

  const viewerIsAuthor = active != null && !!myHandle && myHandle === active.authorHandle.toLowerCase();

  // Real listings only. No seed, no fake data. An empty market is honest;
  // the founders post the first real things. (Elon: best seed is no seed.)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/market", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; listings?: Listing[] }) => {
        if (!cancelled && d.ok && Array.isArray(d.listings)) {
          setLive(d.listings);
        }
      })
      .catch(() => {
        /* offline */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allListings = useMemo(
    () => live.filter((l) => ACTIVE_KINDS.includes(l.kind)),
    [live],
  );

  const filtered = useMemo(() => {
    return allListings
      .filter((l) => filter === "all" || l.kind === filter)
      .filter((l) => l.status === "open")
      .sort((a, b) => (b.postedAt > a.postedAt ? 1 : -1));
  }, [filter, allListings]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {
      all: allListings.filter((l) => l.status === "open").length,
    };
    for (const l of allListings) {
      if (l.status !== "open") continue;
      acc[l.kind] = (acc[l.kind] ?? 0) + 1;
    }
    return acc;
  }, [allListings]);


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
            Buy &amp; sell, locally.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.55] text-ink-600 sm:text-[16px]">
            The community marketplace. Things people are selling, giving
            away, or looking for. Reply directly. Every listing is tied to
            a real handle, so you always know who you are dealing with —
            look anyone up on{" "}
            <Link
              href="/pagerank"
              className="text-ink-950 underline-offset-2 hover:underline"
            >
              PageRank
            </Link>{" "}
            before you reply.
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
          {!loaded ? (
            <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-10 text-center">
              <p className="text-[13px] text-ink-400">Loading the market...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-12 text-center">
              <p className="serif text-[26px] leading-tight text-ink-950">
                {filter === "all"
                  ? "Nothing's listed yet."
                  : "Nothing in this category yet."}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-[1.6] text-ink-500">
                {filter === "all"
                  ? "This is a real market with real people. No fake listings. Post the first thing and it shows up here instantly."
                  : "Try another category, or be the first to post here."}
              </p>
              <Link
                href="/market/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Post the first listing
                <span aria-hidden>→</span>
              </Link>
            </div>
          ) : (
            <StaggerList className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
              {filtered.map((l, idx) => (
                <StaggerItem key={l.id}>
                  <ListingRow
                    listing={l}
                    divider={idx > 0}
                    onReply={() => setActive(l)}
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
              Post it in under a minute. Your listing is tied to your
              handle so every reply knows who they are dealing with.
              Listings expire after 30 days.
            </p>
            <Link
              href="/market/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Post a listing
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

      <Dialog
        open={!!active}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
      >
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription>
                  Reach {active.authorName} directly. Deals happen in person.
                  Be a good citizen.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-ink-200 bg-paper-tint p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  {contactLabel(active.contactKind)}
                </p>
                <p className="mt-1 break-all font-mono text-[14px] text-ink-950">
                  {active.contactValue}
                </p>
                <a
                  href={contactHref(active.contactKind, active.contactValue)}
                  target={active.contactKind === "discord" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
                >
                  Open {contactLabel(active.contactKind)}
                  <span aria-hidden>→</span>
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-500">
                <Avatar
                  initials={active.authorName
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                  seed={active.authorHandle}
                  size={20}
                />
                <span className="text-ink-700">{active.authorName}</span>
                <span className="text-ink-300">·</span>
                <span className="font-mono text-[11px]">@{active.authorHandle}</span>
              </div>

              {viewerIsAuthor && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-dashed border-ink-300 bg-paper-tint p-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      This is your listing
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink-700">
                      Mark it sold to drop it from the feed.
                    </p>
                  </div>
                  <button
                    onClick={() => markSold(active)}
                    disabled={marking}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {marking ? "Marking…" : "Mark sold"}
                    {!marking && <span aria-hidden>✓</span>}
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ListingRow({
  listing,
  divider,
  onReply,
}: {
  listing: Listing;
  divider: boolean;
  onReply: () => void;
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
      <div className="col-span-12 flex gap-3 sm:col-span-7">
        {listing.hasPhoto && <ListingThumb id={listing.id} />}
        <div className="min-w-0 flex-1">
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
      </div>

      <div className="col-span-6 flex flex-col items-start gap-1 sm:col-span-2 sm:items-end">
        <span className="font-mono text-[14px] tabular-nums text-ink-950">
          {priceLabel}
        </span>
      </div>

      <div className="col-span-6 flex flex-col items-end gap-2 sm:col-span-3">
        <button
          onClick={onReply}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          Reply
          <span aria-hidden>→</span>
        </button>
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

/**
 * Listing thumbnail. Lazy-loads the one photo from /api/market/photo and
 * hides itself if the listing has none (seed entries, or load failure).
 */
function ListingThumb({ id }: { id: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className="hidden h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-paper-tint sm:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={marketPhotoSrc(id)}
        alt=""
        width={72}
        height={72}
        loading="lazy"
        onError={() => setOk(false)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
