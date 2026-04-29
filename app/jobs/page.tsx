import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function JobsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn>
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-paper-tint px-3 py-1 font-mono text-[11px] text-ink-700">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
          Planned
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <h1 className="serif mt-4 text-[52px] leading-[1.02] text-ink-950 sm:text-[64px]">
          Jobs.
          <br />
          <span className="italic">A board the thread should have been.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-5 text-[17px] leading-[1.7] text-ink-700">
          The hiring channel on Discord works, until you try to find anything in
          it. Roles get posted, scroll past, get re-posted by someone who
          didn&apos;t see the first one. The signal is there. The structure
          isn&apos;t.
        </p>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-12 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How it works
          </p>
          <ol className="mt-4 space-y-4 text-[15.5px] leading-[1.7] text-ink-800">
            <li>
              <span className="serif text-ink-400">01.</span> A nightly cron
              pulls new messages from the NS Discord hiring thread.
            </li>
            <li>
              <span className="serif text-ink-400">02.</span> An LLM extractor
              parses each message into structured fields: company, role, stack,
              location, comp band, contact.
            </li>
            <li>
              <span className="serif text-ink-400">03.</span> Duplicates merge.
              Stale roles fade. The freshest float to the top.
            </li>
            <li>
              <span className="serif text-ink-400">04.</span> Browse by tag.
              Apply via Discord DM, with a one-click handoff back into the
              original thread.
            </li>
          </ol>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            What needs to happen first
          </p>
          <ul className="mt-3 space-y-2 text-[14px] leading-[1.6] text-ink-700">
            <li>· Discord export access from NS admins</li>
            <li>· A public bot token + read scope on #hiring</li>
            <li>· A test extractor prompt (Anthropic or OpenAI) on a 30-message sample</li>
            <li>· Storage. Postgres ships with the rest of the platform backend.</li>
          </ul>
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
        </div>
      </FadeInOnView>
    </main>
  );
}
