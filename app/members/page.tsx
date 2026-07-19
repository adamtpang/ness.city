import type { Metadata } from "next";
import Link from "next/link";
import { getPublicHighlights, type HighlightMember } from "@/lib/members/queries";
import { getMemberSettings } from "@/lib/members/settings";

/**
 * ness.city/members — the public page. Highlights mode by default: a wall of
 * the most-vouched members as score-free cards, plus live counters. No numeric
 * scores, no ranking numbers, no bottom of the list. This is the URL people
 * judge the whole idea on, so it renders fast and looks sharp on a phone.
 *
 * Revalidated every 30s: near-live counters without hammering the DB when the
 * link goes out to a few hundred people at once.
 */
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Members",
  description:
    "The people of Network School, vouched for by the people who know them.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "ness.city/members",
    description:
      "The people of Network School, vouched for by the people who know them.",
    url: "https://ness.city/members",
    type: "website",
  },
};

export default async function MembersPage() {
  const settings = await getMemberSettings();

  if (settings.ratingsFrozen) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          ness.city/members
        </p>
        <h1 className="serif mt-3 text-[40px] leading-[1.05] text-ink-950">
          Back soon.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.6] text-ink-600">
          The member index is paused for a moment. Check back shortly.
        </p>
      </main>
    );
  }

  const { members, totalRatings, membersCovered, totalMembers } =
    await getPublicHighlights();

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:pt-16">
      {/* Hero */}
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Network School · Forest City
        </p>
        <h1 className="serif mt-3 text-[44px] leading-[1.03] text-ink-950 sm:text-[60px]">
          The people, vouched for by the people who know them.
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink-600">
          Members rate each other on integrity, curiosity, and creativity, and
          vouch for who belongs here long-term. This is the wall of the
          most-vouched — no scores, no ranking numbers, just the people the
          community stands behind.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/members/rate"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Rate the room
            <span aria-hidden>→</span>
          </Link>
          <span className="text-[13px] text-ink-500">
            Sign in, rate in seconds. Anonymous to everyone but the core team.
          </span>
        </div>
      </header>

      {/* Live counters */}
      <section className="mt-12 grid grid-cols-2 gap-3 sm:max-w-md">
        <Counter value={totalRatings} label="ratings submitted" />
        <Counter
          value={membersCovered}
          label={totalMembers > 0 ? `of ${totalMembers} members covered` : "members covered"}
        />
      </section>

      {/* The wall */}
      <section className="mt-14">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 className="serif text-[26px] leading-tight text-ink-950">
            Most vouched
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            {members.length > 0 ? `${members.length} shown` : ""}
          </span>
        </div>

        {members.length === 0 ? (
          <EmptyWall />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </section>

      {/* Contribution note */}
      <section className="mt-16 rounded-2xl border border-ink-200 bg-paper-tint p-6 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
          How the wall is built
        </p>
        <h3 className="serif mt-2 text-[22px] leading-tight text-ink-950">
          Vouches, not votes.
        </h3>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-[1.65] text-ink-700">
          A member appears here once enough people have independently vouched to
          keep them around for the next twelve months. Nobody sees their own
          standing, and nobody sees who vouched for whom. The full numbers stay
          with the core team; this page only ever shows who the community is
          proud of.
        </p>
      </section>
    </main>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper px-5 py-4">
      <div className="serif text-[38px] leading-none tabular-nums text-ink-950">
        {value.toLocaleString()}
      </div>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
        {label}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: HighlightMember }) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink-200 bg-paper p-4 transition-colors hover:border-ink-300">
      <div className="flex items-center gap-3">
        <WallAvatar member={member} />
        <div className="min-w-0 flex-1">
          <div className="serif truncate text-[19px] leading-tight text-ink-950">
            {member.displayName}
          </div>
          <div className="truncate font-mono text-[11px] text-ink-400">
            @{member.handle}
          </div>
        </div>
      </div>
      {member.building && (
        <p className="mt-3 line-clamp-2 text-[13px] leading-snug text-ink-600">
          {member.building}
        </p>
      )}
      <div className="mt-3 pt-1">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-garden-200 bg-garden-50 px-2.5 py-1 text-[11.5px] font-medium text-garden-800">
          <span className="h-1.5 w-1.5 rounded-full bg-garden-500" />
          vouched by {member.vouchedBy}{" "}
          {member.vouchedBy === 1 ? "member" : "members"}
        </span>
      </div>
    </div>
  );
}

function WallAvatar({ member }: { member: HighlightMember }) {
  if (member.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatarUrl}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 flex-none rounded-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  const initials = member.displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[13px] text-ink-700">
      {initials}
    </div>
  );
}

function EmptyWall() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-14 text-center">
      <p className="serif text-[24px] leading-tight text-ink-950">
        The index is warming up.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-[1.6] text-ink-500">
        No one has crossed the vouch threshold yet. Be one of the first to rate
        the room — the wall fills in as the community weighs in.
      </p>
      <Link
        href="/members/rate"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
      >
        Start rating
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
