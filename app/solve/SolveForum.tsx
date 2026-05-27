"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Problem, ProblemStatus } from "@/lib/types";
import type { ProposalRow } from "@/lib/db/queries";

type ProblemCategory = Problem["category"];

const STATE_OPEN: ProblemStatus[] = ["open", "investigating", "in-progress"];
const STATE_CLOSED: ProblemStatus[] = ["solved"];
const CATEGORIES: ProblemCategory[] = [
  "operations",
  "social",
  "infra",
  "policy",
  "wellbeing",
];
type Sort = "priority" | "newest" | "upvotes";

const SORT_LABEL: Record<Sort, string> = {
  priority: "Priority",
  newest: "Newest",
  upvotes: "Most upvoted",
};

const STATUS_TONE: Record<
  ProblemStatus,
  { dot: string; label: string; variant: "open" | "investigating" | "in-progress" | "solved" }
> = {
  open: { dot: "bg-ink-400", label: "OPEN", variant: "open" },
  investigating: { dot: "bg-amber-500", label: "INVEST", variant: "investigating" },
  "in-progress": { dot: "bg-blue-500", label: "IN PROG", variant: "in-progress" },
  solved: { dot: "bg-emerald-500", label: "SOLVED", variant: "solved" },
};

export function SolveForum({
  problems,
  proposals = [],
}: {
  problems: Problem[];
  proposals?: ProposalRow[];
}) {
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Set<ProblemCategory>>(new Set());
  const [sort, setSort] = useState<Sort>("priority");
  const [tab, setTab] = useState<"open" | "closed" | "proposals">("open");

  // Apply non-state filters first (search + categories) so the Open/Closed
  // counts reflect the current scope, GitHub-style.
  const scoped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return problems.filter((p) => {
      if (cats.size > 0 && !cats.has(p.category)) return false;
      if (needle && !p.title.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [problems, q, cats]);

  const openCount = scoped.filter((p) => STATE_OPEN.includes(p.status)).length;
  const closedCount = scoped.filter((p) => STATE_CLOSED.includes(p.status)).length;

  const visible = useMemo(() => {
    const subset = scoped.filter((p) =>
      (tab === "open" ? STATE_OPEN : STATE_CLOSED).includes(p.status),
    );
    const sorted = [...subset];
    if (sort === "newest") {
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (sort === "upvotes") {
      sorted.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      const order: Record<ProblemStatus, number> = {
        open: 0,
        investigating: 1,
        "in-progress": 2,
        solved: 3,
      };
      sorted.sort((a, b) =>
        order[a.status] !== order[b.status]
          ? order[a.status] - order[b.status]
          : b.upvotes - a.upvotes,
      );
    }
    return sorted;
  }, [scoped, tab, sort]);

  function toggleCat(c: ProblemCategory) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  return (
    <>
      {/* Toolbar box */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-paper p-2 sm:p-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
            ⌕
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search problems..."
            className="w-full rounded-lg border border-transparent bg-paper-tint pl-8 pr-3 py-2 text-[13.5px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:bg-paper focus:outline-none"
          />
        </div>
        <Link
          href="/solve/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          <span aria-hidden>+</span> New problem
        </Link>
      </div>

      {/* Issue list box */}
      <div className="mt-3 overflow-hidden rounded-xl border border-ink-200 bg-paper">
        {/* Header bar */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "open" | "closed" | "proposals")}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-200 bg-paper-tint px-3 sm:px-4">
            <TabsList>
              <TabsTrigger value="open">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-400" aria-hidden />
                Issues
                <span className="font-mono text-[11px] tabular-nums text-ink-500">
                  {openCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="closed">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                Closed
                <span className="font-mono text-[11px] tabular-nums text-ink-500">
                  {closedCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="proposals">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-violet-500"
                  aria-hidden
                />
                Proposals
                <span className="font-mono text-[11px] tabular-nums text-ink-500">
                  {proposals.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {tab !== "proposals" && (
              <div className="flex items-center gap-1 py-1.5">
                <CategoryFilter
                  selected={cats}
                  onToggle={toggleCat}
                  onClear={() => setCats(new Set())}
                />
                <SortFilter sort={sort} onChange={setSort} />
              </div>
            )}
          </div>

          <TabsContent value="open">
            <ProblemList problems={visible} state="open" />
          </TabsContent>
          <TabsContent value="closed">
            <ProblemList problems={visible} state="closed" />
          </TabsContent>
          <TabsContent value="proposals">
            <ProposalList proposals={proposals} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function CategoryFilter({
  selected,
  onToggle,
  onClear,
}: {
  selected: Set<ProblemCategory>;
  onToggle: (c: ProblemCategory) => void;
  onClear: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-ink-600 hover:bg-paper hover:text-ink-950 focus:outline-none">
        Category
        {selected.size > 0 && (
          <span className="rounded-full bg-ink-950 px-1.5 font-mono text-[10px] tabular-nums text-paper">
            {selected.size}
          </span>
        )}
        <span aria-hidden className="text-ink-400">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
        {CATEGORIES.map((c) => (
          <DropdownMenuCheckboxItem
            key={c}
            checked={selected.has(c)}
            onCheckedChange={() => onToggle(c)}
            onSelect={(e) => e.preventDefault()}
          >
            <span className="capitalize">{c}</span>
          </DropdownMenuCheckboxItem>
        ))}
        {selected.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onClear}>Clear selection</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortFilter({ sort, onChange }: { sort: Sort; onChange: (s: Sort) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-ink-600 hover:bg-paper hover:text-ink-950 focus:outline-none">
        Sort: {SORT_LABEL[sort]}
        <span aria-hidden className="text-ink-400">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => onChange(s)}
            className={s === sort ? "font-medium text-ink-950" : ""}
          >
            {s === sort && <span aria-hidden>✓</span>}
            {SORT_LABEL[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProblemList({
  problems,
  state,
}: {
  problems: Problem[];
  state: "open" | "closed";
}) {
  if (problems.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="serif text-[20px] leading-tight text-ink-950">
          {state === "open" ? "No open problems." : "No closed problems."}
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] text-ink-500">
          {state === "open"
            ? "Be the first citizen to file one."
            : "Solved problems will show here."}
        </p>
        {state === "open" && (
          <Link
            href="/solve/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-2 text-[12.5px] font-medium text-paper hover:bg-ink-800"
          >
            <span aria-hidden>+</span> Surface a problem
          </Link>
        )}
      </div>
    );
  }
  return (
    <ul>
      {problems.map((p) => (
        <ProblemRow key={p.id} problem={p} />
      ))}
    </ul>
  );
}

function ProblemRow({ problem }: { problem: Problem }) {
  const tone = STATUS_TONE[problem.status];
  return (
    <li className="border-b border-ink-100 last:border-b-0">
      <Link
        href={`/solve/${problem.slug}`}
        className="grid grid-cols-[10px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-tint sm:grid-cols-[10px_auto_1fr_auto] sm:gap-4 sm:px-5"
      >
        <span className={`h-2 w-2 rounded-full ${tone.dot}`} aria-hidden />
        <Badge variant={tone.variant} className="hidden sm:inline-flex">
          {tone.label}
        </Badge>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium text-ink-950">
            {problem.title}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ink-500">
            <Badge variant="category" className="!tracking-[0.12em]">
              {problem.category}
            </Badge>
            <span>·</span>
            <span>{problem.affected} affected</span>
          </span>
        </span>
        <span className="flex items-center gap-1 font-mono text-[12px] tabular-nums text-ink-700">
          <span aria-hidden>↑</span>
          {problem.upvotes}
        </span>
      </Link>
    </li>
  );
}

function ProposalList({ proposals }: { proposals: ProposalRow[] }) {
  if (proposals.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="serif text-[20px] leading-tight text-ink-950">
          No proposals yet.
        </p>
        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-[1.55] text-ink-500">
          The PR analog: when citizens propose fixes to open problems, the
          proposals show up here. File an open problem first, then propose
          the fix on its detail page.
        </p>
        <Link
          href="/solve/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-2 text-[12.5px] font-medium text-paper hover:bg-ink-800"
        >
          <span aria-hidden>+</span> Surface a problem
        </Link>
      </div>
    );
  }
  return (
    <ul>
      {proposals.map((p) => (
        <li key={p.id} className="border-b border-ink-100 last:border-b-0">
          <Link
            href={`/solve/${p.problemSlug}`}
            className="grid grid-cols-[10px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-tint sm:gap-4 sm:px-5"
          >
            <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium text-ink-950">
                {p.summary}
              </span>
              <span className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ink-500">
                <Badge variant="category" className="!tracking-[0.12em]">
                  PROPOSAL
                </Badge>
                <span>· for</span>
                <span className="truncate text-ink-700">{p.problemTitle}</span>
                <span>·</span>
                <span>@{p.authorDisplayName.toLowerCase().split(/\s+/)[0]}</span>
              </span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[12px] tabular-nums text-ink-700">
              <span aria-hidden>↑</span>
              {p.upvotes}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
