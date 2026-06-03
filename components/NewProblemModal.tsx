"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IDENTITY_KEY = "ness:identity:v1";

/**
 * Fewest-clicks problem filing. Returning user: open, type one line,
 * Enter. That is it. Identity is remembered; we only ask for it the
 * first time, inline. Category + diagnosis are optional, behind a tap.
 */
export function NewProblemModal({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [hasIdentity, setHasIdentity] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { name?: string; handle?: string };
        if (p.handle) {
          setName(p.name ?? "");
          setHandle(p.handle);
          setHasIdentity(true);
        }
      }
    } catch {
      /* noop */
    }
  }, []);

  async function submit() {
    if (!title.trim()) {
      setErr("Type the problem in one line.");
      return;
    }
    const h = (handle.trim() || "anon").replace(/^@/, "").toLowerCase();
    const n = name.trim() || "Anonymous";
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          reporterDisplayName: n,
          reporterHandle: h,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      if (handle.trim()) {
        try {
          localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name: n, handle: h }));
        } catch {
          /* noop */
        }
      }
      setOpen(false);
      setTitle("");
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
          <DialogTitle>What is the problem?</DialogTitle>
        </DialogHeader>
        <div className="space-y-2.5">
          <input
            className={field}
            placeholder="One line. Press Enter."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            maxLength={140}
            autoFocus
          />
          {!hasIdentity && (
            <div className="grid grid-cols-2 gap-2">
              <input
                className={field}
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={field}
                placeholder="handle (optional)"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              />
            </div>
          )}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            <span className="text-[11px] text-ink-400">
              {err ? <span className="text-amber-700">{err}</span> : "Sorted by the community next."}
            </span>
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
            >
              {busy ? "Filing" : "File it"}
              {!busy && <span aria-hidden>→</span>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
