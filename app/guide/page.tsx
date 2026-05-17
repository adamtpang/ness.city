import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

/**
 * /guide — the SEO funnel.
 *
 * Independent-guide positioning (same defensible stance thensguide.com
 * uses). Ranks for "Network School" research intent, answers the real
 * questions honestly, routes to the invite link. Every CTA is "Loch in".
 *
 * Deliberately the one surface that names Network School + links the
 * referral. The rest of ness.city stays neutral per the platform brand.
 *
 * Hard, time-sensitive specifics (current price, exact cohort dates) are
 * intentionally NOT stated here. They age badly and a wrong number kills
 * funnel credibility. We link out to the official page for live details.
 */

const INVITE = "https://ns.com/adam/invite";

export const metadata: Metadata = {
  title: "Network School: The Independent Guide (2026) · Ness",
  description:
    "An honest, independent guide to Network School in Forest City, Malaysia. What it is, who it's for, what it costs, daily life, and how to apply. Loch in.",
  alternates: { canonical: "https://ness.city/guide" },
  keywords: [
    "Network School",
    "Network School review",
    "Network School cost",
    "how to join Network School",
    "Network School Forest City",
    "Network School Malaysia",
    "Balaji Network School",
    "is Network School worth it",
    "Network School application",
    "Network School daily life",
  ],
  openGraph: {
    title: "Network School: The Independent Guide",
    description:
      "What Network School actually is, who it's for, what it costs, and how to apply. An honest guide. Loch in.",
    url: "https://ness.city/guide",
    siteName: "Ness",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Network School: The Independent Guide",
    description:
      "Honest answers for anyone researching Network School. What it is, the cost, daily life, how to apply. Loch in.",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is Network School?",
    a: "Network School is a residential program founded by Balaji Srinivasan, built around the idea of a network state: people who meet online, then gather in person to build companies, get fit, and learn together. It runs as cohorts in Forest City, Johor, Malaysia, a short drive from Singapore.",
  },
  {
    q: "Where is Network School located?",
    a: "Forest City in Johor, Malaysia, near the Singapore border. It is a coastal development with apartments, a gym, coworking space, and event areas used by the program.",
  },
  {
    q: "Who is Network School for?",
    a: "Founders, engineers, writers, investors, and independent builders who do their best work around other ambitious people. It rewards people who show up, ship, and contribute to the community rather than passively consume it.",
  },
  {
    q: "How do you join Network School?",
    a: "Admission is application-based. You apply, get reviewed, and if accepted you pick a cohort and arrange travel and housing. Start your application from the official page.",
  },
  {
    q: "What does Network School cost?",
    a: "Pricing changes over time and by length of stay, so check the official page for the current numbers rather than trusting a figure you read in a guide. Budget separately for flights and day-to-day spending.",
  },
  {
    q: "Is Network School worth it?",
    a: "It depends on what you want. If you are isolated and your work would compound around high-output peers, the network is the product and it can pay for itself. If you mostly want a cheap place to work alone, it is the wrong tool.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function LochIn({
  size = "lg",
  label = "Loch in",
}: {
  size?: "lg" | "sm";
  label?: string;
}) {
  const cls =
    size === "lg"
      ? "px-6 py-3 text-[15px]"
      : "px-4 py-2 text-[13px]";
  return (
    <a
      href={INVITE}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-ink-950 font-medium text-paper transition-colors hover:bg-ink-800 ${cls}`}
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}

function Box({
  eyebrow,
  title,
  children,
  tint,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      className={`scroll-mt-28 rounded-2xl border border-ink-200 p-6 sm:p-8 ${
        tint ? "bg-paper-tint" : "bg-paper"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {eyebrow}
      </p>
      <h2 className="serif mt-2 text-[28px] leading-[1.1] text-ink-950 sm:text-[36px]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-[1.65] text-ink-700">
        {children}
      </div>
    </section>
  );
}

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> ness.city
        </Link>
      </FadeIn>

      {/* Hero */}
      <FadeIn delay={0.04}>
        <header className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            The independent guide to Network School
          </p>
          <h1 className="serif mt-3 text-[46px] leading-[1.0] text-ink-950 sm:text-[78px] sm:leading-[0.96]">
            Thinking about
            <br />
            Network School?
            <br />
            <span className="italic">Loch in.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.6] text-ink-700 sm:text-[18px]">
            An honest walkthrough of what Network School actually is, who it
            is for, what it costs, what a day looks like, and how to apply.
            Written by a member, not the marketing team.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LochIn />
            <a
              href="#guide"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              Read the guide first
            </a>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-400">
            Loch in opens the official application via a member invite link.
          </p>
        </header>
      </FadeIn>

      {/* Quick-answer bento */}
      <FadeInOnView>
        <div id="guide" className="mt-14 grid gap-3 scroll-mt-28 sm:grid-cols-2 lg:grid-cols-4">
          <QuickCard k="What" v="A residential network-state program: meet online, build in person." />
          <QuickCard k="Where" v="Forest City, Johor, Malaysia. A short drive from Singapore." />
          <QuickCard k="Who" v="Founders, engineers, writers, investors. People who ship." />
          <QuickCard k="How" v="Apply, get reviewed, pick a cohort, show up." />
        </div>
      </FadeInOnView>

      {/* Sections */}
      <div className="mt-12 space-y-4">
        <FadeInOnView>
          <Box eyebrow="Start here" title="What Network School actually is">
            <p>
              Network School is a residential program founded by Balaji
              Srinivasan. The premise is simple: communities now form online
              first, then gain real power when they gather in person. So it
              takes people who already share a worldview on technology,
              startups, health, and the network state, and puts them under
              one roof for a focused stretch of time.
            </p>
            <p>
              In practice it is part startup colony, part gym, part school.
              People work on companies, train hard, attend talks, and build
              the kind of dense relationships that are hard to manufacture
              over a screen.
            </p>
          </Box>
        </FadeInOnView>

        <FadeInOnView>
          <Box eyebrow="Fit" title="Who it is for, and who it is not" tint>
            <p>
              It is for people whose output compounds around other ambitious
              people: founders mid-build, engineers who want sharper peers,
              writers and investors who think in public. The common trait is
              not a job title. It is that you show up and contribute.
            </p>
            <p>
              It is not for someone looking only for a cheap place to work
              alone, or a vacation with good wifi. The network is the
              product. If you are not going to plug into it, you are paying
              for something you will not use.
            </p>
          </Box>
        </FadeInOnView>

        <FadeInOnView>
          <Box eyebrow="Money" title="What it costs">
            <p>
              Pricing changes with time and length of stay, so any specific
              number in a guide is stale the moment it is written. Check the
              current figure on the official page rather than trusting a
              screenshot.
            </p>
            <p>
              Budget separately for flights and daily spending. The honest
              way to think about cost: if a month around the right hundred
              people changes what you build, the program is cheap. If it
              does not, no price is low enough.
            </p>
            <div className="pt-1">
              <LochIn size="sm" label="See current pricing" />
            </div>
          </Box>
        </FadeInOnView>

        <FadeInOnView>
          <Box eyebrow="Daily life" title="A day, roughly" tint>
            <p>
              Mornings skew toward training and deep work. Afternoons are
              build time and meetings. Evenings are talks, dinners, and the
              unscheduled conversations that end up mattering most. The
              schedule is a scaffold; the value is in who you sit next to.
            </p>
            <p>
              Forest City itself is quiet and contained, which is the point.
              Fewer distractions, a short walk between your apartment, the
              gym, and the coworking space, and a peer group you keep running
              into on purpose.
            </p>
          </Box>
        </FadeInOnView>

        <FadeInOnView>
          <Box eyebrow="How to join" title="Applying, step by step">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Open the application from the official page.</li>
              <li>Write the application like you mean it. Specific beats polished.</li>
              <li>Get reviewed. Admission is selective, not automatic.</li>
              <li>If accepted, pick a cohort and lock travel and housing early.</li>
              <li>Show up ready to contribute, not just attend.</li>
            </ol>
            <div className="pt-2">
              <LochIn label="Start the application" />
            </div>
          </Box>
        </FadeInOnView>

        <FadeInOnView>
          <Box eyebrow="No spin" title="The honest take" tint>
            <p>
              What is genuinely good: the people. The filtering works, the
              density is real, and the in-person compounding is hard to get
              anywhere else right now.
            </p>
            <p>
              What to go in clear-eyed about: it is remote, it is selective,
              and you get out what you put in. People who treat it like a
              coworking space leave underwhelmed. People who treat it like a
              network leave with companies, collaborators, and friends.
            </p>
            <p>
              That is the whole pitch. No countdown timer, no urgency
              theatre. If it fits, loch in. If it does not, do not.
            </p>
          </Box>
        </FadeInOnView>
      </div>

      {/* FAQ */}
      <FadeInOnView>
        <section className="mt-16 scroll-mt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            FAQ
          </p>
          <h2 className="serif mt-2 text-[32px] leading-tight text-ink-950 sm:text-[40px]">
            Straight answers.
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200">
            {FAQ.map((f, i) => (
              <details
                key={f.q}
                className={`group bg-paper px-5 py-4 ${
                  i > 0 ? "border-t border-ink-100" : ""
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink-950">
                  {f.q}
                  <span
                    aria-hidden
                    className="font-mono text-ink-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-[1.65] text-ink-600">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </FadeInOnView>

      {/* Final CTA */}
      <FadeInOnView>
        <section className="mt-16 rounded-2xl border border-ink-950 bg-ink-950 p-8 text-paper sm:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-300">
            Decision time
          </p>
          <h2 className="serif mt-3 text-[36px] leading-[1.05] sm:text-[52px]">
            You have done the research.
            <br />
            <span className="italic">Loch in.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-ink-200">
            The application takes one focused sitting. The worst case is you
            learn it is not for you. The best case is the next chapter starts
            in Forest City.
          </p>
          <div className="mt-7">
            <a
              href={INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-[15px] font-medium text-ink-950 transition-opacity hover:opacity-90"
            >
              Loch in
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </FadeInOnView>

      {/* Disclosure */}
      <FadeInOnView>
        <p className="mt-10 text-[12px] leading-[1.7] text-ink-500">
          Independent guide, not affiliated with or endorsed by Network
          School. The Loch in links use a member invite (
          <span className="font-mono">ns.com/adam/invite</span>). It costs you
          nothing and the guide stays honest either way: the goal is that you
          make the right call for you, not that you click.
        </p>
      </FadeInOnView>
    </main>
  );
}

function QuickCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {k}
      </p>
      <p className="mt-2 text-[14px] leading-[1.5] text-ink-800">{v}</p>
    </div>
  );
}
