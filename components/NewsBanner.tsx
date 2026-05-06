"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Dismissible top banner for changelog / news / Ness Weekly.
 * Bumped by changing CURRENT_NEWS.id; users who dismissed an older id
 * see the new one. Stored in localStorage by id, not by message text.
 */

type NewsItem = {
  id: string;
  label: string;
  message: string;
  href?: string;
  cta?: string;
};

const CURRENT_NEWS: NewsItem = {
  id: "v0.13-points",
  label: "v0.13",
  message:
    "The Points Vault is open. Free NS points calculator with vesting timeline.",
  href: "/points",
  cta: "Open the calculator",
};

const STORAGE_KEY = "ness:news-dismissed:v1";

export function NewsBanner() {
  const [visible, setVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== CURRENT_NEWS.id) setVisible(true);
    } catch {
      setVisible(true);
    }
    setHydrated(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, CURRENT_NEWS.id);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-50 border-b border-ink-200 bg-nessie-600 text-paper"
          role="status"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-2 text-[12.5px]">
            <span className="inline-flex shrink-0 items-center rounded-full bg-paper/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]">
              {CURRENT_NEWS.label}
            </span>
            <span className="flex-1 truncate sm:whitespace-normal">
              {CURRENT_NEWS.message}
            </span>
            {CURRENT_NEWS.href && CURRENT_NEWS.cta && (
              <Link
                href={CURRENT_NEWS.href}
                className="hidden shrink-0 items-center gap-1 font-medium underline-offset-2 hover:underline sm:inline-flex"
              >
                {CURRENT_NEWS.cta}
                <span aria-hidden>→</span>
              </Link>
            )}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="ml-1 shrink-0 text-paper/80 transition-colors hover:text-paper"
            >
              <span className="text-[16px] leading-none">×</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
