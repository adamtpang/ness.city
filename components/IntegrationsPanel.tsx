import { integrations, type Integration } from "@/lib/tools";

const stateStyles: Record<Integration["state"], { dot: string; label: string }> = {
  live: { dot: "bg-emerald-600", label: "Connected" },
  applied: { dot: "bg-amber-500", label: "Application pending" },
  soon: { dot: "bg-ink-400", label: "Soon" },
  external: { dot: "bg-blue-500", label: "External" },
};

export function IntegrationsPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200">
      <div className="border-b border-ink-200 bg-paper-tint px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          The wider city
        </p>
        <h3 className="serif mt-1 text-[22px] leading-tight text-ink-950">
          Plumbing into the rest of NS.
        </h3>
        <p className="mt-1 text-[13px] text-ink-600">
          Other tools and primitives Ness wants to talk to or already does.
        </p>
      </div>
      <ul>
        {integrations.map((it) => {
          const s = stateStyles[it.state];
          const isLink = it.url && it.url !== "#";
          const Inner = (
            <div className="grid grid-cols-12 gap-4 border-b border-ink-100 bg-paper px-5 py-3 last:border-0 hover:bg-paper-tint">
              <div className="col-span-5 flex items-center gap-2 font-mono text-[13px] text-ink-950">
                {it.name}
                {isLink && <span aria-hidden className="text-ink-400">↗</span>}
              </div>
              <div className="col-span-4 hidden items-center text-[12px] text-ink-600 sm:flex">
                {it.blurb}
              </div>
              <div className="col-span-12 flex items-center justify-end gap-1.5 text-[11px] text-ink-700 sm:col-span-3">
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </div>
            </div>
          );
          return (
            <li key={it.name}>
              {isLink ? (
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="block">
                  {Inner}
                </a>
              ) : (
                Inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
