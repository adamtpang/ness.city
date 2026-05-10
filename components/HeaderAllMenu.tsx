"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  placesBySection,
  sectionLabels,
  sectionOrder,
  type Place,
} from "@/lib/places";

/**
 * "All ▾" dropdown next to the main nav links. Opens a panel below
 * with every route grouped by section. Escape / outside-click closes.
 * Helps newcomers find every feature from any page.
 */
export function HeaderAllMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const grouped = placesBySection();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`relative inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
          open
            ? "bg-ink-100 text-ink-950"
            : "text-ink-500 hover:text-ink-950"
        }`}
      >
        All
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="inline-block text-[10px]"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,560px)] overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)]"
          >
            <div className="border-b border-ink-100 bg-paper-tint px-4 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Every place in Ness
              </p>
            </div>
            <div className="grid gap-x-2 gap-y-3 p-4 sm:grid-cols-2">
              {sectionOrder.map((s) => {
                const items = grouped[s].filter((p) => p.inHeader !== false);
                if (items.length === 0) return null;
                return (
                  <div key={s}>
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                      {sectionLabels[s].label}
                    </p>
                    <ul>
                      {items.map((p) => (
                        <li key={p.id}>
                          <MenuLink place={p} onClick={() => setOpen(false)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  place,
  onClick,
}: {
  place: Place;
  onClick: () => void;
}) {
  return (
    <Link
      href={place.href}
      onClick={onClick}
      className="group flex items-baseline gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-paper-tint"
    >
      <span className="text-[13px] font-medium text-ink-950 group-hover:text-nessie-700">
        {place.name}
      </span>
      {place.status !== "live" && (
        <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider text-amber-800">
          {place.status === "in-design" ? "soon" : "planned"}
        </span>
      )}
      <span className="ml-auto truncate text-[11.5px] text-ink-500 sm:max-w-[260px]">
        {place.desc}
      </span>
    </Link>
  );
}
