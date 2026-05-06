"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable "learn more" modal. Click the trigger to open a centered
 * card with a backdrop. Closes on ×, Escape, or backdrop click. Use it
 * to keep page surfaces minimal and tuck the long explanations inside.
 */
export function InfoModal({
  trigger,
  title,
  children,
  size = "md",
}: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const widthCls =
    size === "lg"
      ? "max-w-2xl"
      : size === "sm"
        ? "max-w-md"
        : "max-w-xl";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
      >
        {trigger}
        <span aria-hidden className="text-ink-400">
          ↗
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={`fixed inset-x-4 top-[10vh] z-50 mx-auto max-h-[80vh] overflow-y-auto rounded-2xl border border-ink-200 bg-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[92vw] ${widthCls}`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-paper/95 px-5 py-3.5 backdrop-blur">
                <h2 className="serif text-[20px] leading-tight text-ink-950">
                  {title}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-[22px] leading-none text-ink-400 transition-colors hover:text-ink-950"
                >
                  ×
                </button>
              </div>
              <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
