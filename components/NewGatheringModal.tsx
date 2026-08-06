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
import type { GatheringKind } from "@/lib/gatherings";

const IDENTITY_KEY = "ness:identity:v1";

type Mode = "anonymous" | "pseudonymous" | "real";
const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "anonymous", label: "Anonymous", hint: "No name attached." },
  { id: "pseudonymous", label: "Pseudonym", hint: "Show a handle, not your real name." },
  { id: "real", label: "Real name", hint: "Put your name to it." },
];

const COPY: Record<GatheringKind, { title: string; placeholder: string; whenLabel: string; done: string }> = {
  event: {
    title: "Post an event",
    placeholder: "What's happening?",
    whenLabel: "When",
    done: "Posted ✓",
  },
  meal: {
    title: "Post a meal",
    placeholder: "What's cooking?",
    whenLabel: "Ready at",
    done: "Posted ✓",
  },
};

/**
 * Same fewest-friction filing as NewProblemModal: anonymous by default, a
 * handle or real name is opt-in. Shared for both /events and /food, kind
 * fixes which board it posts to.
 */
export function NewGatheringModal({ kind, trigger }: { kind: GatheringKind; trigger: React.ReactNode }) {
  const router = useRouter();
  const copy = COPY[kind];
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [when, setWhen] = useState("");
  const [details, setDetails] = useState("");
  const [mode, setMode] = useState<Mode>("anonymous");
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { name?: string; handle?: string };
        if (p.handle) setHandle(p.handle);
        if (p.name) setName(p.name);
      }
    } catch { /* noop */ }
  }, []);

  async function submit() {
    if (!title.trim()) { setErr(copy.placeholder); return; }
    if (!when) { setErr(`Add ${copy.whenLabel.toLowerCase()}.`); return; }

    let hostDisplayName = "Anonymous";
    let hostHandle = "anon";
    if (mode === "pseudonymous") {
      const h = handle.trim().replace(/^@/, "").toLowerCase();
      if (!h) { setErr("Add a handle, or switch to anonymous."); return; }
      hostHandle = h; hostDisplayName = `@${h}`;
    } else if (mode === "real") {
      const n = name.trim();
      if (!n) { setErr("Add your name, or switch to anonymous."); return; }
      hostDisplayName = n;
      hostHandle = handle.trim().replace(/^@/, "").toLowerCase() || n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/gatherings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind, title: title.trim(), body: details.trim() || undefined,
          place: place.trim() || undefined, startsAt: new Date(when).toISOString(),
          hostDisplayName, hostHandle,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(res.status === 503 ? "The board is not connected to a database yet." : (data.error ?? `HTTP ${res.status}`));
      }
      if (mode !== "anonymous") {
        try { localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name: name.trim(), handle: hostHandle })); } catch { /* noop */ }
      }
      setDone(true);
      setTitle(""); setPlace(""); setWhen(""); setDetails("");
      router.refresh();
      setTimeout(() => { setOpen(false); setDone(false); }, 1400);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[13.5px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setErr(null); setDone(false); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{copy.title}</DialogTitle></DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <p className="serif text-[26px] leading-tight text-ink-950">{copy.done}</p>
            <p className="mt-1.5 text-[13px] text-ink-600">It's on the board now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input className={field} placeholder={copy.placeholder} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} autoFocus />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{copy.whenLabel}</label>
                <input type="datetime-local" className={field} value={when} onChange={(e) => setWhen(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">Where</label>
                <input className={field} placeholder="optional" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={200} />
              </div>
            </div>
            <textarea className={field} placeholder="Details (optional)" value={details} onChange={(e) => setDetails(e.target.value)} rows={2} maxLength={2000} />

            <div className="inline-flex rounded-lg border border-ink-200 p-0.5">
              {MODES.map((m) => (
                <button key={m.id} type="button" onClick={() => { setMode(m.id); setErr(null); }}
                  className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${mode === m.id ? "bg-ink-950 text-paper" : "text-ink-500 hover:text-ink-950"}`}>
                  {m.label}
                </button>
              ))}
            </div>
            {mode === "pseudonymous" && (
              <input className={field} placeholder="handle" value={handle} onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))} />
            )}
            {mode === "real" && (
              <div className="grid grid-cols-2 gap-2">
                <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className={field} placeholder="handle (optional)" value={handle} onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))} />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-0.5">
              <span className="text-[11px] text-ink-400">{err ? <span className="text-amber-700">{err}</span> : MODES.find((m) => m.id === mode)?.hint}</span>
              <button onClick={submit} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-[#2563eb] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-40">
                {busy ? "Posting" : "Post it"} {!busy && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
