"use client";

import { useEffect, useState } from "react";

const IDENTITY_KEY = "ness:identity:v1";
const EMOJIS = ["👍", "❤️", "🎯", "🚀"] as const;
type Emoji = (typeof EMOJIS)[number];

type Counts = Record<string, number>;

/**
 * GitHub-Issues-style reaction bar. Toggles a single reaction per
 * emoji per visitor (identity = ness:identity:v1 cached handle from
 * /pagerank or /market/new). Renders the four allowed emojis with
 * live counts; the ones the viewer reacted to highlight.
 */
export function ReactionBar({ slug }: { slug: string }) {
  const [handle, setHandle] = useState<string>("");
  const [counts, setCounts] = useState<Counts>(
    Object.fromEntries(EMOJIS.map((e) => [e, 0])),
  );
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { handle?: string };
        if (p.handle) setHandle(p.handle.toLowerCase());
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const url = new URL("/api/reactions", window.location.origin);
    url.searchParams.set("slug", slug);
    if (handle) url.searchParams.set("handle", handle);
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; counts?: Counts; mine?: string[] }) => {
        if (cancelled || !d.ok) return;
        if (d.counts) setCounts(d.counts);
        if (d.mine) setMine(new Set(d.mine));
      })
      .catch(() => {
        /* offline */
      });
    return () => {
      cancelled = true;
    };
  }, [slug, handle]);

  async function toggle(emoji: Emoji) {
    if (!handle) {
      // Hint the user to set their identity (post a comment or file
      // a problem first so identity gets cached). No popup.
      return;
    }
    if (pending) return;
    setPending(emoji);
    // Optimistic update
    const wasMine = mine.has(emoji);
    setMine((prev) => {
      const next = new Set(prev);
      if (wasMine) next.delete(emoji);
      else next.add(emoji);
      return next;
    });
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + (wasMine ? -1 : 1) }));
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, authorHandle: handle, emoji }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        counts?: Counts;
        mine?: string[];
      };
      if (data.ok) {
        if (data.counts) setCounts(data.counts);
        if (data.mine) setMine(new Set(data.mine));
      } else {
        // Roll back optimistic update
        setMine((prev) => {
          const next = new Set(prev);
          if (wasMine) next.add(emoji);
          else next.delete(emoji);
          return next;
        });
        setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + (wasMine ? 1 : -1) }));
      }
    } catch {
      // Same rollback on network error
      setMine((prev) => {
        const next = new Set(prev);
        if (wasMine) next.add(emoji);
        else next.delete(emoji);
        return next;
      });
      setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + (wasMine ? 1 : -1) }));
    } finally {
      setPending(null);
    }
  }

  const total = EMOJIS.reduce((s, e) => s + (counts[e] ?? 0), 0);
  const hasIdentity = !!handle;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {EMOJIS.map((e) => {
        const c = counts[e] ?? 0;
        const isMine = mine.has(e);
        const isPending = pending === e;
        return (
          <button
            key={e}
            type="button"
            onClick={() => toggle(e)}
            disabled={!hasIdentity || isPending}
            title={
              hasIdentity
                ? isMine
                  ? "Click to remove your reaction"
                  : "React with this emoji"
                : "Post a comment first so we know who you are"
            }
            className={`group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] transition-colors ${
              isMine
                ? "border-ink-950 bg-ink-950 text-paper"
                : "border-ink-200 bg-paper text-ink-700 hover:border-ink-950 hover:text-ink-950"
            } ${!hasIdentity ? "opacity-60" : ""}`}
            aria-pressed={isMine}
          >
            <span className="text-[14px] leading-none">{e}</span>
            <span
              className={`font-mono text-[11.5px] tabular-nums ${
                isMine ? "text-paper" : "text-ink-500 group-hover:text-ink-700"
              }`}
            >
              {c}
            </span>
          </button>
        );
      })}
      {total > 0 && (
        <span className="font-mono text-[10.5px] text-ink-400">
          · {total} {total === 1 ? "reaction" : "reactions"}
        </span>
      )}
      {!hasIdentity && (
        <span className="font-mono text-[10.5px] text-ink-400">
          · sign by commenting first
        </span>
      )}
    </div>
  );
}
