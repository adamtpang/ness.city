"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Problems" },
  { href: "/leaderboard", label: "Citizens" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-ink-200/80 bg-paper/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-[6px] bg-ink-950 text-paper">
            <PlusIcon className="h-3.5 w-3.5" />
          </div>
          <span className="serif text-[20px] leading-none text-ink-950">
            ness<span className="text-ink-400">.city</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                  active ? "text-ink-950" : "text-ink-500 hover:text-ink-950"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink-100"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/submit"
          className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          Surface a problem
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
