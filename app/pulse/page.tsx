import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import receptionRaw from "@/lib/stats/reception.json";
import discussionRaw from "@/lib/stats/discussion.json";

/**
 * /pulse, community analytics dashboard.
 *
 * Data and methodology by Ramesh Nair (hiddentao), originally
 * published at nspulse.xyz. Ported into ness.city under MIT with
 * attribution. The JSON datasets in lib/stats/ were produced by
 * exporting the relevant Discord channels, running them through
 * Claude with category-classifier prompts (scripts in nspulse), and
 * emitting fully-aggregated, anonymized statistics.
 *
 * No PII: every figure here is a category aggregate or a
 * Claude-synthesized idea/app summary. No member names, no quotes.
 */

type Reception = {
  generatedAt: string;
  totalMessages: number;
  totalIntros: number;
  firstDate: string;
  lastDate: string;
  skillCategories: Record<string, number>;
  interestCategories: Record<string, number>;
};

type Item = {
  name: string;
  description: string;
  url: string | null;
  score: number;
};

type Discussion = {
  generatedAt: string;
  totalMessages: number;
  firstDate: string;
  lastDate: string;
  ideas: Item[];
  apps: Item[];
};

const reception = receptionRaw as Reception;
const discussion = discussionRaw as Discussion;

export const metadata: Metadata = {
  title: "Pulse · Community analytics · Ness",
  description:
    "Network School community analytics: skills, interests, ideas, and apps. Pre-aggregated from public Discord channels. Data by hiddentao, ported into ness.city.",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CategoryBars({
  title,
  data,
  total,
}: {
  title: string;
  data: Record<string, number>;
  total: number;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;
  return (
    <div className="rounded-xl border border-ink-200 bg-paper">
      <div className="border-b border-ink-200 bg-paper-tint px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {title} · n={total.toLocaleString()}
      </div>
      <ul>
        {entries.map(([name, count], i) => {
          const pct = (count / max) * 100;
          const sharePct = (count / total) * 100;
          return (
            <li
              key={name}
              className={`grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 ${i > 0 ? "border-t border-ink-100" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[13.5px] text-ink-950">{name}</span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-500">
                    {sharePct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-ink-950"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="font-mono text-[12px] tabular-nums text-ink-700">
                {count.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ItemList({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: Item[];
}) {
  return (
    <section className="rounded-xl border border-ink-200 bg-paper">
      <div className="flex items-baseline justify-between border-b border-ink-200 bg-paper-tint px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {title} · top {items.length}
        </span>
        <span className="font-mono text-[10px] text-ink-400">{subtitle}</span>
      </div>
      <ol>
        {items.map((it, i) => (
          <li
            key={it.name}
            className={`grid grid-cols-[28px_1fr_auto] gap-3 px-4 py-3.5 sm:px-5 ${i > 0 ? "border-t border-ink-100" : ""}`}
          >
            <span className="font-mono text-[12px] tabular-nums text-ink-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[14px] font-medium text-ink-950">
                  {it.name}
                </span>
                {it.url && (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-ink-500 underline-offset-2 hover:text-ink-950 hover:underline"
                  >
                    ↗ link
                  </a>
                )}
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-ink-600">
                {it.description}
              </p>
            </div>
            <span className="self-start rounded-full border border-ink-200 bg-paper-tint px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink-700">
              {it.score}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function PulsePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
      <FadeIn>
        <header className="border-b border-ink-200 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Pulse · community analytics
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.02] text-ink-950 sm:text-[60px]">
            Who&apos;s here, what they think about.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.55] text-ink-700 sm:text-[16px]">
            Pre-aggregated stats from the Network School Discord. Member
            skills + interests from <code className="font-mono text-[13px]">#reception</code>{" "}
            intros, top ideas and apps from{" "}
            <code className="font-mono text-[13px]">#discussion</code>.
            Synthesized by Claude into anonymous category aggregates and
            named-idea summaries, no individual messages, no handles.
          </p>
        </header>
      </FadeIn>

      {/* Headline stats */}
      <FadeIn delay={0.05}>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Reception messages" value={reception.totalMessages.toLocaleString()} />
          <Stat label="Member intros" value={reception.totalIntros.toLocaleString()} />
          <Stat label="Discussion messages" value={discussion.totalMessages.toLocaleString()} />
          <Stat label="Ideas surfaced" value={String(discussion.ideas.length)} />
        </div>
        <p className="mt-3 font-mono text-[11px] text-ink-500">
          Range: {fmtDate(reception.firstDate)} → {fmtDate(reception.lastDate)} ·{" "}
          analysis generated {fmtDate(reception.generatedAt)}
        </p>
      </FadeIn>

      {/* Skills + Interests */}
      <FadeInOnView>
        <section className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Member composition
          </p>
          <h2 className="serif mt-2 text-[28px] leading-tight text-ink-950 sm:text-[36px]">
            What people bring. What they came for.
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <CategoryBars
              title="Skills"
              data={reception.skillCategories}
              total={reception.totalIntros}
            />
            <CategoryBars
              title="Interests"
              data={reception.interestCategories}
              total={reception.totalIntros}
            />
          </div>
        </section>
      </FadeInOnView>

      {/* Ideas + Apps */}
      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Discussion signal
          </p>
          <h2 className="serif mt-2 text-[28px] leading-tight text-ink-950 sm:text-[36px]">
            What the community is building.
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.55] text-ink-600">
            Top ideas and apps surfaced from the public discussion channel,
            scored by Claude on signal strength (engagement, specificity,
            traction cues).
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ItemList
              title="Ideas"
              subtitle={`${discussion.totalMessages.toLocaleString()} messages analyzed`}
              items={discussion.ideas}
            />
            <ItemList
              title="Apps"
              subtitle="member-built products"
              items={discussion.apps}
            />
          </div>
        </section>
      </FadeInOnView>

      {/* Methodology + Attribution */}
      <FadeInOnView>
        <section className="mt-14 rounded-xl border border-ink-200 bg-paper p-6">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Methodology + attribution
          </h3>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-700">
            This data and the original analysis are the work of{" "}
            <a
              href="https://hiddentao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-2 hover:underline"
            >
              Ramesh Nair (hiddentao)
            </a>
            , first published at{" "}
            <a
              href="https://nspulse.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-2 hover:underline"
            >
              nspulse.xyz
            </a>
            . The{" "}
            <a
              href="https://github.com/hiddentao/nspulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-2 hover:underline"
            >
              nspulse repo
            </a>{" "}
            is MIT-licensed; this page ports the dataset and methodology
            into ness.city with attribution.
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-700">
            Pipeline: Discord channels exported via{" "}
            <a
              href="https://github.com/Tyrrrz/DiscordChatExporter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-2 hover:underline"
            >
              DiscordChatExporter
            </a>
            , parsed and categorized by Claude using prompts from{" "}
            <code className="font-mono text-[12.5px]">scripts/parseReceptionCsv.ts</code>{" "}
            and <code className="font-mono text-[12.5px]">scripts/parseDiscussionCsv.ts</code>{" "}
            in the original repo. Output is fully aggregated, no
            individual messages, names, or handles ever land in the JSON.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/pagerank"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              See PageRank
              <span aria-hidden>→</span>
            </Link>
            <a
              href="https://github.com/adamtpang/ness.city/blob/main/docs/ns-api-discovery.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              ns.com API discovery doc
              <span aria-hidden>↗</span>
            </a>
          </div>
        </section>
      </FadeInOnView>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-paper px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
      <div className="serif mt-1 text-[28px] leading-none text-ink-950 sm:text-[32px]">
        {value}
      </div>
    </div>
  );
}
