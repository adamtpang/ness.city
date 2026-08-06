import type { Metadata } from "next";
import { listGatherings } from "@/lib/gatherings";
import { NewGatheringModal } from "@/components/NewGatheringModal";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

const DESCRIPTION = "What's happening, posted by the community. Native to ness.city, so it keeps working wherever the community physically is.";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events · Ness",
  description: DESCRIPTION,
  alternates: { canonical: "/events" },
  openGraph: { title: "Events · Ness", description: DESCRIPTION, url: "https://ness.city/events", type: "website" },
};

function fmtWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export default async function EventsPage() {
  const events = await listGatherings("event");

  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <FadeIn>
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">Events</p>
            <h1 className="serif mt-2 text-[36px] leading-[1.05] text-ink-950">What&apos;s happening.</h1>
            <p className="mt-2 max-w-md text-[13.5px] leading-[1.55] text-ink-600">{DESCRIPTION}</p>
          </div>
          <NewGatheringModal
            kind="event"
            trigger={
              <button className="flex-none rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
                + Post
              </button>
            }
          />
        </header>
      </FadeIn>

      <FadeInOnView>
        {events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-12 text-center">
            <p className="serif text-[22px] leading-tight text-ink-950">Nothing posted yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-ink-500">Be the first. Anyone can post, anonymously if you want.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
            {events.map((e, i) => (
              <div key={e.id} className={`px-4 py-3.5 sm:px-5 ${i > 0 ? "border-t border-ink-100" : ""}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[15px] font-medium text-ink-950">{e.title}</p>
                  <span className="flex-none font-mono text-[11px] text-ink-400">{fmtWhen(e.startsAt)}</span>
                </div>
                {(e.place || e.body) && (
                  <p className="mt-1 text-[13px] leading-[1.5] text-ink-600">
                    {e.place && <span className="text-ink-500">{e.place}</span>}
                    {e.place && e.body && " · "}
                    {e.body}
                  </p>
                )}
                <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-400">@{e.hostHandle}</p>
              </div>
            ))}
          </div>
        )}
      </FadeInOnView>
    </main>
  );
}
