"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Tight three-pane header: brand · nav · primary action.
 * The whole community engine is one click away from anywhere.
 */
const NAV = [
  { href: "/market", label: "Market" },
  { href: "/solve", label: "Forum" },
  { href: "/citizens", label: "Citizens" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-ink-200/80 bg-paper/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-[22px] leading-none"
            aria-hidden
          >
            🦕
          </motion.span>
          <span className="serif text-[18px] leading-none text-ink-950">
            ness<span className="text-ink-400">.city</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active =
              n.href === "/market"
                ? pathname.startsWith("/market")
                : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 text-[12.5px] transition-colors ${
                  active
                    ? "bg-ink-100 text-ink-950"
                    : "text-ink-500 hover:text-ink-950"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={pathname.startsWith("/solve") ? "/solve/new" : "/market/new"}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          {pathname.startsWith("/solve") ? "Surface" : "Post"}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.header>
  );
}
