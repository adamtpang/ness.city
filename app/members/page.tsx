import type { Metadata } from "next";
import Link from "next/link";
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
export const revalidate = 60;

// title.absolute skips the root layout's "%s · Ness" template so this exact
// string is both the <title> and (below) the og:title — a prior mismatch
// between the two (title "Members · Ness" vs og:title "ness.city") was
// flagged by the AI-visibility audit. The title was also 14 chars, under
// the ~15 char minimum the audit checks for.
const MEMBERS_TITLE = "Ness — Rate the Room, See Your Rank";
const MEMBERS_DESCRIPTION =
  "Rate Network School members anonymously from -2 to +2, then watch the live ranked social index update in real time. Nobody ever sees their own score.";

export const metadata: Metadata = {
  title: { absolute: MEMBERS_TITLE },
  description: MEMBERS_DESCRIPTION,
  alternates: { canonical: "/" },
  // Custom meta tags some AI crawlers read as a quick brief of the page.
  other: {
    "ai-summary":
      "Ness Members is a live, anonymous social rating index for Network School: rate members from -2 to +2 and the community ranking updates instantly.",
    "ai-facts":
      "Ratings are anonymous and device-based, no account required. Rankings update live as the room rates. Nobody can see their own score.",
  },
  openGraph: {
    title: MEMBERS_TITLE,
    description: MEMBERS_DESCRIPTION,
    url: "https://ness.city",
    type: "website",
    // The page previously defined its own openGraph object without an
    // "images" entry, which silently dropped the auto-generated
    // app/opengraph-image.tsx card that every other route gets for free.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ness · the civic layer for builders",
      },
    ],
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
        <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-600">
          Ness Members is a live, community-run social index for Network School:
          everyone in the room rates everyone else, anonymously, and the ranking
          updates in real time as more people rate.
        </p>
        <ul className="mt-3 space-y-1 text-[12.5px] text-ink-600">
          <li>Rate members anonymously, −2 to +2 — no account required.</li>
          <li>The ranked social index updates live as the room rates.</li>
          <li>Invite friends to unlock more of the leaderboard.</li>
        </ul>
        <p className="mt-3 text-[12px] text-ink-400">
          See the full{" "}
          <Link href="/citizens" className="underline underline-offset-2 hover:text-ink-700">
            citizen roster
          </Link>{" "}
          or browse the community&apos;s open{" "}
          <Link href="/townhall" className="underline underline-offset-2 hover:text-ink-700">
            problem board
          </Link>
          .
        </p>
      </header>
      <section
        aria-labelledby="members-explainer"
        className="mb-7 space-y-4 rounded-2xl border border-ink-200 bg-paper-tint p-5"
      >
        <h2
          id="members-explainer"
          className="serif text-[24px] leading-tight text-ink-950"
        >
          A social index built by the room.
        </h2>
        <p className="text-[13.5px] leading-[1.65] text-ink-700">
          Ness Members gives Network School participants one shared place to
          rate the people around them from −2 to +2. Each device can submit one
          current rating per person, and the public index uses aggregate
          results rather than exposing who rated whom.
        </p>
        <p className="text-[13.5px] leading-[1.65] text-ink-700">
          Ness Members is free to use during its anonymous beta, and the wider
          Ness project is open source under the MIT license. There is no paid
          plan or trial for this rating tool; paid multi-city operations remain
          undecided and are not offered today.
        </p>
        <p className="text-[13.5px] leading-[1.65] text-ink-700">
          Ness Members assigns a pseudonymous device identifier in a secure,
          HttpOnly, SameSite cookie that lasts up to 1 year. Ratings are stored
          in Postgres, public rankings show aggregates, and the interface hides
          a participant&apos;s own row from that participant.
        </p>
        <p className="text-[13.5px] leading-[1.65] text-ink-700">
          Ness is an independent project operated by Adam Pang and is not
          affiliated with Network School or ns.com. The practical next step is
          to inspect the live index or rate one member; no purchase, quote, or
          guaranteed outcome is involved.
        </p>
      </section>
      <MembersApp initialCounters={counters} initialTeaser={teaser} />
    </main>
  );
}
