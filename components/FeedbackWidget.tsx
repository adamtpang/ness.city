"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const REPO_NEW_ISSUE = "https://github.com/adamtpang/ness.city/issues/new";

/**
 * Floating "Feedback" button.
 * Opens a new GitHub issue, pre-filled with the page you were on. No
 * widget, no form, no rating, no internal inbox — feedback lives on
 * GitHub Issues, the same place every other open-source project tracks
 * what's broken and what's next. (Elon: best part is no part.)
 */
export function FeedbackWidget() {
  const pathname = usePathname() || "/";
  const title = `[${pathname}] `;
  const body = `_Filed via the Feedback button on ness.city${pathname}_\n\n`;
  const href = `${REPO_NEW_ISSUE}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;

  return (
    <motion.a
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="File feedback on GitHub Issues"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3.5 py-2 text-[12px] font-medium text-ink-950 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] transition-colors hover:border-ink-950 sm:bottom-6 sm:right-6"
    >
      Feedback
      <span aria-hidden className="text-ink-400">↗</span>
    </motion.a>
  );
}
