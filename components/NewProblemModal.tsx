"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const IDENTITY_KEY = "ness:identity:v1";
const CATEGORIES = ["operations", "social", "infra", "policy", "wellbeing", "other"] as const;

/** Dead-simple problem form in a modal. Title · category · what's wrong ·
 *  why it happens · who you are. Posts to /api/problems, refreshes. */
export function NewProblemModal({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("operations");
  const [summary, setSummary] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { name?: string; handle?: string };
        setName(p.name ?? "");
        setHandle(p.handle ?? "");
      }
    } catch {
      /* noop */
    }
  }, []);

  async function submit() {
    if (!title.trim() || !summary.trim() || !rootCause.trim() || !name.trim() || !handle.trim()) {
      setErr("Fill in every field — keep each short.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          summary: summary.trim(),
          rootCause: rootCause.trim(),
          reporterDisplayName: name.trim(),
          reporterHandle: handle.trim().replace(/^@/, "").toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      try {
        localStorage.setItem(
          IDENTITY_KEY,
          JSON.stringify({ name: name.trim(), handle: handle.trim().replace(/^@/, "").toLowerCase() }),
        );
      } catch {
        /* noop */
      }
      setOpen(false);
      setTitle("");
      setSummary("");
      setRootCause("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[13.5px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Surface a problem</DialogTitle>
          <DialogDescription>Keep it sharp. The community sorts it from here.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5">
          <input
            className={field}
            placeholder="Title — the problem in one line"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            autoFocus
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-2.5 py-1 text-[11.5px] capitalize transition-colors ${
                  category === c
                    ? "bg-ink-950 text-paper"
                    : "border border-ink-200 text-ink-600 hover:border-ink-950"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <textarea
            className={`${field} resize-none`}
            placeholder="What's wrong? (the symptom)"
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <textarea
            className={`${field} resize-none`}
            placeholder="Why does it happen? (your diagnosis)"
            rows={2}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className={field}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={field}
              placeholder="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
            />
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            {err ? (
              <span className="text-[11.5px] text-amber-700">{err}</span>
            ) : (
              <span />
            )}
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
            >
              {busy ? "Filing…" : "File it"}
              {!busy && <span aria-hidden>→</span>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
