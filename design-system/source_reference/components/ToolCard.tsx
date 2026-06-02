"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tool } from "@/lib/tools";

const statusStyles: Record<Tool["status"], { dot: string; label: string }> = {
  live: { dot: "bg-emerald-600", label: "Live" },
  "in-design": { dot: "bg-amber-500", label: "In design" },
  planned: { dot: "bg-ink-400", label: "Planned" },
};

export function ToolCard({ tool }: { tool: Tool }) {
  const s = statusStyles[tool.status];
  const active = tool.status === "live";

  const inner = (
    <motion.div
      whileHover={active ? { y: -2 } : {}}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative h-full overflow-hidden rounded-2xl border p-6 ${
        active
          ? "border-ink-200 bg-paper hover:border-ink-400"
          : "border-dashed border-ink-300 bg-paper-tint"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <ToolGlyph id={tool.id} active={active} />
        <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-700">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      <h3 className="serif mt-5 text-[28px] leading-[1.05] text-ink-950 transition-opacity group-hover:opacity-80">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-[14px] font-medium text-ink-700">
        {tool.tagline}
      </p>
      <p className="mt-2.5 text-[13px] leading-[1.6] text-ink-500">
        {tool.description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-ink-950">
        {active ? "Open the tool" : "Read the plan"}
        <span aria-hidden>→</span>
      </div>
    </motion.div>
  );

  if (!tool.href) {
    return <div className="h-full">{inner}</div>;
  }

  return (
    <Link href={tool.href} className="block h-full">
      {inner}
    </Link>
  );
}

function ToolGlyph({ id, active }: { id: string; active: boolean }) {
  const tone = active ? "text-ink-950" : "text-ink-500";
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
        active ? "border-ink-200 bg-paper-tint" : "border-ink-200 bg-paper"
      } ${tone}`}
    >
      {id === "townhall" && (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path d="M3 8 L10 3 L17 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 8 V16 H15 V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 16 V12 H11 V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {id === "atlas" && (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <circle cx="5" cy="5" r="1.6" fill="currentColor" />
          <circle cx="15" cy="6" r="1.6" fill="currentColor" />
          <circle cx="10" cy="11" r="1.6" fill="currentColor" />
          <circle cx="5" cy="15" r="1.6" fill="currentColor" />
          <circle cx="15" cy="15" r="1.6" fill="currentColor" />
          <path d="M5 5 L10 11 M15 6 L10 11 M10 11 L5 15 M10 11 L15 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
      {id === "jobs" && (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <rect x="3" y="6" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 6 V4 H13 V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 11 H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {id === "market" && (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path d="M3 7 L4 4 H16 L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 7 V16 H17 V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
