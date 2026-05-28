"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { FadeIn } from "@/components/motion/FadeIn";

const IDENTITY_KEY = "ness:identity:v1";

type Comment = {
  id: string;
  authorHandle: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CommentThread({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached identity + comments
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { name?: string; handle?: string };
        if (p.name) setName(p.name);
        if (p.handle) setHandle(p.handle);
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { ok?: boolean; comments?: Comment[] }) => {
        if (!cancelled && d.ok && Array.isArray(d.comments)) {
          setComments(d.comments);
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
  }, [slug]);

  async function submit() {
    if (!name.trim() || !handle.trim() || !body.trim()) {
      setError("Name, handle, and comment all required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          authorHandle: handle.trim().replace(/^@/, "").toLowerCase(),
          authorDisplayName: name.trim(),
          body: body.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        comment?: Comment;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.comment) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setComments((prev) => [...prev, data.comment!]);
      setBody("");
      try {
        localStorage.setItem(
          IDENTITY_KEY,
          JSON.stringify({
            name: name.trim(),
            handle: handle.trim().replace(/^@/, "").toLowerCase(),
          }),
        );
      } catch {
        /* noop */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FadeIn delay={0.05}>
      <section className="mt-10">
        <div className="flex items-baseline justify-between border-b border-ink-200 pb-2">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Conversation{loaded ? ` · ${comments.length}` : ""}
          </h2>
          <span className="font-mono text-[10px] text-ink-400">oldest first</span>
        </div>

        <ul className="mt-4 space-y-3">
          {!loaded ? (
            <li className="rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[12px] text-ink-500">
              Loading…
            </li>
          ) : comments.length === 0 ? (
            <li className="rounded-xl border border-dashed border-ink-300 bg-paper-tint px-5 py-7 text-center">
              <p className="text-[13.5px] text-ink-700">
                No comments yet. Start the conversation.
              </p>
            </li>
          ) : (
            comments.map((c) => (
              <li
                key={c.id}
                className="overflow-hidden rounded-xl border border-ink-200 bg-paper"
              >
                <header className="flex items-center justify-between gap-3 border-b border-ink-100 bg-paper-tint px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      initials={initialsOf(c.authorDisplayName)}
                      seed={c.authorHandle}
                      size={22}
                    />
                    <span className="text-[13px] font-medium text-ink-950">
                      {c.authorDisplayName}
                    </span>
                    <span className="font-mono text-[11px] text-ink-500">
                      @{c.authorHandle}
                    </span>
                  </div>
                  <span className="font-mono text-[10.5px] text-ink-400">
                    {relativeTime(c.createdAt)}
                  </span>
                </header>
                <div className="whitespace-pre-wrap px-4 py-3 text-[14px] leading-[1.6] text-ink-800">
                  {c.body}
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Compose */}
        <div className="mt-5 rounded-xl border border-ink-200 bg-paper p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Add a comment
          </p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              placeholder="handle"
              className="rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's the take?"
            rows={4}
            maxLength={4000}
            className="mt-3 w-full resize-y rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10.5px] text-ink-400">
              Markdown not rendered (yet). Plain text only.
            </span>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-50"
            >
              {submitting ? "Posting…" : "Comment"}
              {!submitting && <span aria-hidden>→</span>}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-[12px] text-amber-700">{error}</p>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
