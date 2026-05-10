"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NessieMark } from "./NessieLogo";
import { HeaderAllMenu } from "./HeaderAllMenu";

// Header nav mirrors the city map. Five places, in the order a visitor
// usually wants to walk: orient, see what's open, see who's funded,
// see the people, see the connectors.
const links = [
  { href: "/about", label: "Welcome" },
  { href: "/solve", label: "Townhall" },
  { href: "/bounties", label: "Bounties" },
  { href: "/citizens", label: "Citizens" },
  { href: "/pagerank", label: "Observatory" },
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
          <motion.div
            whileHover={{ rotate: -4, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-[8px] bg-nessie-600 text-paper shadow-[0_2px_8px_-2px_rgba(37,99,235,0.5)]"
          >
            <NessieMark className="h-5 w-5" />
          </motion.div>
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
          <HeaderAllMenu />
        </nav>

        <Link
          href="/solve/new"
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

