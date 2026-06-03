"use client";

import { useState } from "react";

/**
 * Two-direction vote control for importance and urgency. Optimistic and
 * local: a tap moves the number now so the mechanic is visible. In
 * production this is gated behind sign-in (one weighted vote per member,
 * persisted), which also recomputes the priority sort.
 */
export function VoteCell({ initial }: { initial: number }) {
  const [vote, setVote] = useState<-1 | 0 | 1>(0);

  function cast(dir: -1 | 1) {
    setVote((cur) => (cur === dir ? 0 : dir));
  }

  const value = initial + vote;

  return (
    <div className="flex flex-col items-center leading-none">
      <button
        type="button"
        onClick={() => cast(1)}
        aria-label="More important"
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
        aria-label="Less important"
        className={`text-[11px] leading-none transition-colors ${
          vote === -1 ? "text-rose-500" : "text-ink-300 hover:text-ink-700"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
