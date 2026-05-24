import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

const REPO = "https://github.com/adamtpang/ness.city";
const DISCORD = "https://discord.gg/fNmdFWcMU";

/**
 * Feedback lives on GitHub Issues, Discord for chat. No internal inbox,
 * no rating widget, no shadow queue. Public by default.
 */
export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Feedback
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[52px]">
          Public by default.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          Feedback lives on GitHub Issues. Chat lives on Discord. No private
          inbox, no triage shadow queue. If it&apos;s worth saying, it&apos;s
          worth saying where everyone can see it.
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href={`${REPO}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-ink-200 bg-paper p-6 transition-colors hover:border-ink-950"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Bugs · feature requests · proposals
            </p>
            <h2 className="serif mt-2 text-[24px] leading-tight text-ink-950">
              File a GitHub issue
              <span aria-hidden className="ml-1.5 text-ink-400">↗</span>
            </h2>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
              Anything actionable. Tracked, attributed, permanent.
            </p>
          </a>

          <a
            href={DISCORD}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-ink-200 bg-paper-tint p-6 transition-colors hover:border-ink-950"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Chat · questions · vibes
            </p>
            <h2 className="serif mt-2 text-[24px] leading-tight text-ink-950">
              Join the Discord
              <span aria-hidden className="ml-1.5 text-ink-400">↗</span>
            </h2>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-600">
              #support for help, #bug-reports for what&apos;s broken,
              #feature-requests for what should exist.
            </p>
          </a>
        </div>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How to file a good issue
          </p>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.6] text-ink-700">
            <li><span className="text-ink-400">·</span> One issue per problem. Smaller is better.</li>
            <li><span className="text-ink-400">·</span> Steps to reproduce if it&apos;s a bug. Screenshots help.</li>
            <li><span className="text-ink-400">·</span> The page URL goes in the title (the Feedback button does this automatically).</li>
            <li><span className="text-ink-400">·</span> PRs welcome. The repo is MIT.</li>
          </ul>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={`${REPO}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Open the issues page
            <span aria-hidden>↗</span>
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Back to Ness
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}
