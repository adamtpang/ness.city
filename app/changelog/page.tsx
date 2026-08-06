import type { Metadata } from "next";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { CHANGELOG } from "@/lib/changelog";

const DESCRIPTION = "Every real, deployed change to ness.city, in order. Nothing written for the changelog, everything pulled from what actually shipped.";

export const metadata: Metadata = {
  title: "Changelog · Ness",
  description: DESCRIPTION,
  alternates: { canonical: "/changelog" },
  openGraph: { title: "Changelog · Ness", description: DESCRIPTION, url: "https://ness.city/changelog", type: "website" },
};

function groupByMonth(entries: typeof CHANGELOG) {
  const groups = new Map<string, typeof CHANGELOG>();
  for (const e of entries) {
    const key = e.date.slice(0, 7); // YYYY-MM
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return [...groups.entries()];
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function ChangelogPage() {
  const months = groupByMonth(CHANGELOG);

  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <FadeIn>
        <header className="border-b border-ink-200 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">Changelog</p>
          <h1 className="serif mt-2 text-[36px] leading-[1.05] text-ink-950">Every real change, in order.</h1>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-700">
            {DESCRIPTION} {CHANGELOG.length} entries since v0.3, straight from
            commit history. See <a href="/roadmap" className="underline-offset-2 hover:underline">the roadmap</a> for
            what's next, and why.
          </p>
        </header>
      </FadeIn>

      {months.map(([key, entries]) => (
        <FadeInOnView key={key}>
          <section className="mt-9">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">{monthLabel(key)}</h2>
            <div className="mt-3 space-y-3">
              {entries.map((e, i) => (
                <div key={`${e.date}-${e.version}-${i}`} className="flex gap-3 border-b border-ink-100 pb-3 last:border-0">
                  <div className="w-[62px] flex-none pt-0.5 font-mono text-[11px] tabular-nums text-ink-400">{e.date.slice(5)}</div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[11.5px] font-medium text-ink-800">v{e.version}</span>
                    {e.tag && (
                      <span className="ml-1.5 rounded-full border border-ink-200 bg-paper-tint px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-ink-500">{e.tag}</span>
                    )}
                    <p className="mt-0.5 text-[13.5px] leading-[1.5] text-ink-700">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeInOnView>
      ))}
    </main>
  );
}
