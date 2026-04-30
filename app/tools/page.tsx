import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

type Util = {
  name: string;
  blurb: string;
  state: "live" | "in-design" | "planned";
  href?: string;
};

const utilities: Util[] = [
  {
    name: "NS points calculator",
    blurb:
      "Drop your activity (events attended, bounties shipped, days on campus) and get an estimated points score with a breakdown of how it was scored.",
    state: "in-design",
    href: "/tools",
  },
  {
    name: "Visa-run planner",
    blurb:
      "A living checklist for the JB run. Documents, deadlines, transport options, what to do if you miss the bus. Compounds across cohorts.",
    state: "planned",
  },
  {
    name: "Bounty USD-to-karma converter",
    blurb:
      "Type a USD amount, get the equivalent karma reward at current platform rates. Useful for sizing a bounty before posting.",
    state: "planned",
  },
  {
    name: "USDC bounty calculator",
    blurb:
      "Estimate gas + bridging costs for a USDC pledge from any chain. Shows the net amount a solver would actually receive.",
    state: "planned",
  },
  {
    name: "Cohort GDP estimator",
    blurb:
      "Enter your cohort's known revenue, fundraising, and bounty payouts. Get a rough Network State GDP figure with comps to other communities.",
    state: "planned",
  },
  {
    name: "Diagnose vs complain checker",
    blurb:
      "Paste a problem statement. We score it 0-10 on whether it's a real diagnosis or just a complaint. +5 karma triggers when you hit 7+.",
    state: "planned",
  },
];

const stateStyles: Record<Util["state"], { dot: string; label: string }> = {
  live: { dot: "bg-emerald-600", label: "Live" },
  "in-design": { dot: "bg-amber-500", label: "In design" },
  planned: { dot: "bg-ink-400", label: "Planned" },
};

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-12">
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Free tools
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
          The utility belt.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          Small, opinionated calculators and explainers. No login, no paywall,
          no email gate. Free tooling builds trust. Trust builds networks.
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-10 space-y-3">
          {utilities.map((u) => {
            const s = stateStyles[u.state];
            const Inner = (
              <div className="grid gap-4 rounded-2xl border border-ink-200 bg-paper p-5 transition-colors hover:border-ink-400 sm:grid-cols-[1fr_120px]">
                <div>
                  <h3 className="serif text-[20px] leading-tight text-ink-950">
                    {u.name}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-600">
                    {u.blurb}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 text-[12px] text-ink-700">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </div>
              </div>
            );
            return u.href ? (
              <Link key={u.name} href={u.href} className="block">
                {Inner}
              </Link>
            ) : (
              <div key={u.name}>{Inner}</div>
            );
          })}
        </div>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Suggest a tool
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            See a calculator the city would use? File it on Townhall as a
            problem with a real diagnosis. If it gets bounty-funded, we
            ship it as a free tool here.
          </p>
          <Link
            href="/solve/new"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Surface a tool
            <span aria-hidden>→</span>
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}
