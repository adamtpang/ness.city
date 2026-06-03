"use client";

import { useState, type FormEvent } from "react";

/**
 * Waitlist signup. Email plus an optional one-liner on what they would build
 * or fix (high-signal for routing them to NS-team vs Ness-user work later).
 * The live count bumps on submit, which is a nice moment when a room scans
 * the QR at once.
 */
export function WaitlistForm({ initialCount }: { initialCount: number }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [count, setCount] = useState(initialCount);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (state === "sending") return;
    if (!email.trim()) {
      setErr("Enter your email.");
      return;
    }
    setState("sending");
    setErr(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "join" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        count?: number;
      };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong");
      if (typeof data.count === "number") setCount(data.count);
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-ink-200 bg-paper p-6">
        <p className="serif text-[26px] leading-tight text-ink-950">You are in.</p>
        <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-700">
          We will reach out as the engine opens up. Welcome aboard.
        </p>
        <p className="mt-3 font-mono text-[12px] text-ink-500">
          {count} {count === 1 ? "person" : "people"} signed up
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        className={field}
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[12px] text-ink-500">
          {err ? (
            <span className="text-amber-700">{err}</span>
          ) : (
            `${count} already in`
          )}
        </span>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
        >
          {state === "sending" ? "Joining" : "Join"}
          {state !== "sending" && <span aria-hidden>→</span>}
        </button>
      </div>
    </form>
  );
}
