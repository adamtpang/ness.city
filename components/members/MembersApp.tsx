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

const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
const QUEUE_KEY = "ness.members.queue.v2";
const CONSENT_KEY = "ness.members.consent.v2";
const SCALE = MEMBER_CONFIG.scale;

type DeckMember = { id: string; handle: string; displayName: string; avatarUrl: string | null; building: string | null };
type RankedMember = { id: string; rank: number; handle: string; displayName: string; avatarUrl: string | null; building: string | null; ratings: number; fill: number };
type Counters = { totalRatings: number; ratersCount: number; totalMembers: number };
type Identity = { did: string; email: string | null; displayName: string | null; handle: string | null };
type QueueItem = { identity: Identity; subjectProfileId: string; rating: Bucket };

type LeaderboardData = {
  members: RankedMember[];
  unlocked: number;
  totalRanked: number;
  locked: number;
  revealPerRating: number;
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
  const [tab, setTab] = useState<"rate" | "rankings">("rate");
  const [counters, setCounters] = useState<Counters>(initialCounters);
  const [consented, setConsented] = useState(true);
  const signedIn = Boolean(auth?.authenticated && auth.identity);
  const identity = auth?.identity ?? null;

  // Rate deck
  const [deck, setDeck] = useState<DeckMember[]>([]);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [ratedByMe, setRatedByMe] = useState(0);
  const [deckLoading, setDeckLoading] = useState(false);
  const [frozen, setFrozen] = useState(false);

  // Leaderboard
  const [board, setBoard] = useState<LeaderboardData>({
    members: initialTeaser.map((m, i) => ({ ...m, rank: i + 1 })),
    unlocked: initialTeaser.length,
    totalRanked: initialTeaser.length,
    locked: 0,
    revealPerRating: MEMBER_CONFIG.leaderboard.revealPerRating,
  });

  const [sync, setSync] = useState<"idle" | "saving" | "offline">("idle");
  const clearedIds = useRef<Set<string>>(new Set());
  const queue = useRef<QueueItem[]>([]);
  const draining = useRef(false);
  const loadingDeckRef = useRef(false);

  useEffect(() => {
    try {
      setConsented(localStorage.getItem(CONSENT_KEY) === "1");
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
          body: JSON.stringify({ identity: item.identity, subjectProfileId: item.subjectProfileId, rating: item.rating }),
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
    if (!identity || loadingDeckRef.current) return;
    loadingDeckRef.current = true;
    setDeckLoading(true);
    try {
      const res = await fetch("/api/members/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity }),
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
      }
    } catch { /* offline ok */ } finally {
      loadingDeckRef.current = false;
      setDeckLoading(false);
    }
  }, [identity]);

  const loadBoard = useCallback(async () => {
    try {
      const res = await fetch("/api/members/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identity ? { identity } : {}),
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

  const current = deck[index] ?? null;

  const rate = useCallback((bucket: Bucket) => {
    if (!current || !identity) return;
    clearedIds.current.add(current.id);
    queue.current.push({ identity, subjectProfileId: current.id, rating: bucket });
    persistQueue();
    drainQueue();
    setRatedByMe((n) => n + 1);
    setCounters((c) => ({ ...c, totalRatings: c.totalRatings + 1, ratersCount: Math.max(c.ratersCount, 1) }));
    setIndex((i) => i + 1);
    if (index >= deck.length - 3) loadDeck();
  }, [current, identity, index, deck.length, persistQueue, drainQueue, loadDeck]);

  return (
    <div>
      <CounterBar counters={counters} />

      {/* Tabs */}
      <div className="mt-5 flex rounded-full border border-ink-200 bg-paper p-1">
        <TabButton active={tab === "rate"} onClick={() => setTab("rate")}>Rate</TabButton>
        <TabButton active={tab === "rankings"} onClick={() => setTab("rankings")}>Rankings</TabButton>
      </div>

      <div className="mt-5">
        {tab === "rate" ? (
          <RateView
            auth={auth}
            signedIn={signedIn}
            consented={consented}
            onConsent={() => { try { localStorage.setItem(CONSENT_KEY, "1"); } catch {} setConsented(true); }}
            frozen={frozen}
            current={current}
            deckLoading={deckLoading && deck.length === 0}
            ratedByMe={ratedByMe}
            total={total}
            sync={sync}
            onRate={rate}
            onGoRankings={() => setTab("rankings")}
          />
        ) : (
          <RankingsView board={board} signedIn={signedIn} ratedByMe={ratedByMe} onGoRate={() => setTab("rate")} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rate tab

function RateView({
  auth, signedIn, consented, onConsent, frozen, current, deckLoading, ratedByMe, total, sync, onRate, onGoRankings,
}: {
  auth: Auth; signedIn: boolean; consented: boolean; onConsent: () => void; frozen: boolean;
  current: DeckMember | null; deckLoading: boolean; ratedByMe: number; total: number;
  sync: "idle" | "saving" | "offline"; onRate: (b: Bucket) => void; onGoRankings: () => void;
}) {
  if (!PRIVY_ENABLED) {
    return <Notice title="Sign-in isn't configured yet.">Set NEXT_PUBLIC_PRIVY_APP_ID and redeploy to turn on rating. Rankings still work.</Notice>;
  }
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
        <h2 className="serif text-[24px] leading-tight text-ink-950">Quick heads-up.</h2>
        <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-700">
          You rate members on a −2 to +2 spectrum. <strong className="text-ink-950">Nobody ever sees their own score or who rated them.</strong> The aggregate feeds a ranked index; only the core team sees the raw numbers. Be honest.
        </p>
        <button onClick={onConsent} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
          Got it — start <span aria-hidden>→</span>
        </button>
      </div>
    );
  }
  if (frozen) return <Notice title="Rating is paused.">The core team froze ratings for a moment. Anything you submitted is safe.</Notice>;
  if (deckLoading) return <CardSkeleton />;
  if (!current) {
    return (
      <Notice title="You've rated everyone available.">
        <p className="mb-4">{sync === "offline" ? "Some ratings are still syncing — keep this tab open a moment." : "All caught up. New members show up here as they join."}</p>
        <button onClick={onGoRankings} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800">
          See the rankings <span aria-hidden>→</span>
        </button>
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
      <p className="mt-3 text-center text-[12px] text-ink-400">Swipe the card, or tap. Right = yes, left = no.</p>
    </div>
  );
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
        <motion.div style={{ opacity: posOpacity }} className="pointer-events-none absolute right-4 top-4 rounded-full border border-garden-500 px-3 py-1 text-[13px] font-semibold text-garden-700">YES 🔥</motion.div>
        <motion.div style={{ opacity: negOpacity }} className="pointer-events-none absolute left-4 top-4 rounded-full border border-red-400 px-3 py-1 text-[13px] font-semibold text-red-600">NO 👎</motion.div>

        <div className="flex items-center gap-4">
          <CardAvatar member={member} />
          <div className="min-w-0 flex-1">
            <h2 className="serif truncate text-[24px] leading-tight text-ink-950">{member.displayName}</h2>
            {member.building ? (
              <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug text-ink-600">{member.building}</p>
            ) : (
              <p className="mt-0.5 font-mono text-[12px] text-ink-400">@{member.handle}</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {SCALE.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => fling(s.value)}
              className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
                s.tone === "pos"
                  ? "border-garden-200 bg-garden-50 hover:border-garden-500 active:bg-garden-100"
                  : s.tone === "neg"
                    ? "border-red-200 bg-red-50 hover:border-red-400 active:bg-red-100"
                    : "border-ink-200 bg-paper hover:border-ink-400 active:bg-ink-50"
              }`}
            >
              <span className="text-[18px] leading-none">{s.emoji}</span>
              <span className="text-[11px] font-medium leading-none text-ink-700">{s.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rankings tab

function RankingsView({ board, signedIn, ratedByMe, onGoRate }: { board: LeaderboardData; signedIn: boolean; ratedByMe: number; onGoRate: () => void }) {
  const { members, locked, revealPerRating } = board;
  return (
    <div>
      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-5 py-12 text-center">
          <p className="serif text-[22px] leading-tight text-ink-950">The ranking is warming up.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-ink-500">Members appear once they&apos;ve got a few ratings. Be one of the first to rate the room.</p>
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

      {/* Reveal / crawl hook */}
      {locked > 0 && (
        <button onClick={onGoRate} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 bg-paper-tint px-4 py-4 text-center transition-colors hover:border-ink-950">
          <span className="text-[13px] text-ink-600">
            <span className="font-semibold text-ink-950">{locked} more</span> {locked === 1 ? "member is" : "members are"} ranked below the fold.{" "}
            {signedIn ? `Rate 1 more to reveal ${Math.min(locked, revealPerRating)}.` : "Sign in and rate to reveal them."}
          </span>
          <span aria-hidden className="text-ink-400">→</span>
        </button>
      )}
      {locked === 0 && signedIn && ratedByMe > 0 && members.length > 0 && (
        <p className="mt-3 text-center text-[12px] text-ink-400">You&apos;ve unlocked the full ranking. Your own row is hidden — nobody sees their own score.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bits

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
    return <img src={member.avatarUrl} alt="" width={56} height={56} className="h-14 w-14 flex-none rounded-full object-cover" loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[16px] text-ink-700">{initials(member.displayName)}</div>;
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
