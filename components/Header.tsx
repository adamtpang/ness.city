"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Focus mode. The product is the marketplace. Header is just the
 * wordmark (back to the feed) and one action (post). Every other surface
 * still exists at its URL but is intentionally off the nav so the thing
 * reads as one clean app.
 */
export function Header() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-ink-200/80 bg-paper/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
        <Link href="/market" className="group flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-[24px] leading-none"
            aria-hidden
          >
            🦕
          </motion.span>
          <span className="serif text-[20px] leading-none text-ink-950">
            ness<span className="text-ink-400">.city</span>
          </span>
        </Link>

        <Link
          href="/market/new"
          className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          Post a listing
          <motion.span
            aria-hidden
            className="inline-block"
            initial={false}
            animate={{ x: 0 }}
            whileHover={{ x: 2 }}
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.header>
  );
}
