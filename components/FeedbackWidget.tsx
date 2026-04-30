"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type Stage = "rating" | "comment" | "submitting" | "done" | "error";

const RATINGS = [1, 2, 3, 4, 5] as const;
const RATING_LABELS: Record<number, string> = {
  1: "Broken",
  2: "Rough",
  3: "Fine",
  4: "Good",
  5: "Loved it",
};

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [stage, setStage] = useState<Stage>("rating");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setRating(null);
        setComment("");
        setStage("rating");
        setErrorMsg(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function pickRating(n: number) {
    setRating(n);
    if (n === 5) {
      submit(n, "");
    } else {
      setStage("comment");
    }
  }

  async function submit(r: number, c: string) {
    setStage("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: r,
          message: c.trim() || undefined,
          page: pathname || "/",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Status ${res.status}`);
      }
      setStage("done");
    } catch (err) {
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Give feedback"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2.5 text-[12px] font-medium text-ink-950 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] transition-colors hover:border-ink-950 sm:bottom-6 sm:right-6"
      >
        <FeedbackIcon className="h-3.5 w-3.5" />
        Feedback
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-label="Close feedback"
              className="fixed inset-0 z-40 bg-ink-950/10 backdrop-blur-[2px]"
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-label="Feedback"
              className="fixed bottom-20 right-5 z-50 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-[0_20px_48px_-12px_rgba(0,0,0,0.18)] sm:bottom-24 sm:right-6"
            >
              <div className="flex items-center justify-between border-b border-ink-100 bg-paper-tint px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Quick check
                </p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-[18px] leading-none text-ink-400 transition-colors hover:text-ink-950"
                >
                  ×
                </button>
              </div>

              <div className="p-5">
                {stage === "rating" && (
                  <div>
                    <h3 className="serif text-[20px] leading-tight text-ink-950">
                      How&apos;s Ness right now?
                    </h3>
                    <p className="mt-1 text-[12px] text-ink-500">
                      One tap. Adam reads every one.
                    </p>
                    <div className="mt-4 grid grid-cols-5 gap-1.5">
                      {RATINGS.map((n) => (
                        <button
                          key={n}
                          onClick={() => pickRating(n)}
                          className="group flex flex-col items-center gap-1 rounded-xl border border-ink-200 bg-paper px-2 py-3 transition-colors hover:border-ink-950 hover:bg-paper-tint"
                        >
                          <span className="serif text-[20px] leading-none text-ink-950 transition-transform group-hover:-translate-y-0.5">
                            {n}
                          </span>
                          <span className="text-[9.5px] uppercase tracking-wider text-ink-500 group-hover:text-ink-700">
                            {RATING_LABELS[n]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {stage === "comment" && rating !== null && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="serif text-[24px] leading-none text-ink-950">
                        {rating}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
                        {RATING_LABELS[rating]}
                      </span>
                    </div>
                    <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
                      What was missing?
                    </h3>
                    <textarea
                      autoFocus
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Confused on the bounty thing. The pledge button didn't work. The copy felt off."
                      className="mt-3 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
                    />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setStage("rating");
                          setComment("");
                        }}
                        className="text-[12px] text-ink-500 transition-colors hover:text-ink-950"
                      >
                        ← back
                      </button>
                      <button
                        onClick={() => submit(rating, comment)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-1.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
                      >
                        Send
                        <span aria-hidden>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {stage === "submitting" && (
                  <div className="flex items-center gap-3 py-4">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-ink-950" />
                    <p className="text-[14px] text-ink-700">Sending...</p>
                  </div>
                )}

                {stage === "done" && (
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Logged
                    </div>
                    <h3 className="serif mt-3 text-[20px] leading-tight text-ink-950">
                      Thanks for the signal.
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">
                      Adam triages feedback weekly. The list at{" "}
                      <a
                        href="/feedback"
                        className="text-ink-950 underline-offset-4 hover:underline"
                      >
                        /feedback
                      </a>{" "}
                      explains how it&apos;s handled.
                    </p>
                    <button
                      onClick={() => setOpen(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
                    >
                      Close
                    </button>
                  </div>
                )}

                {stage === "error" && (
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Couldn&apos;t send
                    </div>
                    <h3 className="serif mt-3 text-[20px] leading-tight text-ink-950">
                      The feedback didn&apos;t go through.
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">
                      Network error. Your input:{" "}
                      <span className="text-ink-950">{rating}/5</span>
                      {comment && <>, &ldquo;{comment}&rdquo;</>}.
                    </p>
                    {errorMsg && (
                      <p className="mt-2 font-mono text-[11px] text-ink-500">
                        {errorMsg}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setStage(comment ? "comment" : "rating");
                        setErrorMsg(null);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FeedbackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} aria-hidden>
      <path
        d="M2 3.2C2 2.5 2.5 2 3.2 2h7.6c.7 0 1.2.5 1.2 1.2v5.6c0 .7-.5 1.2-1.2 1.2H6L3 12V3.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
