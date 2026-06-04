"use client";

import { useState } from "react";

/**
 * One row in the /admin panel. Delete is gated by the admin token (passed
 * down from the page URL) and confirms before removing.
 */
export function AdminProblemRow({
  slug,
  title,
  reporter,
  token,
}: {
  slug: string;
  title: string;
  reporter: string;
  token: string;
}) {
  const [gone, setGone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!window.confirm(`Delete "${title}"? This also removes its proposals, bounty, and comments.`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/problems", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setGone(true);
      } else {
        window.alert(data.error || "Delete failed");
      }
    } catch {
      window.alert("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (gone) return null;

  return (
    <li className="flex items-center justify-between gap-3 border-b border-ink-100 py-2.5">
      <span className="min-w-0">
        <span className="block truncate text-[14px] text-ink-950">{title}</span>
        <span className="font-mono text-[11px] text-ink-400">
          {reporter} · {slug}
        </span>
      </span>
      <button
        type="button"
        onClick={del}
        disabled={busy}
        className="shrink-0 rounded-full border border-rose-300 px-3 py-1.5 text-[12px] font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-40"
      >
        {busy ? "Deleting" : "Delete"}
      </button>
    </li>
  );
}
