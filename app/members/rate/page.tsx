import type { Metadata } from "next";
import Link from "next/link";
import { RateFlow } from "@/components/members/RateFlow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rate members",
  description: "Rate fellow members on four quick dimensions.",
  robots: { index: false, follow: false },
};

export default function RateMembersPage() {
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:pt-12">
      <div className="mb-6">
        <Link
          href="/members"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-ink-950"
        >
          ← ness.city/members
        </Link>
        <h1 className="serif mt-2 text-[34px] leading-[1.05] text-ink-950 sm:text-[40px]">
          Rate the room.
        </h1>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-600">
          Four taps per person, about ten seconds each. Only answer where you
          actually have a read — &ldquo;haven&apos;t interacted enough&rdquo; is
          the honest default.
        </p>
      </div>
      <RateFlow />
    </main>
  );
}
