"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignIn } from "@/components/SignIn";

const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

/**
 * Minimal header: brand mark on the left, sign-in on the right (only
 * when Privy is configured). The engine is the home page; filing a
 * problem is the modal on it. Nothing else competes.
 */
export function Header() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-ink-200/80 bg-paper/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-[20px] leading-none"
            aria-hidden
          >
            🦕
          </motion.span>
          <span className="serif text-[17px] leading-none text-ink-950">
            ness<span className="text-ink-400">.city</span>
          </span>
        </Link>
        {PRIVY_ENABLED && <SignIn />}
      </div>
    </motion.header>
  );
}
