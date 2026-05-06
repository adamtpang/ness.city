import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function MarketPage() {
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
          Market.
          <br />
          <span className="italic">A local economy that travels.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-5 text-[17px] leading-[1.7] text-ink-700">
          The third tool in Ness. Citizens list what they make, what they sell,
          what they need. Products. Services. Assets. A consolidation of
          nsmarket.app and redmart.xyz, two earlier prototypes,
          into one canonical surface.
        </p>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          <Card title="Products">
            Physical and digital goods made by citizens. From coffee beans to
            saunas to SaaS keys.
          </Card>
          <Card title="Services">
            Hire a citizen for a week. Design, dev, photography, ops, fitness,
            mentoring.
          </Card>
          <Card title="Assets">
            Sublease a desk, sell a bike, lend a guitar. The friction of
            moving every few months, smoothed.
          </Card>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Consolidation plan
          </p>
          <ul className="mt-3 space-y-3 text-[14.5px] leading-[1.7] text-ink-800">
            <li>
              <span className="font-mono text-ink-400">·</span>{" "}
              <a
                href="https://nsmarket.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-950 underline-offset-4 hover:underline"
              >
                nsmarket.app
              </a>
              . Migrate listings + sellers. Keep the URL alive as a redirect.
            </li>
            <li>
              <span className="font-mono text-ink-400">·</span>{" "}
              <a
                href="https://redmart.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-950 underline-offset-4 hover:underline"
              >
                redmart.xyz
              </a>
              . Pull the model and the lessons. Sunset the standalone domain.
            </li>
            <li>
              <span className="font-mono text-ink-400">·</span> Single seller
              identity, tied to community auth once approved.
            </li>
            <li>
              <span className="font-mono text-ink-400">·</span> USDC payouts
              wallet to wallet on Base. Escrow until delivery confirmed.
            </li>
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <h3 className="serif text-[20px] leading-tight text-ink-950">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">{children}</p>
    </div>
  );
}
