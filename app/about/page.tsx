import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          The Ness manifesto
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <h1 className="serif mt-3 text-[52px] leading-[1.02] text-ink-950 sm:text-[64px]">
          A city that
          <br />
          <span className="italic">fixes itself.</span>
        </h1>
      </FadeIn>

      <div className="mt-12 space-y-10">
        <FadeInOnView>
          <Block>
            Network School has a core team. Call them the government. They keep
            the lights on, the visas working, the roof intact. They are good at
            their jobs. They are also outnumbered.
          </Block>
        </FadeInOnView>

        <FadeInOnView>
          <Block>
            A real city — one with a thousand small frictions every day —
            doesn&apos;t survive top-down. It survives because citizens notice
            things, name them, and quietly fix them. Ness is the layer where
            that noticing happens.
          </Block>
        </FadeInOnView>

        <FadeInOnView>
          <H2>Three loops</H2>
        </FadeInOnView>

        <FadeInOnView>
          <Loop
            n="01"
            title="Surface"
            body="Anyone can surface a problem. The good ones are diagnoses, not complaints — what's happening, who's affected, and a real guess at why. Posting with a real diagnosis earns 5 credit. Posting 'the wifi sucks' does not."
          />
        </FadeInOnView>

        <FadeInOnView>
          <Loop
            n="02"
            title="Solve"
            body="A citizen takes the problem and ships a fix. They write what they did, what it cost, and what changed. The documentation is the deliverable — not the act."
          />
        </FadeInOnView>

        <FadeInOnView>
          <Loop
            n="03"
            title="Remember"
            body="Every documented solution becomes part of the city's memory. Future citizens find it before they re-solve it. The next person doesn't start from zero."
          />
        </FadeInOnView>

        <FadeInOnView>
          <H2>Credit, not karma</H2>
        </FadeInOnView>

        <FadeInOnView>
          <Block>
            Credit on Ness is permanent and visible. It compounds. It&apos;s how
            you become a known builder of the place. The leaderboard isn&apos;t
            a game — it&apos;s the city&apos;s memory of who showed up.
          </Block>
        </FadeInOnView>

        <FadeInOnView>
          <Block>
            The core team can grant bonus credit when something deserves it.
            They can&apos;t take credit away. The record stands.
          </Block>
        </FadeInOnView>

        <FadeInOnView>
          <H2>What this is not</H2>
        </FadeInOnView>

        <FadeInOnView>
          <Block>
            Not a ticketing system. Tickets disappear when closed; problems on
            Ness leave a trail. Not a forum. Forums optimize for argument; Ness
            optimizes for shipped fixes. Not a Slack replacement. Slack is fine
            for the hour. Ness is for the year.
          </Block>
        </FadeInOnView>

        <FadeInOnView>
          <div className="mt-10 flex flex-wrap gap-3 border-t border-ink-200 pt-10">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Surface a problem
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              See the feed
            </Link>
          </div>
        </FadeInOnView>
      </div>
    </main>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[18px] leading-[1.7] text-ink-800">{children}</p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="serif text-[28px] leading-tight text-ink-950">
      {children}
    </h2>
  );
}

function Loop({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] tracking-[0.1em] text-ink-500">{n}</span>
        <h3 className="serif text-[22px] text-ink-950">{title}</h3>
      </div>
      <p className="mt-3 text-[16px] leading-[1.7] text-ink-700">{body}</p>
    </div>
  );
}
