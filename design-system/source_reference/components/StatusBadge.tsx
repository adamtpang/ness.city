import type { ProblemStatus } from "@/lib/types";

const dot: Record<ProblemStatus, string> = {
  open: "bg-ink-400",
  investigating: "bg-amber-500",
  "in-progress": "bg-blue-500",
  solved: "bg-emerald-600",
};

const labels: Record<ProblemStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  "in-progress": "In progress",
  solved: "Solved",
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-700">
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {labels[status]}
    </span>
  );
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
      {category}
    </span>
  );
}
