import type { ProblemStatus } from "@/lib/types";

const styles: Record<ProblemStatus, string> = {
  open: "bg-ink-800 text-ink-300 ring-ink-700",
  investigating: "bg-amber-950/40 text-amber-300 ring-amber-900/60",
  "in-progress": "bg-blue-950/40 text-blue-300 ring-blue-900/60",
  solved: "bg-emerald-950/40 text-emerald-300 ring-emerald-900/60",
};

const labels: Record<ProblemStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  "in-progress": "In progress",
  solved: "Solved",
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "solved"
            ? "bg-emerald-400"
            : status === "in-progress"
              ? "bg-blue-400"
              : status === "investigating"
                ? "bg-amber-400"
                : "bg-ink-400"
        }`}
      />
      {labels[status]}
    </span>
  );
}

const categoryStyles: Record<string, string> = {
  operations: "text-ink-300",
  social: "text-pink-300",
  infra: "text-cyan-300",
  policy: "text-violet-300",
  wellbeing: "text-emerald-300",
};

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className={`text-[11px] font-mono ${categoryStyles[category] ?? "text-ink-400"}`}>
      {category}
    </span>
  );
}
