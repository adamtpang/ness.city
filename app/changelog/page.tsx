import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { STORY } from "@/lib/story";

const DESCRIPTION = "The story so far, for the community, not the engineers. What changed, and why. Live numbers at nskpi.com.";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Changelog · Ness",
  description: DESCRIPTION,
  alternates: { canonical: "/changelog" },
  openGraph: { title: "Changelog · Ness", description: DESCRIPTION, url: "https://ness.city/changelog", type: "website" },
};

type Pulse = { roster: number; problems: number; market: number };

async function getPulse(): Promise<Pulse> {
  if (!isDbConfigured) return { roster: 0, problems: 0, market: 0 };
  const db = getDb();
  const [row] = (await db.execute(sql`
    select
      (select count(*)::int from directory_profiles) as roster,
      (select count(*)::int from problems) as problems,
      (select count(*)::int from market_listings) as market
  `)) as unknown as Array<Pulse>;
  return row ?? { roster: 0, problems: 0, market: 0 };
}

export default async function ChangelogPage() {
  const pulse = await getPulse();

  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <FadeIn>
        <header className="border-b border-ink-200 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">Changelog</p>
          <h1 className="serif mt-2 text-[36px] leading-[1.05] text-ink-950">The story so far.</h1>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-700">
            Only the changes that actually mattered to the community, not
            every commit. This tells the story; <a href="https://nskpi.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">nskpi.com</a> tells
            the score, live.
          </p>
        </header>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-6 grid grid-cols-3 divide-x divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          <div className="px-4 py-4 text-center">
            <p className="serif text-[26px] leading-none text-ink-950">{pulse.roster.toLocaleString()}</p>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500">People in the roster</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="serif text-[26px] leading-none text-ink-950">{pulse.problems.toLocaleString()}</p>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500">Problems surfaced</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="serif text-[26px] leading-none text-ink-950">{pulse.market.toLocaleString()}</p>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-500">Market listings</p>
          </div>
        </div>
        <p className="mt-2 text-center text-[11.5px] text-ink-400">
          Right now. The full live picture, always current, lives at{" "}
          <a href="https://nskpi.com" target="_blank" rel="noopener noreferrer" className="text-ink-700 underline-offset-2 hover:underline">nskpi.com</a>.
        </p>
      </FadeInOnView>

      <div className="mt-10 space-y-7">
        {STORY.map((s, i) => (
          <FadeInOnView key={i}>
            <div className="flex gap-4">
              <div className="w-[92px] flex-none pt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-400">{s.when}</div>
              <div className="min-w-0 flex-1 border-l border-ink-200 pl-4">
                <p className="text-[15px] font-medium text-ink-950">{s.title}</p>
                <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-700">{s.body}</p>
              </div>
            </div>
          </FadeInOnView>
        ))}
      </div>

      <FadeInOnView>
        <p className="mt-10 border-t border-ink-200 pt-5 text-[12.5px] leading-[1.6] text-ink-500">
          Curated, not exhaustive. Every real commit, including the small
          fixes this page leaves out, is public on{" "}
          <a href="https://github.com/adamtpang/ness.city/commits/main" target="_blank" rel="noopener noreferrer" className="text-ink-950 underline-offset-2 hover:underline">GitHub</a>.
          See <a href="/roadmap" className="text-ink-950 underline-offset-2 hover:underline">the roadmap</a> for what's next, and why.
        </p>
      </FadeInOnView>
    </main>
  );
}
