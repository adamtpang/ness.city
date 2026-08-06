import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { NESS_MANIFEST, CIVIC_VERSION } from "@/lib/civic/protocol";

const DESCRIPTION =
  "An open contract for startup societies to interoperate, so a network can outlive any one venue, licence, or founder.";

export const metadata: Metadata = {
  title: "The Civic Protocol · Ness",
  description: DESCRIPTION,
  alternates: { canonical: "/civic" },
  openGraph: { title: "The Civic Protocol", description: DESCRIPTION, url: "https://ness.city/civic", type: "website" },
};

const RULES = [
  { n: 1, t: "Nodes own their data.", d: "The protocol owns only the contract. No central server, no registry anyone must join, no one who can revoke you." },
  { n: 2, t: "Read-only and public by default.", d: "Anything private stays behind the node's own gate and never appears on the federated surface." },
  { n: 3, t: "Consent over completeness.", d: "Publish people who opted in, never your full directory. This is the rule people are tempted to break." },
  { n: 4, t: "Exit is a feature.", d: "Members can export their own data in full, at any time. If they can't leave, they're inventory, not members." },
];

const ENDPOINTS = [
  { path: "/api/civic/node", d: "Aggregate vital signs. Counts only, never a list." },
  { path: "/api/civic/people", d: "Only members who opted in. Never a directory." },
  { path: "/api/civic/problems", d: "Open civic problems. Public by design." },
  { path: "/api/civic/events", d: "Contract fixed now; live once a node implements it." },
];

export default function CivicProtocolPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <FadeIn>
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Civic Protocol · v{CIVIC_VERSION} · {NESS_MANIFEST.node.license}</p>
          <h1 className="serif mt-2 text-[32px] leading-tight text-ink-950">A network shouldn&apos;t die with its venue.</h1>
          <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">{DESCRIPTION}</p>
        </header>
      </FadeIn>

      <FadeInOnView>
        <section className="rounded-2xl border border-ink-200 bg-paper p-6">
          <h2 className="serif text-[20px] leading-tight text-ink-950">Why</h2>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-700">
            Every startup society is built as a product: a closed app, its own
            login, its own database. When a node dies — a licence pulled, a
            lease lost, a founder leaving — its people can carry nothing with
            them. Not identity, not reputation, not even an address book.
            The community simply scatters.
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-700">
            A protocol fixes the class of problem no single node can fix for
            itself.
          </p>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-8">
          <h2 className="serif text-[20px] leading-tight text-ink-950">Discovery</h2>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-700">Any node serves a manifest, no prior arrangement needed:</p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-ink-200 bg-ink-950 p-4 font-mono text-[12px] leading-[1.6] text-ink-100">
{`curl https://ness.city/.well-known/civic.json`}
          </pre>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-8">
          <h2 className="serif text-[20px] leading-tight text-ink-950">Four rules</h2>
          <div className="mt-3 space-y-3">
            {RULES.map((r) => (
              <div key={r.n} className="rounded-xl border border-ink-200 bg-paper p-4">
                <p className="text-[13.5px] leading-[1.55]"><span className="font-mono text-[11px] text-ink-500">{r.n}.</span> <span className="font-medium text-ink-950">{r.t}</span> <span className="text-ink-600">{r.d}</span></p>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-8">
          <h2 className="serif text-[20px] leading-tight text-ink-950">Endpoints</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-ink-200">
            {ENDPOINTS.map((e) => (
              <div key={e.path} className="flex items-center gap-3 border-b border-ink-100 bg-paper px-4 py-3 last:border-0">
                <code className="flex-none font-mono text-[12.5px] text-ink-950">{e.path}</code>
                <span className="text-[12.5px] text-ink-600">{e.d}</span>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      <FadeInOnView>
        <section className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-paper p-6">
          <p className="text-[13.5px] leading-[1.6] text-ink-700">
            The full spec, with response shapes and an implementation guide, lives
            in the repo: <a href="https://github.com/adamtpang/ness.city/blob/main/docs/CIVIC-PROTOCOL.md" target="_blank" rel="noreferrer" className="underline">docs/CIVIC-PROTOCOL.md</a>.
            MIT licensed. Implement it, fork it, ignore the parts you dislike.
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-700">
            See it in use: <Link href="/kpi" className="underline">nskpi.com</Link> is a
            registry, a client that polls node manifests and renders honest numbers.
            It holds no authority over any node and can be replaced.
          </p>
        </section>
      </FadeInOnView>
    </main>
  );
}
