"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Nessie, the 🦕 chat in the bottom-right. Conversational: talks to
 * /api/nessie (the agent's reactive brain). A one-tap 0 to 5 rating logs
 * structured feedback to /api/feedback. The 24/7 autonomous worker is the
 * OpenClaw instance on the VPS; this is where humans and the agent meet.
 */

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi, I am Nessie. I help the community surface and solve its own problems. How is your NS experience right now?";

export function Nessie() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [rated, setRated] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function rate(n: number) {
    setRated(n);
    setMsgs((m) => [
      ...m,
      { role: "user", content: `My experience: ${n}/5` },
      {
        role: "assistant",
        content: n >= 5 ? "Love that. What is working best?" : "Thanks. What would make it a 5?",
      },
    ]);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: n, page: pathname }),
    }).catch(() => {});
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    // If they answered the "what would make it a 5" with a low rating, log it.
    if (rated !== null && rated < 5) {
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: rated, message: text, page: pathname }),
      }).catch(() => {});
      setRated(null);
    }
    try {
      const res = await fetch("/api/nessie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reply?: string };
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: data.reply || "I am here, but a little quiet right now." },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I could not reach my brain just now." }]);
    } finally {
      setBusy(false);
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
            className="absolute bottom-14 right-0 flex h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-[0_20px_50px_-20px_rgba(10,10,10,0.35)]"
          >
            <div className="flex items-center gap-2 border-b border-ink-100 bg-paper-tint px-4 py-2.5">
              <span className="text-[18px] leading-none" aria-hidden>🦕</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Nessie
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-[1.45] ${
                    m.role === "assistant"
                      ? "bg-paper-tint text-ink-800"
                      : "ml-auto bg-ink-950 text-paper"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {rated === null && (
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => rate(n)}
                      className="h-7 w-7 rounded-lg border border-ink-200 text-[13px] text-ink-500 transition-colors hover:border-ink-950 hover:text-ink-950"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              {busy && <div className="text-[12px] text-ink-400">Nessie is thinking...</div>}
            </div>

            <div className="border-t border-ink-100 p-2.5">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Tell Nessie anything"
                  className="flex-1 rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[13px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
                />
                <button
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="rounded-full bg-ink-950 px-3 py-2 text-[12px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
                >
                  Send
                </button>
              </div>
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
