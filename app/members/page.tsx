import type { Metadata } from "next";
import { getCounters, getLeaderboardRanked } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";
import { MEMBER_CONFIG } from "@/lib/members/config";
import { MembersApp } from "@/components/members/MembersApp";

/**
 * ness.city/members — the member rating app. Two tabs: Rate (a −2…+2
 * swipe-and-tap deck) and Rankings (the social index, revealed progressively
 * as you rate). Server-renders the counters + a small teaser for a fast,
 * shareable first paint; the client app personalizes from there.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members",
  description: "Rate the room. A ranked social index of Network School members.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ness.city",
    description: "Rate the room. A ranked social index of Network School members.",
    url: "https://ness.city",
    type: "website",
  },
};

export default async function MembersPage() {
  const settings = await getMemberSettings();

  if (settings.ratingsFrozen) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">ness.city/members</p>
        <h1 className="serif mt-3 text-[40px] leading-[1.05] text-ink-950">Back soon.</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.6] text-ink-600">The member index is paused for a moment. Check back shortly.</p>
      </main>
    );
  }

  const [counters, ranked] = await Promise.all([getCounters(), getLeaderboardRanked(null)]);
  const teaser = ranked.slice(0, MEMBER_CONFIG.leaderboard.signedOutVisible).map((m, i) => ({ ...m, rank: i + 1 }));

  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-8 sm:pt-12">
      <header className="mb-6">
        <h1 className="serif text-[34px] leading-[1.05] text-ink-950 sm:text-[40px]">Rate the room.</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-500">Rate more, see more. Nobody sees their own score.</p>
      </header>
      <MembersApp initialCounters={counters} initialTeaser={teaser} />
    </main>
  );
}
