"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { MEMBER_CONFIG, type Bucket } from "@/lib/members/config";

// AUTH OFF for the anonymous beta. Hard-disabled so no OAuth appears even if
// NEXT_PUBLIC_PRIVY_APP_ID is set in the env. To re-enable real login, restore:
//   const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
// and flip AUTH_ENABLED in components/Providers.tsx.
const PRIVY_ENABLED = false;
// Everyone rates anonymously against a durable device cookie the server assigns.
const ANON = !PRIVY_ENABLED;
const QUEUE_KEY = "ness.members.queue.v2";
const CONSENT_KEY = "ness.members.consent.v2";
const MILESTONE_KEY = "ness.members.shareMilestone.v1";
const SCALE = MEMBER_CONFIG.scale;
// Neutral → green ramp for the rating buttons. No red anywhere: the low end is
// neutral, the high end green, so a tap never signals "you're not good enough."
const TONE: Record<string, string> = {
  t0: "border-ink-200 bg-paper text-ink-500 active:bg-ink-100",
  t1: "border-ink-200 bg-ink-50 text-ink-600 active:bg-ink-100",
  t2: "border-garden-200 bg-garden-50/60 text-garden-800 active:bg-garden-100",
  t3: "border-garden-300 bg-garden-50 text-garden-700 active:bg-garden-100",
  t4: "border-garden-500 bg-garden-100 text-garden-800 active:bg-garden-200",
};
const TONE_FILL: Record<string, string> = {
  t0: "bg-ink-300", t1: "bg-ink-300", t2: "bg-garden-300", t3: "bg-garden-400", t4: "bg-garden-500",
};
const SHARE_URL = MEMBER_CONFIG.share.url;
const REF_KEY = "ness.members.ref.v1";

/** The referral code that brought this device in: from ?ref= (persisted on
 * first visit) or a prior visit. Drives invite attribution + invite-unlock. */
function getRefCode(): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("ref");
    if (fromUrl) {
      const clean = fromUrl.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
      if (clean.length >= 6) {
        localStorage.setItem(REF_KEY, clean);
        return clean;
      }
    }
    return localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

type DeckMember = { id: string; handle: string; displayName: string; avatarUrl: string | null; building: string | null };
type RankedMember = { id: string; rank: number; handle: string; displayName: string; avatarUrl: string | null; building: string | null; ratings: number; fill: number };
type RosterMember = { id: string; handle: string; displayName: string; avatarUrl: string | null; building: string | null; location: string | null; onCampus: boolean | null; github: string | null; industry: string | null; memberType: string | null };
type Counters = { totalRatings: number; ratersCount: number; totalMembers: number };
type Identity = { did: string; email: string | null; displayName: string | null; handle: string | null };
type QueueItem = { identity: Identity | null; subjectProfileId: string; rating: Bucket };

type LeaderboardData = {
  members: RankedMember[];
  unlocked: number;
  totalRanked: number;
  locked: number;
  revealPerRating: number;
  revealPerInvite: number;
  invitesLanded: number;
  inviteCode: string | null;
  distribution: Record<string, number>;
};

type Auth = { ready: boolean; authenticated: boolean; identity: Identity | null; login: () => void } | null;

export function MembersApp({ initialCounters, initialTeaser }: { initialCounters: Counters; initialTeaser: RankedMember[] }) {
  if (!PRIVY_ENABLED) {
    return <AppShell initialCounters={initialCounters} initialTeaser={initialTeaser} auth={null} />;
  }
  return <PrivyBridge initialCounters={initialCounters} initialTeaser={initialTeaser} />;
}

function PrivyBridge(props: { initialCounters: Counters; initialTeaser: RankedMember[] }) {
  const { ready, authenticated, user, login } = usePrivy();
  const identity = useMemo<Identity | null>(() => {
    if (!user) return null;
    const email = user.email?.address ?? user.google?.email ?? null;
    const displayName =
      user.google?.name ?? user.farcaster?.displayName ?? user.farcaster?.username ?? (email ? email.split("@")[0] : null);
    return { did: user.id, email, displayName, handle: user.farcaster?.username ?? null };
  }, [user]);
  return <AppShell {...props} auth={{ ready, authenticated, identity, login }} />;
}

// ---------------------------------------------------------------------------

