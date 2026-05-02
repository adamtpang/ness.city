"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IDENTITY_KEY = "ness:identity:v1";

function useIdentity() {
  const [identity, setIdentity] = useState<{ name: string; handle: string }>({
    name: "",
    handle: "",
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) setIdentity(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  function save(name: string, handle: string) {
    setIdentity({ name, handle });
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name, handle }));
    } catch {
      /* ignore */
    }
  }
  return { identity, save };
}

function IdentityFields({
  identity,
  onChange,
}: {
  identity: { name: string; handle: string };
  onChange: (id: { name: string; handle: string }) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="Your name"
        value={identity.name}
        onChange={(e) => onChange({ ...identity, name: e.target.value })}
        className="rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[13px] focus:border-ink-950 focus:outline-none"
      />
      <input
        type="text"
        placeholder="handle"
        value={identity.handle}
        onChange={(e) =>
          onChange({ ...identity, handle: e.target.value.replace(/^@/, "") })
        }
        className="rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[13px] focus:border-ink-950 focus:outline-none"
      />
    </div>
  );
}

function Toast({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  const cls =
    kind === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-amber-300 bg-amber-50 text-amber-900";
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`mt-3 rounded-xl border px-3 py-2 text-[12.5px] ${cls}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Proposal form ---------- */

export function ProposeForm({ problemSlug }: { problemSlug: string }) {
  const { identity, save } = useIdentity();
  const [id, setId] = useState(identity);
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => setId(identity), [identity]);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemSlug,
          summary: summary.trim(),
          body: body.trim(),
          authorDisplayName: id.name.trim(),
          authorHandle: id.handle.trim().toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      save(id.name.trim(), id.handle.trim().toLowerCase());
      setMsg({ kind: "ok", text: "Proposal posted. Refresh to see it." });
      setSummary("");
      setBody("");
      setTimeout(() => location.reload(), 700);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Propose a solution
      </p>
      <h3 className="serif mt-1.5 text-[20px] leading-tight text-ink-950">
        Concrete fix. Parts list. Hours.
      </h3>
      <input
        type="text"
        placeholder="One-line proposal (the fix headline)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="mt-3 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
      />
      <textarea
        rows={4}
        placeholder="The full proposal: parts, hours, expected outcome."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mt-2 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
      />
      <div className="mt-3">
        <IdentityFields identity={id} onChange={setId} />
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={submit}
          disabled={busy || !summary.trim() || !body.trim() || !id.name || !id.handle}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[13px] font-medium text-paper hover:bg-ink-800 disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post proposal"}
          {!busy && <span aria-hidden>→</span>}
        </button>
      </div>
      <AnimatePresence>{msg && <Toast kind={msg.kind}>{msg.text}</Toast>}</AnimatePresence>
    </div>
  );
}

/* ---------- Bounty creation form (no bounty yet) ---------- */

export function StartBountyForm({
  problemSlug,
  proposals,
}: {
  problemSlug: string;
  proposals: { id: string; summary: string }[];
}) {
  const [proposalId, setProposalId] = useState(proposals[0]?.id ?? "");
  const [goalUsd, setGoalUsd] = useState<string>("200");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemSlug,
          proposalId,
          goalUsd: Number(goalUsd),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMsg({ kind: "ok", text: "Bounty open. Pledges accepted." });
      setTimeout(() => location.reload(), 700);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "error" });
    } finally {
      setBusy(false);
    }
  }

  if (proposals.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Open a bounty
      </p>
      <h3 className="serif mt-1.5 text-[20px] leading-tight text-ink-950">
        Anchor a USD bounty to a proposal.
      </h3>
      <select
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        className="mt-3 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[13px] focus:border-ink-950 focus:outline-none"
      >
        {proposals.map((p) => (
          <option key={p.id} value={p.id}>
            {p.summary.slice(0, 80)}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-[13px] text-ink-600">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={5}
          max={50000}
          value={goalUsd}
          onChange={(e) => setGoalUsd(e.target.value)}
          className="w-32 rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
        />
        <span className="text-[12px] text-ink-500">goal</span>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={submit}
          disabled={busy || !proposalId || !goalUsd}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[13px] font-medium text-paper hover:bg-ink-800 disabled:opacity-50"
        >
          {busy ? "Opening…" : "Open bounty"}
          {!busy && <span aria-hidden>→</span>}
        </button>
      </div>
      <AnimatePresence>{msg && <Toast kind={msg.kind}>{msg.text}</Toast>}</AnimatePresence>
    </div>
  );
}

/* ---------- Pledge form ---------- */

export function PledgeForm({ bountyId }: { bountyId: string }) {
  const { identity, save } = useIdentity();
  const [id, setId] = useState(identity);
  const [amountUsd, setAmountUsd] = useState<string>("25");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => setId(identity), [identity]);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId,
          amountUsd: Number(amountUsd),
          note: note.trim() || undefined,
          patronDisplayName: id.name.trim(),
          patronHandle: id.handle.trim().toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        bountyState?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      save(id.name.trim(), id.handle.trim().toLowerCase());
      setMsg({
        kind: "ok",
        text:
          data.bountyState === "funded"
            ? "Pledge in. Bounty fully funded."
            : "Pledge in. Refresh to see it.",
      });
      setNote("");
      setTimeout(() => location.reload(), 700);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 border-t border-ink-100 pt-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Pledge to this bounty
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[13px] text-ink-600">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={50000}
          value={amountUsd}
          onChange={(e) => setAmountUsd(e.target.value)}
          className="w-24 rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Optional note (public)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-2 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[13px] focus:border-ink-950 focus:outline-none"
      />
      <div className="mt-2">
        <IdentityFields identity={id} onChange={setId} />
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={submit}
          disabled={busy || !amountUsd || !id.name || !id.handle}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[13px] font-medium text-paper hover:bg-ink-800 disabled:opacity-50"
        >
          {busy ? "Pledging…" : "Pledge"}
          {!busy && <span aria-hidden>→</span>}
        </button>
      </div>
      <AnimatePresence>{msg && <Toast kind={msg.kind}>{msg.text}</Toast>}</AnimatePresence>
    </div>
  );
}

/* ---------- Documentation form (mark shipped) ---------- */

export function DocumentForm({ problemSlug }: { problemSlug: string }) {
  const { identity, save } = useIdentity();
  const [id, setId] = useState(identity);
  const [body, setBody] = useState("");
  const [costUsd, setCostUsd] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => setId(identity), [identity]);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/documentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemSlug,
          body: body.trim(),
          costUsd: costUsd ? Number(costUsd) : undefined,
          authorDisplayName: id.name.trim(),
          authorHandle: id.handle.trim().toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        karmaAwarded?: number;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      save(id.name.trim(), id.handle.trim().toLowerCase());
      setMsg({
        kind: "ok",
        text: `Shipped. +${data.karmaAwarded ?? 25} karma. Bounty paid.`,
      });
      setTimeout(() => location.reload(), 800);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
        Claim & ship
      </p>
      <h3 className="serif mt-1.5 text-[20px] leading-tight text-ink-950">
        Document what you did. Earn +25 karma.
      </h3>
      <textarea
        rows={4}
        placeholder="What you actually shipped: steps, before/after, parts, total cost."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mt-3 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-[13px] text-ink-600">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={50000}
          value={costUsd}
          onChange={(e) => setCostUsd(e.target.value)}
          placeholder="cost"
          className="w-24 rounded-xl border border-ink-200 bg-paper px-3 py-2 text-[14px] focus:border-ink-950 focus:outline-none"
        />
        <span className="text-[12px] text-ink-500">spent (optional)</span>
      </div>
      <div className="mt-2">
        <IdentityFields identity={id} onChange={setId} />
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={submit}
          disabled={busy || !body.trim() || !id.name || !id.handle}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[13px] font-medium text-paper hover:bg-ink-800 disabled:opacity-50"
        >
          {busy ? "Shipping…" : "Mark shipped"}
          {!busy && <span aria-hidden>→</span>}
        </button>
      </div>
      <AnimatePresence>{msg && <Toast kind={msg.kind}>{msg.text}</Toast>}</AnimatePresence>
    </div>
  );
}
