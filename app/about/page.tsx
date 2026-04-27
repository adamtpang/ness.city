import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div>
        <p className="text-[12px] font-mono uppercase tracking-wider text-ember-400">
          The Ness manifesto
        </p>
        <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-ink-50">
          A city that fixes itself.
        </h1>
      </div>

      <div className="prose prose-invert mt-10 max-w-none">
        <Block>
          Network School has a core team. Call them the government. They keep the
          lights on, the visas working, the roof intact. They are good at their
          jobs. They are also outnumbered.
        </Block>

        <Block>
          A real city — one with a thousand small frustrations every day —
          doesn&apos;t survive top-down. It survives because citizens notice
          things, name them, and quietly fix them. Ness is the layer where that
          noticing happens.
        </Block>

        <H2>Three loops</H2>

        <Loop
          n="01"
          title="Surface"
          body="Anyone can surface a problem. The good ones are diagnoses, not complaints — what's happening, who's affected, and a real guess at why. Posting a problem with a real diagnosis earns 5 credit. Posting 'the wifi sucks' does not."
        />

        <Loop
          n="02"
          title="Solve"
          body="A citizen takes the problem and ships a fix. They write what they did, what it cost, and what changed. The documentation is the deliverable — not the act."
        />

        <Loop
          n="03"
          title="Remember"
          body="Every documented solution becomes part of the city's memory. Future citizens find it before they re-solve it. The next person doesn't start from zero."
        />

        <H2>Credit, not karma</H2>

        <Block>
          Credit on Ness is permanent and visible. It compounds. It&apos;s how
          you become a known builder of the place. The leaderboard isn&apos;t a
          game — it&apos;s the city&apos;s memory of who showed up.
        </Block>

        <Block>
          The core team can grant bonus credit when something deserves it. They
          can&apos;t take credit away. The record stands.
        </Block>

        <H2>What this is not</H2>

        <Block>
          Not a ticketing system. Tickets disappear when closed; problems on
          Ness leave a trail. Not a forum. Forums optimize for argument; Ness
          optimizes for shipped fixes. Not a Slack replacement. Slack is fine
          for the hour. Ness is for the year.
        </Block>

        <div className="mt-12 flex items-center gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-md bg-ember-500 px-4 py-2 text-[13px] font-medium text-ink-950 hover:bg-ember-400 transition-colors"
          >
            Surface a problem
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-ink-700 px-4 py-2 text-[13px] font-medium text-ink-200 hover:bg-ink-800 transition-colors"
          >
            See the feed
          </Link>
        </div>
      </div>
    </main>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 text-[16px] leading-[1.7] text-ink-200">{children}</p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 text-[20px] font-semibold tracking-tight text-ink-50">
      {children}
    </h2>
  );
}

function Loop({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="mt-5 rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] text-ember-400">{n}</span>
        <h3 className="text-[16px] font-semibold text-ink-50">{title}</h3>
      </div>
      <p className="mt-2 text-[15px] leading-[1.7] text-ink-300">{body}</p>
    </div>
  );
}
