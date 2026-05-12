import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * /os temporarily on hold for the pre-public review. The full
 * GitHub-style issue tracker page is preserved in git history. Restore
 * by reverting this file to v0.15 and rewriting copy to avoid pointing
 * at any specific external site.
 */

export const metadata = {
  title: "Coming soon",
};

export default function OsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-16 sm:pt-24">
      <FadeIn>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-amber-900">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Coming soon
          </span>
          <h1 className="serif mt-5 text-[44px] leading-[1.05] text-ink-950 sm:text-[60px]">
            Open-source mirror.
          </h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-[1.6] text-ink-600">
            A GitHub-style view of community issues and pull requests.
            Surface a bug. Open a PR. Ship the fix on Townhall. Live
            soon. File the kind of feedback that belongs here on
            Townhall in the meantime.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/solve"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Open Townhall
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Back to the city
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
