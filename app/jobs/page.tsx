"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  jobs,
  jobCategories,
  jobStats,
  type JobCategory,
  type Job,
} from "@/lib/jobs";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

type CategoryFilter = JobCategory | "all";

const categoryDot: Record<JobCategory, string> = {
  engineering: "bg-blue-500",
  ai: "bg-violet-500",
  design: "bg-pink-500",
  product: "bg-emerald-500",
  marketing: "bg-amber-500",
  operations: "bg-cyan-500",
  leadership: "bg-rose-500",
  fellowship: "bg-ink-700",
};

export default function JobsPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => filter === "all" || j.category === filter)
      .filter((j) => !remoteOnly || j.remote)
      .sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
  }, [filter, remoteOnly]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: jobs.length };
    for (const j of jobs) acc[j.category] = (acc[j.category] ?? 0) + 1;
    return acc;
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Jobs
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
          Curated openings.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          Public job listings spotted in the wild and curated each week.
          Compensation transparent where it&apos;s known. Direct apply links,
          no aggregator middlemen, no logins required.
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-4">
          <Stat label="Open roles" value={`${jobStats.total}`} />
          <Stat label="Companies" value={`${jobStats.companies}`} />
          <Stat label="Remote" value={`${jobStats.remote}`} />
          <Stat label="With comp" value={`${jobStats.withComp}`} />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="sticky top-16 z-20 mt-10 -mx-5 border-b border-ink-200 bg-paper/85 px-5 py-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            {jobCategories.map((c) => {
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
                      layoutId="jobs-tab-pill"
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
            <span className="mx-1 hidden h-4 w-px bg-ink-200 sm:block" />
            <button
              onClick={() => setRemoteOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                remoteOnly
                  ? "border-ink-950 bg-ink-950 text-paper"
                  : "border-ink-200 bg-paper text-ink-700 hover:border-ink-950 hover:text-ink-950"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  remoteOnly ? "bg-emerald-400" : "bg-ink-300"
                }`}
              />
              Remote only
            </button>
          </div>
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${remoteOnly}`}
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
                Try a different category or turn off remote-only.
              </p>
            </div>
          ) : (
            <StaggerList className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
              {filtered.map((j, idx) => (
                <StaggerItem key={j.id}>
                  <JobRow job={j} divider={idx > 0} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 rounded-2xl border border-ink-200 bg-paper-tint p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          About this board
        </p>
        <h2 className="serif mt-2 text-[24px] leading-tight text-ink-950">
          Hand-curated. Refreshed weekly.
        </h2>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink-700">
          Every listing here points at a public job page on the hiring
          company&apos;s own site. We don&apos;t republish private posts, we
          don&apos;t scrape Discord, we don&apos;t intermediate the
          application. The board is just a clean reading layer over openings
          worth applying to. Have one to add? File it on Townhall.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Surface a job
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            How Ness works
          </Link>
        </div>
      </div>
    </main>
  );
}

function JobRow({ job, divider }: { job: Job; divider: boolean }) {
  return (
    <a
      href={job.link}
      target={job.link.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`group grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-paper-tint sm:gap-4 ${
        divider ? "border-t border-ink-100" : ""
      }`}
    >
      <div className="col-span-12 sm:col-span-6">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${categoryDot[job.category]}`}
            aria-hidden
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            {job.category}
          </span>
          {job.type !== "fulltime" && (
            <>
              <span className="text-ink-300">·</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                {job.type}
              </span>
            </>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <h3 className="serif text-[18px] leading-tight text-ink-950 transition-opacity group-hover:opacity-70">
            {job.title}
          </h3>
          <span className="text-[13px] text-ink-500">{job.company}</span>
        </div>
        {job.blurb && (
          <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-600">
            {job.blurb}
          </p>
        )}
      </div>

      <div className="col-span-6 flex items-center gap-2 text-[12px] text-ink-700 sm:col-span-3">
        <span>{job.location}</span>
        {job.remote && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-900">
            Remote
          </span>
        )}
      </div>

      <div className="col-span-3 flex items-center justify-end gap-3 sm:col-span-2">
        {job.comp ? (
          <span className="font-mono text-[12px] tabular-nums text-ink-900">
            {job.comp}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-ink-400">—</span>
        )}
      </div>

      <div className="col-span-3 flex items-center justify-end sm:col-span-1">
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-950">
          Apply
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </span>
      </div>
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-5 py-5">
      <div className="serif text-[26px] leading-none tabular-nums text-ink-950">
        {value}
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  );
}
