import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Feedback
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[52px]">
          Tell us what&apos;s missing.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          The widget on every page (bottom right) takes a 1-5 rating and a
          comment if you&apos;re below a 5. Submissions land directly in
          Adam&apos;s lap and get triaged weekly. Public feedback also lives
          on GitHub once the integration is wired up.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Card
            title="What we want most"
            items={[
              "Confusion about how the platform works",
              "Bugs or broken UX",
              "Copy that feels off",
              "Features you'd pay for",
            ]}
          />
          <Card
            title="What's less useful"
            items={[
              "Generic 'love it / hate it' (give a why)",
              "Asks for features we already plan (check /about)",
              "PR-style suggestions (open an actual PR)",
              "Spam / abuse",
            ]}
          />
        </div>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Where it goes
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            v0.7 routes the widget to a Discord webhook (Adam&apos;s private
            triage channel). Each rating is logged to Vercel server logs in
            the meantime. v0.8 will also write the feedback to a public
            GitHub issue so the community can see what&apos;s been raised.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to Ness
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://github.com/adamtpang/ness/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            See public issues
            <span aria-hidden>↗</span>
          </a>
        </div>
      </FadeInOnView>
    </main>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper-tint p-5">
      <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
      <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.6] text-ink-700">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="text-ink-400">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
