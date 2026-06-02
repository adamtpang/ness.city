"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Nessie — the 🦕 button, bottom-right.
 *
 * v1 is the feedback interview: Nessie asks how your NS experience is
 * (0–5), what would make it a 5, and optional per-track ratings
 * (Learn / Earn / Burn / Fun). Posts to /api/feedback.
 *
 * The 24/7 autonomous problem-solving agent (importance × urgency, an
 * OpenClaw/Hermes loop that works the priority queue) is the next build.
 * For now Nessie listens; soon she acts.
 */

const TRACKS = ["learn", "earn", "burn", "fun"] as const;
type Track = (typeof TRACKS)[number];

export function Nessie() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState<Record<Track, number>>({
    learn: 0,
    earn: 0,
    burn: 0,
    fun: 0,
  });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function send() {
    if (!rating || state === "sending") return;
    setState("sending");
    const meta: Record<string, number> = {};
    for (const t of TRACKS) if (tracks[t] > 0) meta[t] = tracks[t];
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message: message.trim() || undefined,
          page: pathname,
          meta: Object.keys(meta).length ? meta : undefined,
        }),
      });
      setState("done");
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setState("idle");
          setRating(0);
          setMessage("");
          setTracks({ learn: 0, earn: 0, burn: 0, fun: 0 });
        }, 220);
      }, 1200);
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-14 right-0 w-[300px] overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-[0_20px_50px_-20px_rgba(10,10,10,0.35)]"
          >
            <div className="flex items-center gap-2 border-b border-ink-100 bg-paper-tint px-4 py-2.5">
              <span className="text-[18px] leading-none" aria-hidden>🦕</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Nessie
              </span>
            </div>

            <div className="p-4">
              {state === "done" ? (
                <p className="py-6 text-center text-[14px] text-ink-700">
                  Thank you. I&apos;m listening.
                </p>
              ) : (
                <>
                  <p className="text-[13.5px] leading-[1.5] text-ink-800">
                    How&apos;s your NS experience right now?
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        aria-label={`${n} of 5`}
                        className={`h-8 w-8 rounded-lg text-[15px] transition-colors ${
                          n <= rating
                            ? "bg-ink-950 text-paper"
                            : "border border-ink-200 text-ink-400 hover:border-ink-950"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <>
                      {rating < 5 && (
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="What would make it a 5?"
                          rows={2}
                          className="mt-3 w-full resize-none rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[13px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
                        />
                      )}
                      <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400">
                        Rate the tracks (optional)
                      </p>
                      <div className="mt-1.5 space-y-1">
                        {TRACKS.map((t) => (
                          <div key={t} className="flex items-center justify-between">
                            <span className="text-[12px] capitalize text-ink-700">{t}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  onClick={() =>
                                    setTracks((prev) => ({ ...prev, [t]: n }))
                                  }
                                  aria-label={`${t} ${n} of 5`}
                                  className={`h-3.5 w-3.5 rounded-full transition-colors ${
                                    n <= tracks[t] ? "bg-ink-950" : "bg-ink-200 hover:bg-ink-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={send}
                        disabled={state === "sending"}
                        className="mt-4 w-full rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
                      >
                        {state === "sending" ? "Sending…" : "Send to Nessie"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Nessie"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-200 bg-paper text-[24px] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.18)] transition-transform hover:scale-105"
      >
        <span aria-hidden>🦕</span>
      </motion.button>
    </div>
  );
}
