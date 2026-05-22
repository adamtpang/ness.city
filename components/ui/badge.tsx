import { cn } from "@/lib/utils";

type Variant = "default" | "open" | "investigating" | "in-progress" | "solved" | "category";

const STYLES: Record<Variant, string> = {
  default: "border-ink-200 bg-paper text-ink-700",
  open: "border-ink-200 bg-paper-tint text-ink-600",
  investigating: "border-amber-200 bg-amber-50 text-amber-800",
  "in-progress": "border-blue-200 bg-blue-50 text-blue-800",
  solved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  category: "border-ink-200 bg-paper-tint text-ink-700",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
