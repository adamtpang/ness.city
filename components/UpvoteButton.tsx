"use client";

import { useEffect, useState } from "react";

const VOTED_KEY = "ness:voted:v1";

function readVoted(): Set<string> {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function writeVoted(set: Set<string>) {
  try {
    localStorage.setItem(VOTED_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

/**
 * Canny-style upvote pill. Toggles a +1/-1 against problems.upvotes,
 * remembering your vote in localStorage so a refresh doesn't double-count.
 * Optimistic; rolls back on failure. Stops propagation so it works
 * inside a clickable issue row without triggering navigation.
 *
 * variant "pill" — big vertical pill for the detail page.
 * variant "inline" — compact for list rows.
 */
export function UpvoteButton({
  slug,
  initial,
  variant = "inline",
}: {
  slug: string;
  initial: number;
  variant?: "pill" | "inline";
}) {
  const [count, setCount] = useState(initial);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVoted(readVoted().has(slug));
  }, [slug]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !voted;
    const delta = next ? 1 : -1;
    // optimistic
    setVoted(next);
    setCount((c) => Math.max(0, c + delta));
    try {
      const res = await fetch("/api/problems/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, delta }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        upvotes?: number;
      };
      if (!res.ok || !data.ok) throw new Error("vote failed");
      if (typeof data.upvotes === "number") setCount(data.upvotes);
      const set = readVoted();
      if (next) set.add(slug);
      else set.delete(slug);
      writeVoted(set);
    } catch {
      // rollback
      setVoted(!next);
      setCount((c) => Math.max(0, c - delta));
    } finally {
      setBusy(false);
    }
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggle}
        aria-pressed={voted}
        aria-label={voted ? "Remove upvote" : "Upvote this problem"}
        className={`flex w-14 flex-col items-center justify-center rounded-xl border px-2 py-2 transition-colors ${
          voted
            ? "border-nessie-600 bg-nessie-50 text-nessie-700"
            : "border-ink-200 bg-paper text-ink-700 hover:border-ink-950"
        }`}
      >
        <span aria-hidden className="text-[15px] leading-none">▲</span>
        <span className="mt-0.5 font-mono text-[15px] font-medium tabular-nums leading-none">
          {count}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={voted}
      aria-label={voted ? "Remove upvote" : "Upvote this problem"}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[12px] tabular-nums transition-colors ${
        voted
          ? "border-nessie-600 bg-nessie-50 text-nessie-700"
          : "border-ink-200 bg-paper text-ink-600 hover:border-ink-950 hover:text-ink-950"
      }`}
    >
      <span aria-hidden>▲</span>
      {count}
    </button>
  );
}
