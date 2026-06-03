"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * On-site feedback. Floating button → small popover with a 1-5 rating
 * and an optional note → POST /api/feedback (writes to the DB). No
 * GitHub round-trip; lowest friction for a member to say how it's going.
 */
export function FeedbackWidget() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function send() {
    if (!rating || state === "sending") return;
    setState("sending");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message: message.trim() || undefined, page: pathname }),
      });
      setState("done");
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setState("idle");
          setRating(0);
          setMessage("");
        }, 200);
      }, 1100);
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-12 right-0 w-[280px] rounded-2xl border border-ink-200 bg-paper p-4 shadow-[0_20px_50px_-20px_rgba(10,10,10,0.35)]"
          >
            {state === "done" ? (
              <p className="py-4 text-center text-[14px] text-ink-700">
                Thanks, logged.
              </p>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  How's your experience?
                </p>
                <div className="mt-3 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className={`h-8 w-8 rounded-lg text-[16px] transition-colors ${
                        n <= rating
                          ? "bg-ink-950 text-paper"
                          : "border border-ink-200 text-ink-400 hover:border-ink-950"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && rating < 5 && (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would make it a 5?"
                    rows={3}
                    className="mt-3 w-full resize-none rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[13px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
                  />
                )}
                <button
                  onClick={send}
                  disabled={!rating || state === "sending"}
                  className="mt-3 w-full rounded-full bg-ink-950 px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
                >
                  {state === "sending" ? "Sending…" : "Send"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Give feedback"
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3.5 py-2 text-[12px] font-medium text-ink-950 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] transition-colors hover:border-ink-950"
      >
        Feedback
      </motion.button>
    </div>
  );
}
