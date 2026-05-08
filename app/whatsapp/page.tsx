"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  groups,
  groupCategories,
  categoryDot,
  type GroupCategory,
} from "@/lib/whatsapp";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

type Filter = GroupCategory | "all";

export default function WhatsAppPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return groups.filter((g) => filter === "all" || g.category === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: groups.length };
    for (const g of groups) acc[g.category] = (acc[g.category] ?? 0) + 1;
    return acc;
  }, []);

  const live = groups.filter((g) => g.invite).length;

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
            The Plaza
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
            Interest groups.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.55] text-ink-600 sm:text-[16px]">
            Curated WhatsApp groups for the city&apos;s recurring interests:
            things to build, things to lift, things to read, things to watch.
            Stewards keep them alive. Anyone can join.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-7 flex flex-wrap gap-3">
          <Stat label="Groups" value={`${groups.length}`} />
          <Stat label="With live invites" value={`${live}`} />
          <Stat label="Categories" value={`${groupCategories.length - 1}`} />
        </div>
      </FadeIn>

      {/* Filter pills */}
      <FadeIn delay={0.14}>
        <div className="mt-8 flex flex-wrap gap-2">
          {groupCategories.map((c) => {
            const active = filter === c.id;
            const count = counts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  active ? "text-paper" : "text-ink-700 hover:text-ink-950"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="whatsapp-tab-pill"
                    className="absolute inset-0 rounded-full bg-ink-950"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {c.label}{" "}
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
      </FadeIn>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <StaggerList className="mt-6 grid gap-3 sm:grid-cols-2">
            {filtered.map((g) => (
              <StaggerItem key={g.id}>
                <div className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-400">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${categoryDot[g.category]}`}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                        {g.category}
                      </span>
                    </div>
                    {g.invite ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-900">
                        <span className="h-1 w-1 rounded-full bg-emerald-600" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-paper-tint px-2 py-0.5 text-[10px] font-medium text-ink-500">
                        Pending steward
                      </span>
                    )}
                  </div>
                  <h3 className="serif mt-2 text-[22px] leading-tight text-ink-950">
                    {g.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13.5px] leading-[1.6] text-ink-600">
                    {g.blurb}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {g.steward && (
                      <span className="font-mono text-[11px] text-ink-500">
                        steward · {g.steward}
                      </span>
                    )}
                    {g.invite ? (
                      <a
                        href={g.invite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-emerald-700"
                      >
                        Join on WhatsApp
                        <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-dashed border-ink-300 px-3.5 py-1.5 text-[12px] text-ink-500">
                        invite coming
                      </span>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </motion.div>
      </AnimatePresence>

      {/* CTAs */}
      <FadeInOnView>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-paper p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Want to steward a group?
            </p>
            <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
              Pick one and run it.
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
              Create the WhatsApp group. Set a friendly admin. Share the
              public invite. Open a Townhall problem with the link and the
              steward will get added here.
            </p>
            <Link
              href="/solve/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface as a Townhall problem
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Sister project
            </p>
            <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
              NS Pulse
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
              Member + event + discussion stats for NS, sourced from public
              calendar and Discord exports. Different surface, complementary
              signal.
            </p>
            <a
              href="https://nspulse.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              Visit nspulse.xyz
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Privacy stance
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            Group invites are opt-in by stewards. Ness doesn&apos;t scrape
            private chats. We list public-by-design groups only. If a group
            steward wants their entry removed, file a Townhall problem and
            it&apos;s gone the same day.
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
            href="/citizens"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            See Citizens Hall
          </Link>
        </div>
      </FadeInOnView>
    </main>
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
