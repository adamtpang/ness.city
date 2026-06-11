"use client";

import { useEffect, useState } from "react";

/**
 * Two-direction vote control for the board's Priority column.
 *
 * Importance persists for real: each tap POSTs ±1 to /api/problems/vote and
 * remembers your stance per problem in localStorage (so a refresh neither
 * loses nor double-counts your vote). One up or one down per member per
 * problem; proper one-member-one-vote lands with sign-in.
 *
 * Urgency has no column in the DB yet (it ships with profiles), so that axis
 * is optimistic-local only and resets on refresh.
 */
export function VoteCell({
  slug,
  initial,
  axis = "importance",
}: {
  slug?: string;
  initial: number;
  axis?: "importance" | "urgency";
}) {
  const persisted = axis === "importance" && Boolean(slug);
  const storageKey = `ness:vote:imp:${slug}`;

  // My stance: -1, 0, or +1. For persisted cells, `initial` from the server
  // already includes my past vote, so display = initial + (vote - voteAtLoad).
  const [vote, setVote] = useState<-1 | 0 | 1>(0);
  const [voteAtLoad, setVoteAtLoad] = useState<-1 | 0 | 1>(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!persisted) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const v = raw === "1" ? 1 : raw === "-1" ? -1 : 0;
      setVote(v);
      setVoteAtLoad(v);
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persisted, storageKey]);

  async function cast(dir: -1 | 1) {
    // One step per tap, clamped to [-1, 1].
    const next = Math.max(-1, Math.min(1, vote + dir)) as -1 | 0 | 1;
    if (next === vote || busy) return;

    setVote(next);
    if (!persisted) return;

    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      /* noop */
    }
    setBusy(true);
    try {
      const res = await fetch("/api/problems/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, delta: dir }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Roll back the step on failure.
      setVote(vote);
      try {
        localStorage.setItem(storageKey, String(vote));
      } catch {
        /* noop */
      }
    } finally {
      setBusy(false);
    }
  }

  const value = initial + (vote - voteAtLoad);

  return (
    <div
      className="flex flex-col items-center leading-none"
      title={
        persisted
          ? "Vote on importance"
          : "Urgency voting ships with member profiles"
      }
    >
      <button
        type="button"
        onClick={() => cast(1)}
        aria-label="Vote up"
        className={`text-[11px] leading-none transition-colors ${
          vote === 1 ? "text-blue-600" : "text-ink-300 hover:text-ink-700"
        }`}
      >
        ▲
      </button>
      <span className="my-0.5 font-mono text-[13px] font-semibold tabular-nums text-ink-950">
        {value}
      </span>
      <button
        type="button"
        onClick={() => cast(-1)}
        aria-label="Vote down"
        className={`text-[11px] leading-none transition-colors ${
          vote === -1 ? "text-rose-500" : "text-ink-300 hover:text-ink-700"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