function AppShell({ initialCounters, initialTeaser, auth }: { initialCounters: Counters; initialTeaser: RankedMember[]; auth: Auth }) {
  const [tab, setTab] = useState<"rate" | "rankings" | "roster" | "next">("rankings");
  const [counters, setCounters] = useState<Counters>(initialCounters);
  const [consented, setConsented] = useState(true);
  const signedIn = ANON || Boolean(auth?.authenticated && auth.identity);
  const identity = auth?.identity ?? null;

  // Rate deck
  const [deck, setDeck] = useState<DeckMember[]>([]);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [ratedByMe, setRatedByMe] = useState(0);
  const [deckLoading, setDeckLoading] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [me, setMe] = useState<{ needsOnboarding: boolean; displayName: string; building: string } | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [milestoneDone, setMilestoneDone] = useState(true);

  // Leaderboard
  const [board, setBoard] = useState<LeaderboardData>({
    members: initialTeaser.map((m, i) => ({ ...m, rank: i + 1 })),
    unlocked: initialTeaser.length,
    totalRanked: initialTeaser.length,
    locked: 0,
    revealPerRating: MEMBER_CONFIG.leaderboard.revealPerRating,
    revealPerInvite: MEMBER_CONFIG.leaderboard.revealPerInvite,
    invitesLanded: 0,
    inviteCode: null,
    distribution: {},
  });

  const [sync, setSync] = useState<"idle" | "saving" | "offline">("idle");
  const clearedIds = useRef<Set<string>>(new Set());
  const queue = useRef<QueueItem[]>([]);
  const draining = useRef(false);
  const loadingDeckRef = useRef(false);
  const autoOnboardedRef = useRef(false);
  const refCodeRef = useRef<string | null>(null);

  useEffect(() => {
    refCodeRef.current = getRefCode();
    try {
      setConsented(localStorage.getItem(CONSENT_KEY) === "1");
      setMilestoneDone(localStorage.getItem(MILESTONE_KEY) === "1");
    } catch {
      setConsented(false);
    }
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QueueItem[];
        if (Array.isArray(parsed) && parsed.length) {
          queue.current = parsed;
          drainQueue();
        }
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistQueue = useCallback(() => {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.current)); } catch { /* ignore */ }
  }, []);

  const drainQueue = useCallback(async () => {
    if (draining.current) return;
    draining.current = true;
    while (queue.current.length) {
      const item = queue.current[0];
      setSync("saving");
      try {
        const res = await fetch("/api/members/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identity: item.identity, subjectProfileId: item.subjectProfileId, rating: item.rating, ref: refCodeRef.current }),
        });
        if (res.status === 423) { setFrozen(true); break; }
        if (!res.ok && res.status !== 400 && res.status !== 404) throw new Error(`HTTP ${res.status}`);
        queue.current.shift();
        persistQueue();
        setSync("idle");
      } catch {
        setSync("offline");
        await new Promise((r) => setTimeout(r, 2500));
      }
    }
    draining.current = false;
    if (queue.current.length === 0) setSync("idle");
  }, [persistQueue]);

  const loadDeck = useCallback(async () => {
    if ((!identity && !ANON) || loadingDeckRef.current) return;
    loadingDeckRef.current = true;
    setDeckLoading(true);
    try {
      const res = await fetch("/api/members/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, ref: refCodeRef.current }),
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok) {
        setFrozen(Boolean(data.frozen));
        const fresh = (data.members ?? []).filter((m: DeckMember) => !clearedIds.current.has(m.id));
        setDeck((prev) => {
          if (prev.length === 0) return fresh;
          const known = new Set(prev.map((m) => m.id));
          return [...prev, ...fresh.filter((m: DeckMember) => !known.has(m.id))];
        });
        setTotal(data.total ?? 0);
        setRatedByMe((prev) => Math.max(prev, data.ratedByMe ?? 0));
        if (data.me) setMe(data.me);
      }
    } catch { /* offline ok */ } finally {
      loadingDeckRef.current = false;
      setDeckLoading(false);
    }
  }, [identity]);

  const onboard = useCallback(async (displayName: string, building: string) => {
    if (!identity) return;
    setOnboarding(true);
    try {
      const res = await fetch("/api/members/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, displayName, building }),
      });
      const data = await res.json();
      if (data.ok) {
        setMe({ needsOnboarding: false, displayName, building });
        await Promise.all([loadDeck(), loadBoard()]);
      }
    } catch { /* keep the form up so they can retry */ } finally {
      setOnboarding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, loadDeck]);

  const loadBoard = useCallback(async () => {
    try {
      const res = await fetch("/api/members/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(identity ? { identity } : {}), ref: refCodeRef.current }),
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok && !data.frozen) {
        setBoard({
          members: data.members ?? [],
          unlocked: data.unlocked ?? 0,
          totalRanked: data.totalRanked ?? 0,
          locked: data.locked ?? 0,
          revealPerRating: data.revealPerRating ?? MEMBER_CONFIG.leaderboard.revealPerRating,
          revealPerInvite: data.revealPerInvite ?? MEMBER_CONFIG.leaderboard.revealPerInvite,
          invitesLanded: data.invitesLanded ?? 0,
          inviteCode: data.inviteCode ?? null,
          distribution: data.distribution ?? {},
        });
      }
      if (data.frozen) setFrozen(true);
      if (data.counters) setCounters(data.counters);
    } catch { /* offline ok */ }
  }, [identity]);

  // Initial + identity-change loads.
  useEffect(() => {
    loadBoard();
    if (signedIn) loadDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  // Refresh the board each time the rankings tab is opened.
  useEffect(() => {
    if (tab === "rankings") loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Silent onboarding — no profile form. If a signed-in rater isn't in the
  // roster yet, add them from their Google identity in the background so they
  // become rateable without a single extra tap.
  useEffect(() => {
    if (signedIn && identity && me?.needsOnboarding && !autoOnboardedRef.current) {
      autoOnboardedRef.current = true;
      onboard(identity.displayName || "Member", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, me, identity]);

  const current = deck[index] ?? null;

  const rate = useCallback((bucket: Bucket) => {
    if (!current || (!identity && !ANON)) return;
    clearedIds.current.add(current.id);
    queue.current.push({ identity, subjectProfileId: current.id, rating: bucket });
    persistQueue();
    drainQueue();
    setRatedByMe((n) => n + 1);
    setCounters((c) => ({ ...c, totalRatings: c.totalRatings + 1, ratersCount: Math.max(c.ratersCount, 1) }));
    setIndex((i) => i + 1);
    if (index >= deck.length - 3) loadDeck();
  }, [current, identity, index, deck.length, persistQueue, drainQueue, loadDeck]);

  const inviteUrl = board.inviteCode ? `${SHARE_URL}?ref=${board.inviteCode}` : SHARE_URL;

  const showMilestone =
    signedIn && !milestoneDone && ratedByMe >= MEMBER_CONFIG.share.minRatings;
  const dismissMilestone = () => {
    try { localStorage.setItem(MILESTONE_KEY, "1"); } catch {}
    setMilestoneDone(true);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <CounterBar counters={counters} />
        <ShareButton ratedByMe={ratedByMe} variant="chip" inviteUrl={inviteUrl} />
      </div>

      <GuildBar counters={counters} />

      {showMilestone && <ShareMilestone ratedByMe={ratedByMe} inviteUrl={inviteUrl} onDismiss={dismissMilestone} />}

      {/* Tabs */}
      <div className="mt-5 flex rounded-full border border-ink-200 bg-paper p-1">
        <TabButton active={tab === "rate"} onClick={() => setTab("rate")}>Rate</TabButton>
        <TabButton active={tab === "rankings"} onClick={() => setTab("rankings")}>Index</TabButton>
        <TabButton active={tab === "next"} onClick={() => setTab("next")}>Next</TabButton>
        <TabButton active={tab === "roster"} onClick={() => setTab("roster")}>Roster</TabButton>
      </div>

      <div className="mt-5">
        {tab === "rate" && (
          <RateView
            auth={auth}
            signedIn={signedIn}
            consented={consented}
            onConsent={() => { try { localStorage.setItem(CONSENT_KEY, "1"); } catch {} setConsented(true); }}
            me={me}
            frozen={frozen}
            current={current}
            deckLoading={deckLoading && deck.length === 0}
            ratedByMe={ratedByMe}
            total={total}
            sync={sync}
            onRate={rate}
            onGoRankings={() => setTab("rankings")}
            inviteUrl={inviteUrl}
          />
        )}
        {tab === "rankings" && (
          <RankingsView board={board} signedIn={signedIn} ratedByMe={ratedByMe} onGoRate={() => setTab("rate")} inviteUrl={inviteUrl} />
        )}
        {tab === "next" && <NextView />}
        {tab === "roster" && <RosterView onGoRate={() => setTab("rate")} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rate tab

function RateView({
  auth, signedIn, consented, onConsent, me,
  frozen, current, deckLoading, ratedByMe, total, sync, onRate, onGoRankings, inviteUrl,
}: {
  auth: Auth; signedIn: boolean; consented: boolean; onConsent: () => void;
  me: { needsOnboarding: boolean; displayName: string; building: string } | null;
  frozen: boolean;
  current: DeckMember | null; deckLoading: boolean; ratedByMe: number; total: number;
  sync: "idle" | "saving" | "offline"; onRate: (b: Bucket) => void; onGoRankings: () => void; inviteUrl?: string;
}) {
  if (auth && !auth.ready) return <CardSkeleton />;
  if (!signedIn) {
    return (
      <Notice title="Sign in to rate.">
        <p className="mb-4">One tap per person on a −2 to +2 spectrum. Anonymous to everyone but the core team, and you&apos;ll never see your own score.</p>
        <button onClick={() => auth?.login()} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
          Sign in to start <span aria-hidden>→</span>
        </button>
      </Notice>
    );
  }
  if (!consented) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-paper p-6">
        <h2 className="serif text-[24px] leading-tight text-ink-950">Hype the room.</h2>
        <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-700">
          One tap per person. <strong className="text-ink-950">Nobody ever sees their own score.</strong>
        </p>
        <button onClick={onConsent} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
          Start <span aria-hidden>→</span>
        </button>
      </div>
    );
  }
  if (frozen) return <Notice title="Rating is paused.">The core team froze ratings for a moment. Anything you submitted is safe.</Notice>;
  if (me === null) return <CardSkeleton />;
  if (deckLoading) return <CardSkeleton />;
  if (!current) {
    return (
      <Notice title="You've rated everyone available.">
        <p className="mb-4">{sync === "offline" ? "Still syncing — keep this open a moment." : "All caught up. Invite people to fill the room."}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onGoRankings} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
            See the rankings <span aria-hidden>→</span>
          </button>
          <ShareButton ratedByMe={ratedByMe} variant="cta" inviteUrl={inviteUrl} />
        </div>
      </Notice>
    );
  }

  const pct = total > 0 ? Math.min(100, Math.round((ratedByMe / total) * 100)) : 0;
  return (
    <div>
      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
            You&apos;ve rated <span className="text-ink-950">{ratedByMe}</span> of <span className="text-ink-950">{total || "…"}</span>
          </p>
          <SyncBadge state={sync} />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <motion.div className="h-full rounded-full bg-nessie-600" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>
      <SwipeCard key={current.id} member={current} onRate={onRate} />
      <p className="mt-3 text-center text-[12px] text-ink-400">Swipe or tap. Right = love, left = pass.</p>
    </div>
  );
}

function GuildBar({ counters }: { counters: Counters }) {
  const pct = counters.totalMembers > 0 ? Math.min(100, Math.round((counters.ratersCount / counters.totalMembers) * 100)) : 0;
  const width = counters.ratersCount > 0 ? Math.max(pct, 2) : 0;
  return (
    <div className="mt-4 rounded-2xl border border-ink-200 bg-paper p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-medium text-ink-800">The guild is {pct}% activated</span>
        <span className="font-mono text-[11px] text-ink-400">{counters.ratersCount.toLocaleString()} / {counters.totalMembers.toLocaleString()} rating</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <motion.div className="h-full rounded-full bg-nessie-600" initial={false} animate={{ width: `${width}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

function TasteBar({ distribution, ratedByMe }: { distribution: Record<string, number>; ratedByMe: number }) {
  if (ratedByMe <= 0) return null;
  const buckets = SCALE.map((s) => ({ tone: s.tone, emoji: s.emoji, n: distribution[String(s.value)] ?? 0 }));
  const max = Math.max(1, ...buckets.map((b) => b.n));
  const weighted = SCALE.reduce((a, s) => a + s.value * (distribution[String(s.value)] ?? 0), 0);
  const taste = weighted / ratedByMe <= -0.5 ? "picky" : weighted / ratedByMe < 0.5 ? "balanced" : "generous";
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-ink-800">Your taste</span>
        <span className="font-mono text-[11px] text-ink-400">{taste} · {ratedByMe}</span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        {buckets.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] tabular-nums text-ink-400">{b.n}</span>
            <div className={`w-full rounded-md ${TONE_FILL[b.tone] ?? "bg-ink-200"}`} style={{ height: Math.max(4, Math.round((b.n / max) * 40)) }} />
            <span className="text-[13px] leading-none">{b.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RosterView({ onGoRate }: { onGoRate: () => void }) {
  const [rows, setRows] = useState<RosterMember[]>([]);
  const [total, setTotal] = useState(0);
  const [shown, setShown] = useState(0);
  const [sort, setSort] = useState<"name" | "newest" | "oncampus" | "github">("oncampus");
  const [q, setQ] = useState("");
  const [onCampus, setOnCampus] = useState(false);
  const [hasGithub, setHasGithub] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/members/roster", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort, q, onCampus, hasGithub }),
          cache: "no-store",
        });
        const data = await res.json();
        if (!alive) return;
        if (data.ok) {
          setLocked(Boolean(data.locked));
          setRemaining(data.remaining ?? 0);
          setRows(data.members ?? []); setTotal(data.total ?? 0); setShown(data.shown ?? 0);
        }
      } catch { /* offline ok */ } finally { if (alive) setLoading(false); }
    }, q ? 250 : 0);
    return () => { alive = false; clearTimeout(timer); };
  }, [sort, q, onCampus, hasGithub]);

  if (locked) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-12 text-center">
        <p className="serif text-[22px] leading-tight text-ink-950">The room is private.</p>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-[1.6] text-ink-500">
          This is a directory of real people, so it is not open to the internet. Rate {remaining || "a few"} more and it opens up.
        </p>
        <button onClick={onGoRate} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
          Start rating <span aria-hidden>→</span>
        </button>
      </div>
    );
  }

  const sorts: { k: typeof sort; label: string }[] = [
    { k: "oncampus", label: "Here now" },
    { k: "newest", label: "Newest" },
    { k: "github", label: "Builders" },
    { k: "name", label: "A–Z" },
  ];

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the room: name, skill, company, place"
        className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none" />
      <div className="mt-3 flex flex-wrap gap-2">
        {sorts.map((s) => (
          <button key={s.k} onClick={() => setSort(s.k)}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${sort === s.k ? "border-ink-950 bg-ink-950 text-paper" : "border-ink-200 bg-paper text-ink-600 hover:border-ink-400"}`}>
            {s.label}
          </button>
        ))}
        <button onClick={() => setOnCampus((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${onCampus ? "border-garden-500 bg-garden-50 text-garden-700" : "border-ink-200 bg-paper text-ink-600 hover:border-ink-400"}`}>
          On campus
        </button>
        <button onClick={() => setHasGithub((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${hasGithub ? "border-garden-500 bg-garden-50 text-garden-700" : "border-ink-200 bg-paper text-ink-600 hover:border-ink-400"}`}>
          Ships code
        </button>
      </div>
      <div className="mt-3 font-mono text-[11px] text-ink-400">
        {loading ? "loading…" : `${shown.toLocaleString()}${total > shown ? " of " + total.toLocaleString() : ""} ${total === 1 ? "member" : "members"}`}
      </div>
      <div className="mt-2 overflow-hidden rounded-2xl border border-ink-200">
        {rows.length === 0 && !loading ? (
          <div className="px-5 py-10 text-center text-[14px] text-ink-500">No one matches. Loosen the filters.</div>
        ) : rows.map((m) => (
          <div key={m.id} className="flex items-center gap-3 border-b border-ink-100 bg-paper px-3 py-2.5 last:border-0 sm:px-4">
            <RosterAvatar member={m} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[14.5px] text-ink-950">{m.displayName}</span>
                {m.onCampus && <span className="h-1.5 w-1.5 flex-none rounded-full bg-garden-500" title="On campus" aria-hidden />}
              </div>
              {m.building ? <div className="truncate text-[12px] text-ink-500">{m.building}</div>
                : m.location ? <div className="truncate text-[12px] text-ink-400">{m.location}</div> : null}
            </div>
            {m.github && (
              <a href={`https://github.com/${encodeURIComponent(m.github)}`} target="_blank" rel="noreferrer"
                className="flex-none font-mono text-[11px] text-ink-400 hover:text-ink-950">gh</a>
            )}
          </div>
        ))}
      </div>
      {total > shown && !loading && (
        <p className="mt-3 text-center text-[12px] text-ink-400">Showing the first {shown.toLocaleString()}. Search to narrow.</p>
      )}
      <button onClick={onGoRate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-4 py-4 text-[13px] text-ink-600 transition-colors hover:border-ink-950">
        Start rating the room <span aria-hidden>→</span>
      </button>
    </div>
  );
}

type PlanPerson = { id: string; handle: string; displayName: string; avatarUrl: string | null; departOn: string | null; note: string | null };
type DestinationResource = { label: string; url: string; credit: string };
type Destination = { key: string; label: string; count: number; people: PlanPerson[]; resource: DestinationResource | null };
type LookupMember = { id: string; handle: string; displayName: string; avatarUrl: string | null };

/**
 * Where next. The continuity map: when the campus closes, this is what keeps
 * the network from dissolving with the venue. Only shows what people
 * volunteered about their own next move.
 */
function NextView() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // "who are you" lookup
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<LookupMember[]>([]);
  const [me, setMe] = useState<LookupMember | null>(null);
  const [dest, setDest] = useState("");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/members/plan", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) { setDestinations(data.destinations ?? []); setTotal(data.total ?? 0); }
    } catch { /* offline ok */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (me || q.trim().length < 2) { setHits([]); return; }
    let alive = true;
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/members/lookup", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q }),
        });
        const data = await res.json();
        if (alive && data.ok) setHits(data.members ?? []);
      } catch { /* ignore */ }
    }, 220);
    return () => { alive = false; clearTimeout(t); };
  }, [q, me]);

  const submit = async () => {
    if (!me || !dest.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/members/plan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: me.id, destination: dest.trim(), departOn: when.trim() || null }),
      });
      const data = await res.json();
      if (data.ok) {
        setDestinations(data.destinations ?? []); setTotal(data.total ?? 0);
        setDone(true); setOpen(dest.trim().toLowerCase());
      }
    } catch { /* keep the form up */ } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="rounded-2xl border border-ink-200 bg-paper p-4">
        {done ? (
          <div className="text-center">
            <p className="serif text-[20px] leading-tight text-ink-950">You&apos;re on the map.</p>
            <button onClick={() => { setDone(false); setMe(null); setQ(""); setDest(""); setWhen(""); }}
              className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 hover:text-ink-950">
              change it
            </button>
          </div>
        ) : (
          <>
            <p className="text-[12.5px] font-medium text-ink-800">Where are you headed?</p>
            {!me ? (
              <>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your name"
                  className="mt-2.5 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none" />
                {hits.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-ink-200">
                    {hits.map((h) => (
                      <button key={h.id} onClick={() => { setMe(h); setQ(""); setHits([]); }}
                        className="flex w-full items-center gap-2.5 border-b border-ink-100 bg-paper px-3 py-2 text-left last:border-0 hover:bg-paper-tint">
                        {h.avatarUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={h.avatarUrl} alt="" width={28} height={28} className="h-7 w-7 flex-none rounded-full object-cover" referrerPolicy="no-referrer" />
                          : <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[10px] text-ink-700">{initials(h.displayName)}</span>}
                        <span className="truncate text-[14px] text-ink-950">{h.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="rounded-full border border-ink-200 bg-paper-tint px-3 py-1 text-[12.5px] text-ink-800">{me.displayName}</span>
                  <button onClick={() => setMe(null)} className="font-mono text-[11px] text-ink-400 hover:text-ink-950">not you?</button>
                </div>
                <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Batam, Kazakhstan, Bangkok, home..."
                  className="mt-2.5 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none" />
                <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="When? (optional)"
                  className="mt-2 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none" />
                <button onClick={submit} disabled={!dest.trim() || busy}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40">
                  {busy ? "Saving..." : "Put me on the map"} {!busy && <span aria-hidden>→</span>}
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-3 font-mono text-[11px] text-ink-400">
        {loading ? "loading..." : `${total.toLocaleString()} ${total === 1 ? "person" : "people"} across ${destinations.length} ${destinations.length === 1 ? "place" : "places"}`}
      </div>

      {!loading && destinations.length === 0 ? (
        <div className="mt-2 rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-10 text-center">
          <p className="serif text-[20px] leading-tight text-ink-950">Nobody on the map yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-ink-500">Be the first. The map is how we find each other after the campus.</p>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {destinations.map((d) => (
            <div key={d.key} className="overflow-hidden rounded-2xl border border-ink-200 bg-paper">
              <button onClick={() => setOpen(open === d.key ? null : d.key)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-tint">
                <span className="serif text-[17px] text-ink-950">{d.label}</span>
                <span className="font-mono text-[11px] text-ink-400">{d.count}</span>
                <span aria-hidden className="ml-auto text-ink-300">{open === d.key ? "−" : "+"}</span>
              </button>
              {d.resource && (
                <a
                  href={d.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border-t border-ink-100 bg-paper-tint px-4 py-2 text-[12.5px] text-nessie-700 transition-colors hover:text-nessie-800"
                >
                  <span aria-hidden>↗</span>
                  <span className="font-medium">{d.resource.label}</span>
                  <span className="text-ink-400">{d.resource.credit}</span>
                </a>
              )}
              {open === d.key && (
                <div className="border-t border-ink-100">
                  {d.people.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-0">
                      {p.avatarUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.avatarUrl} alt="" width={32} height={32} className="h-8 w-8 flex-none rounded-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                        : <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[11px] text-ink-700">{initials(p.displayName)}</span>}
                      <span className="min-w-0 flex-1 truncate text-[14px] text-ink-950">{p.displayName}</span>
                      {p.departOn && <span className="flex-none font-mono text-[11px] text-ink-400">{p.departOn}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RosterAvatar({ member }: { member: RosterMember }) {
  if (member.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.avatarUrl} alt="" width={36} height={36} className="h-9 w-9 flex-none rounded-full object-cover" loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[12px] text-ink-700">{initials(member.displayName)}</div>;
}

function SwipeCard({ member, onRate }: { member: DeckMember; onRate: (b: Bucket) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const posOpacity = useTransform(x, [20, 120], [0, 1]);
  const negOpacity = useTransform(x, [-20, -120], [0, 1]);
  const [leaving, setLeaving] = useState(false);

  const fling = (bucket: Bucket) => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onRate(bucket), 120);
  };

  return (
    <div className="relative">
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(_, info) => {
          const dx = info.offset.x, v = info.velocity.x;
          if (dx > 40 || v > 600) fling(dx > 130 || v > 1000 ? 2 : 1);
          else if (dx < -40 || v < -600) fling(dx < -130 || v < -1000 ? -2 : -1);
        }}
        animate={leaving ? undefined : { x: 0 }}
        className="relative cursor-grab touch-pan-y rounded-2xl border border-ink-200 bg-paper p-5 shadow-[var(--shadow-hover)] active:cursor-grabbing sm:p-6"
      >
        {/* Drag tints */}
        <motion.div style={{ opacity: posOpacity }} className="pointer-events-none absolute right-4 top-4 rounded-full border border-garden-500 px-3 py-1 text-[13px] font-semibold text-garden-700">LOVE 🔥</motion.div>
        <motion.div style={{ opacity: negOpacity }} className="pointer-events-none absolute left-4 top-4 rounded-full border border-ink-300 px-3 py-1 text-[13px] font-semibold text-ink-500">PASS 🤷</motion.div>

        <div className="flex flex-col items-center px-2 text-center">
          <CardAvatar member={member} />
          <h2 className="serif mt-4 text-[27px] leading-tight text-ink-950">{member.displayName}</h2>
          {member.building && (
            <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-ink-600">{member.building}</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2">
          {SCALE.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => fling(s.value)}
              aria-label={s.label}
              className={`flex h-[78px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 transition-transform active:scale-95 ${TONE[s.tone] ?? TONE.t2}`}
            >
              <span className="text-[27px] leading-none">{s.emoji}</span>
              <span className="text-[11.5px] font-medium leading-none">{s.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rankings tab

function RankingsView({ board, signedIn, ratedByMe, onGoRate, inviteUrl }: { board: LeaderboardData; signedIn: boolean; ratedByMe: number; onGoRate: () => void; inviteUrl?: string }) {
  const { members, locked, revealPerRating, revealPerInvite, invitesLanded } = board;
  return (
    <div>
      {ratedByMe > 0 && (
        <div className="mb-4">
          <TasteBar distribution={board.distribution} ratedByMe={ratedByMe} />
        </div>
      )}
      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-12 text-center">
          <p className="serif text-[22px] leading-tight text-ink-950">Warming up.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-ink-500">Rate a few to bring it to life.</p>
          <button onClick={onGoRate} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">Start rating <span aria-hidden>→</span></button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 border-b border-ink-100 bg-paper px-3 py-2.5 last:border-0 sm:px-4">
              <div className="w-6 flex-none text-center font-mono text-[13px] tabular-nums text-ink-400">{m.rank}</div>
              <RankAvatar member={m} />
              <div className="min-w-0 flex-1">
                <div className="serif truncate text-[16px] leading-tight text-ink-950">{m.displayName}</div>
                {m.building && <div className="truncate text-[11.5px] text-ink-500">{m.building}</div>}
              </div>
              <div className="flex w-24 flex-none flex-col items-end gap-1 sm:w-32">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-nessie-600" style={{ width: `${Math.round(m.fill * 100)}%` }} />
                </div>
                <span className="font-mono text-[10px] text-ink-400">{m.ratings} {m.ratings === 1 ? "rating" : "ratings"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reveal / crawl hook — rating climbs one at a time, inviting jumps more */}
      {locked > 0 && (
        <div className="mt-3 rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-4 py-4">
          <p className="text-center text-[13px] leading-snug text-ink-600">
            <span className="font-medium text-ink-950">{locked} more</span> below. Rate to climb, invite to jump <span className="font-medium text-ink-950">{revealPerInvite}</span>.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <button onClick={onGoRate} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800">
              Rate to reveal <span aria-hidden className="opacity-70">+{revealPerRating}</span>
            </button>
            <ShareButton ratedByMe={ratedByMe} variant="cta" inviteUrl={inviteUrl} />
          </div>
          {invitesLanded > 0 && (
            <p className="mt-2.5 text-center text-[11.5px] text-ink-400">
              You&apos;ve pulled in {invitesLanded} {invitesLanded === 1 ? "person" : "people"} · +{invitesLanded * revealPerInvite} unlocked
            </p>
          )}
        </div>
      )}
      {locked === 0 && signedIn && ratedByMe > 0 && members.length > 0 && (
        <p className="mt-3 text-center text-[12px] text-ink-400">You&apos;ve unlocked the full ranking. Your own row is hidden — nobody sees their own score.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bits

function ShareButton({ ratedByMe, variant = "chip", inviteUrl }: { ratedByMe: number; variant?: "chip" | "cta"; inviteUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const url = inviteUrl ?? SHARE_URL;
  const share = async () => {
    const text =
      ratedByMe > 0
        ? `I'm ${ratedByMe} deep rating the room at ness.city. Come see who's who (and unlock more by joining through me):`
        : "Come rate the room at ness.city:";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "ness.city/members", text, url });
        return;
      }
    } catch {
      return; // user cancelled the native sheet
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };
  if (variant === "cta") {
    return (
      <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
        {copied ? "Link copied ✓" : "Share the invite"} {!copied && <span aria-hidden>→</span>}
      </button>
    );
  }
  return (
    <button onClick={share} className="flex-none rounded-full border border-ink-200 bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-600 transition-colors hover:border-ink-950 hover:text-ink-950">
      {copied ? "copied ✓" : "invite ↗"}
    </button>
  );
}

function ShareMilestone({ ratedByMe, inviteUrl, onDismiss }: { ratedByMe: number; inviteUrl?: string; onDismiss: () => void }) {
  return (
    <div className="mt-4 rounded-2xl border border-nessie-200 bg-nessie-50/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-nessie-700">Nice — {ratedByMe} rated</p>
          <h3 className="serif mt-1 text-[20px] leading-tight text-ink-950">Pull the next person in.</h3>
          <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-600">The index gets sharper with every member who joins. Send the invite.</p>
        </div>
        <button onClick={onDismiss} aria-label="Dismiss" className="flex-none text-ink-400 transition-colors hover:text-ink-950">×</button>
      </div>
      <div className="mt-3"><ShareButton ratedByMe={ratedByMe} variant="cta" inviteUrl={inviteUrl} /></div>
    </div>
  );
}

function CounterBar({ counters }: { counters: Counters }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Stat n={counters.ratersCount} label="members rating" />
      <span className="text-ink-200">·</span>
      <Stat n={counters.totalRatings} label="ratings so far" />
      {counters.totalMembers > 0 && (<><span className="text-ink-200">·</span><Stat n={counters.totalMembers} label="in the room" muted /></>)}
    </div>
  );
}

function Stat({ n, label, muted }: { n: number; label: string; muted?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`serif text-[22px] leading-none tabular-nums ${muted ? "text-ink-500" : "text-ink-950"}`}>{n.toLocaleString()}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">{label}</span>
    </span>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex-1 rounded-full py-2 text-[14px] font-medium transition-colors ${active ? "bg-ink-950 text-paper" : "text-ink-600 hover:text-ink-950"}`}>
      {children}
    </button>
  );
}

function SyncBadge({ state }: { state: "idle" | "saving" | "offline" }) {
  if (state === "saving") return <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nessie-500" />saving…</span>;
  if (state === "offline") return <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-amber-600"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />offline — will retry</span>;
  return <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-400"><span className="h-1.5 w-1.5 rounded-full bg-garden-500" />saved</span>;
}

function CardAvatar({ member }: { member: DeckMember }) {
  if (member.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.avatarUrl} alt="" width={132} height={132} className="h-[132px] w-[132px] flex-none rounded-full object-cover ring-1 ring-ink-200" loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <div className="flex h-[132px] w-[132px] flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[34px] text-ink-500">{initials(member.displayName)}</div>;
}

function RankAvatar({ member }: { member: RankedMember }) {
  if (member.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.avatarUrl} alt="" width={36} height={36} className="h-9 w-9 flex-none rounded-full object-cover" loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[12px] text-ink-700">{initials(member.displayName)}</div>;
}

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6">
      <h2 className="serif text-[24px] leading-tight text-ink-950">{title}</h2>
      <div className="mt-3 text-[14.5px] leading-[1.6] text-ink-600">{children}</div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-none rounded-full bg-ink-100 shimmer" />
        <div className="flex-1 space-y-2"><div className="h-5 w-2/3 rounded bg-ink-100 shimmer" /><div className="h-3 w-1/2 rounded bg-ink-100 shimmer" /></div>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-1.5">{[0,1,2,3,4].map((i) => <div key={i} className="h-16 rounded-xl bg-ink-100 shimmer" />)}</div>
    </div>
  );
}
