import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { CHANGELOG } from "@/lib/changelog";

/**
 * /roadmap. Where ness.city came from, where it is, and where it's going,
 * and why. Public, living document.
 *
 * Replaces the v0.29 "What NS should fix" table (Eisenhower-prioritized
 * criticism of Network School's internal operations, naming individual NS
 * core team members as owners). That page named real people against
 * estimated numbers with no sourcing, and sat oddly next to ness.city's own
 * "independent, not affiliated" positioning. Retired 2026-08, at Adam's
 * explicit call, rather than left live or silently edited.
 */

const DESCRIPTION =
  "Where ness.city came from, where it is, and where it's going, and why. Public and living.";

export const metadata: Metadata = {
  title: "Roadmap · Ness",
  description: DESCRIPTION,
  alternates: { canonical: "/roadmap" },
  openGraph: { title: "Roadmap · Ness", description: DESCRIPTION, url: "https://ness.city/roadmap", type: "website" },
};

const WHY: { title: string; body: string }[] = [
  {
    title: "No single point of failure",
    body: "A network built on one campus, one lease, or one operator's goodwill can be ended by a single decision it doesn't control. ness.city's data is exportable, its identity layer is portable, and no host organisation can revoke it.",
  },
  {
    title: "Consent over completeness",
    body: "A roster of thousands is a liability the moment it's public. The directory is gated behind real participation (rate a few members to browse), and only people who take a deliberate public action, like saying where they're heading next, ever show up outside the gate.",
  },
  {
    title: "Interoperability, not another silo",
    body: "Every startup society rebuilds identity, events, and coordination behind its own login. The Civic Protocol is an open, MIT-licensed contract so any node can publish its own numbers and any member can carry their identity somewhere else.",
  },
  {
    title: "Real numbers over vibes",
    body: "A KPI that isn't wired to real data gets labeled 'needs data,' not dressed up as a stat. This applies to nskpi.com's dashboard and to this page: nothing here is aspirational copy pretending to be a status update.",
  },
];

const SHIPPED_HIGHLIGHTS = [
  ["Member rating index", "A ranked social index of the community, revealed progressively as you rate. Anonymous by default, no login required."],
  ["Roster privacy gate", "The directory isn't public. Rate a few members and it opens. The gate is enforced server-side, not just hidden in the UI."],
  ["Where next", "The continuity map. When a campus changes, this is how the community finds each other in the next place."],
  ["The Civic Protocol", "An open, MIT-licensed contract for startup societies to interoperate. Reference implementation is this site."],
  ["nskpi.com", "The registry: real vital signs polled live from every node that implements the protocol, not a static list of who exists."],
];

const NEXT_UP = [
  ["Events + food, natively", "A community's day-to-day needs a home that isn't tied to any one campus's own site. Native, portable, works wherever the community physically is."],
  ["Portable identity (Civic Protocol v0.2)", "One person, one ID across nodes, so leaving a node doesn't mean losing who you are on the network."],
  ["Portable reputation (v0.3)", "Ratings and rings that travel with the person instead of living in one node's database."],
  ["AI topic-tagging + Nessie agent", "Every problem auto-tagged on submit; an always-on agent that triages and drafts explanations."],
  ["Forkable civic OS", "Any startup society clones ness.city to coordinate its own community, and shares numbers back through the protocol."],
];

export default function RoadmapPage() {
  const latest = CHANGELOG[0];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
      <FadeIn>
        <header className="border-b border-ink-200 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">Roadmap · public · living document</p>
          <h1 className="serif mt-2 text-[40px] leading-[1.05] text-ink-950 sm:text-[52px]">
            Where we&apos;re coming from, where we&apos;re going.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.55] text-ink-700">{DESCRIPTION}</p>
          <p className="mt-3 font-mono text-[11px] text-ink-500">
            currently v{latest.version} · full history at <Link href="/changelog" className="underline-offset-2 hover:underline">/changelog</Link>
          </p>
        </header>
      </FadeIn>

      <FadeInOnView>
        <section className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">Where we started</p>
          <h2 className="serif mt-2 text-[22px] leading-tight text-ink-950">Building on the Network State thesis.</h2>
          <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">
            The Network State thesis argues that a community can start online,
            around a shared purpose, and grow into something with real
            physical presence and, eventually, recognition. ness.city is built
            on that premise, but as the civic layer, not the campus: the
            coordination tools a community like that actually needs day to
            day, and none of the parts that tie a network to one place, one
            lease, or one person&apos;s decisions.
          </p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">Where we are</p>
          <h2 className="serif mt-2 text-[22px] leading-tight text-ink-950">A network just proved the thesis needs this.</h2>
          <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">
            In mid-2026, Network School&apos;s Malaysia campus was ordered to
            cease operations over a licensing issue. A new campus in
            Kazakhstan followed within a day, a real upgrade in several ways.
            But the recovery ran through one founder&apos;s own backup, not
            through anything the community owned. Members carried nothing of
            their own between the two: not a roster, not their event history,
            not their reputation.
          </p>
          <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">
            That is exactly the gap ness.city exists to close, and it&apos;s why
            the last few weeks of work went where they went.
          </p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">Why we build what we build</p>
          <div className="mt-3 space-y-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-xl border border-ink-200 bg-paper p-4">
                <p className="text-[14px] font-medium text-ink-950">{w.title}</p>
                <p className="mt-1 text-[13px] leading-[1.55] text-ink-600">{w.body}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-garden-700">Recently shipped</h2>
            <Link href="/changelog" className="font-mono text-[10px] text-ink-400 hover:text-ink-950">full changelog →</Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-ink-200 bg-paper">
            {SHIPPED_HIGHLIGHTS.map(([t, d], i) => (
              <div key={t} className={`px-4 py-3.5 sm:px-5 ${i > 0 ? "border-t border-ink-100" : ""}`}>
                <p className="text-[14px] font-medium text-ink-950">{t}</p>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-ink-600">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">Next in the pipeline</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-ink-200 bg-paper">
            {NEXT_UP.map(([t, d], i) => (
              <div key={t} className={`px-4 py-3.5 sm:px-5 ${i > 0 ? "border-t border-ink-100" : ""}`}>
                <p className="text-[14px] font-medium text-ink-950">{t}</p>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-ink-600">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-[1.55] text-ink-500">
            Open-source and bottom-up.{" "}
            <a href="https://discord.gg/fNmdFWcMU" target="_blank" rel="noopener noreferrer" className="text-ink-950 underline-offset-2 hover:underline">Join the Discord</a>{" "}
            or{" "}
            <a href="https://github.com/adamtpang/ness.city" target="_blank" rel="noopener noreferrer" className="text-ink-950 underline-offset-2 hover:underline">contribute on GitHub</a>{" "}
            to help build any of these, or read{" "}
            <Link href="/civic" className="text-ink-950 underline-offset-2 hover:underline">the protocol spec</Link>{" "}
            to add your own node.
          </p>
        </section>
      </FadeInOnView>
    </main>
  );
}
