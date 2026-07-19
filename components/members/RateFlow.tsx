"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MEMBER_CONFIG } from "@/lib/members/config";
import { ConsentNotice } from "@/components/members/ConsentNotice";

const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
const CONSENT_KEY = "ness.members.consent.v1";
const QUEUE_KEY = "ness.members.queue.v1";

type DeckMember = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  building: string | null;
  ratingCount: number;
};

type Identity = {
  did: string;
  email: string | null;
  displayName: string | null;
  handle: string | null;
};

type Vouch = "yes" | "no" | "not_sure";

type Answers = {
  integrity: number | null;
  curiosity: number | null;
  creativity: number | null;
  vouch: Vouch | null;
  note: string;
};

const EMPTY: Answers = {
  integrity: null,
  curiosity: null,
  creativity: null,
  vouch: null,
  note: "",
};

type QueueItem = { identity: Identity; subjectProfileId: string; answers: Answers };

/** Outer gate: only mount the Privy-dependent flow when Privy is configured. */
export function RateFlow() {
  if (!PRIVY_ENABLED) {
    return (
      <Notice title="Sign-in isn't configured yet.">
        The rating flow needs auth. Set{" "}
        <code className="font-mono text-ink-800">NEXT_PUBLIC_PRIVY_APP_ID</code>{" "}
        in the environment and redeploy, then this page lights up.
      </Notice>
    );
  }
  return <AuthedRateFlow />;
}

function AuthedRateFlow() {
  const { ready, authenticated, user, login } = usePrivy();

  const identity = useMemo<Identity | null>(() => {
    if (!user) return null;
    const email = user.email?.address ?? user.google?.email ?? null;
    const displayName =
      user.google?.name ??
      user.farcaster?.displayName ??
      user.farcaster?.username ??
      (email ? email.split("@")[0] : null);
    return {
      did: user.id,
      email,
      displayName,
      handle: user.farcaster?.username ?? null,
    };
  }, [user]);

  const [consented, setConsented] = useState(false);
  const [deck, setDeck] = useState<DeckMember[]>([]);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [ratedByMe, setRatedByMe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [frozen, setFrozen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [syncState, setSyncState] = useState<"idle" | "saving" | "offline">("idle");

  const clearedIds = useRef<Set<string>>(new Set());
  const answersByMember = useRef<Map<string, Answers>>(new Map());
  const queue = useRef<QueueItem[]>([]);
  const draining = useRef(false);
  const loadingRef = useRef(false);

  // Consent gate (once per browser).
  useEffect(() => {
    try {
      setConsented(localStorage.getItem(CONSENT_KEY) === "1");
    } catch {
      setConsented(false);
    }
  }, []);

  // Restore any un-synced writes from a previous session and drain them.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QueueItem[];
        if (Array.isArray(parsed) && parsed.length) {
          queue.current = parsed;
          drainQueue();
        }
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistQueue = useCallback(() => {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.current));
    } catch {
      /* ignore */
    }
  }, []);

  const drainQueue = useCallback(async () => {
    if (draining.current) return;
    draining.current = true;
    while (queue.current.length) {
      const item = queue.current[0];
      setSyncState("saving");
      try {
        const res = await fetch("/api/members/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identity: item.identity,
            subjectProfileId: item.subjectProfileId,
            integrity: item.answers.integrity,
            curiosity: item.answers.curiosity,
            creativity: item.answers.creativity,
            vouch: item.answers.vouch,
            note: item.answers.note,
          }),
        });
        if (res.status === 423) {
          // Frozen mid-session: stop draining, surface it, keep the queue.
          setFrozen(true);
          break;
        }
        if (!res.ok && res.status !== 400 && res.status !== 404) {
          throw new Error(`HTTP ${res.status}`);
        }
        // 200 (saved), or 400/404 (won't ever succeed) → drop from queue.
        queue.current.shift();
        persistQueue();
        setSyncState("idle");
      } catch {
        // Network error: keep the item, back off, retry.
        setSyncState("offline");
        await new Promise((r) => setTimeout(r, 2500));
      }
    }
    draining.current = false;
    if (queue.current.length === 0) setSyncState("idle");
  }, [persistQueue]);

  const loadDeck = useCallback(async () => {
    if (!identity || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/members/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity }),
        cache: "no-store",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        frozen?: boolean;
        members?: DeckMember[];
        total?: number;
        ratedByMe?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setFrozen(Boolean(data.frozen));
      const fresh = (data.members ?? []).filter((m) => !clearedIds.current.has(m.id));
      // Merge, don't replace: appending keeps the user's place in the deck.
      setDeck((prev) => {
        if (prev.length === 0) return fresh;
        const known = new Set(prev.map((m) => m.id));
        return [...prev, ...fresh.filter((m) => !known.has(m.id))];
      });
      setTotal(data.total ?? 0);
      // Client is authoritative on progress mid-session (optimistic writes may
      // not have landed yet); only ever correct upward.
      setRatedByMe((prev) => Math.max(prev, data.ratedByMe ?? 0));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Couldn't load the deck.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [identity]);

  useEffect(() => {
    if (authenticated && consented && identity) loadDeck();
  }, [authenticated, consented, identity, loadDeck]);

  const current = deck[index] ?? null;

  // Load any saved draft when the card changes (supports Back/revise).
  useEffect(() => {
    if (!current) return;
    setAnswers(answersByMember.current.get(current.id) ?? EMPTY);
  }, [current]);

  const hasLow = useMemo(
    () =>
      [answers.integrity, answers.curiosity, answers.creativity].some(
        (s) => s !== null && s <= MEMBER_CONFIG.lowScoreThreshold,
      ),
    [answers],
  );

  const noteRequired = hasLow && !answers.note.trim();

  const commitAndAdvance = useCallback(
    (finalAnswers: Answers) => {
      if (!current || !identity) return;
      const answered =
        (finalAnswers.integrity !== null ? 1 : 0) +
        (finalAnswers.curiosity !== null ? 1 : 0) +
        (finalAnswers.creativity !== null ? 1 : 0) +
        (finalAnswers.vouch !== null ? 1 : 0);

      // Enqueue the write (optimistic) and advance instantly.
      answersByMember.current.set(current.id, finalAnswers);
      clearedIds.current.add(current.id);
      queue.current.push({
        identity,
        subjectProfileId: current.id,
        answers: finalAnswers,
      });
      persistQueue();
      drainQueue();

      if (answered > 0) setRatedByMe((n) => n + 1);
      setAnswers(EMPTY);
      setIndex((i) => i + 1);

      // Near the end of the deck? Pull more (cleared ids are filtered out).
      if (index >= deck.length - 3) loadDeck();
    },
    [current, identity, index, deck.length, persistQueue, drainQueue, loadDeck],
  );

  const setScore = (key: "integrity" | "curiosity" | "creativity", value: number) => {
    setAnswers((a) => ({ ...a, [key]: a[key] === value ? null : value }));
  };

  const setVouch = (value: Vouch) => {
    setAnswers((a) => {
      const next = { ...a, vouch: a.vouch === value ? null : value };
      // Tapping vouch is the fourth tap → auto-advance, unless a note is owed.
      const lowNow = [next.integrity, next.curiosity, next.creativity].some(
        (s) => s !== null && s <= MEMBER_CONFIG.lowScoreThreshold,
      );
      if (next.vouch !== null && !(lowNow && !next.note.trim())) {
        // Defer so the tap highlight is visible before the card flips.
        setTimeout(() => commitAndAdvance(next), 220);
      }
      return next;
    });
  };

  const anyAnswered =
    answers.integrity !== null ||
    answers.curiosity !== null ||
    answers.creativity !== null ||
    answers.vouch !== null;

  // The deck-advance control. Commits whatever's on the card (including all
  // "haven't interacted" = a skip) and moves on. Not a form submit — the
  // four-tap path already auto-advances; this is for partial cards and skips.
  const advance = () => {
    if (noteRequired) return;
    commitAndAdvance(answers);
  };

  const back = () => {
    if (index === 0) return;
    const prev = deck[index - 1];
    if (prev) {
      clearedIds.current.delete(prev.id);
      const saved = answersByMember.current.get(prev.id);
      const hadSignal =
        saved &&
        (saved.integrity !== null ||
          saved.curiosity !== null ||
          saved.creativity !== null ||
          saved.vouch !== null);
      if (hadSignal) setRatedByMe((n) => Math.max(0, n - 1));
    }
    setIndex((i) => Math.max(0, i - 1));
  };

  // ---- Render states -------------------------------------------------------
  if (!ready) return <Skeleton />;
  if (!authenticated) {
    return (
      <Notice title="Sign in to rate members.">
        <p className="mb-5">
          The index is contribution-first: you sign in, you rate, that&apos;s
          it. Your ratings are anonymous to everyone but the core team.
        </p>
        <button
          onClick={() => login()}
          className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          Sign in to start
          <span aria-hidden>→</span>
        </button>
      </Notice>
    );
  }
  if (!consented) {
    return (
      <ConsentNotice
        onAccept={() => {
          try {
            localStorage.setItem(CONSENT_KEY, "1");
          } catch {
            /* ignore */
          }
          setConsented(true);
        }}
      />
    );
  }
  if (frozen) {
    return (
      <Notice title="Rating is paused.">
        The core team has temporarily frozen ratings. Anything you already
        submitted is safe. Check back soon.
      </Notice>
    );
  }
  if (loading && deck.length === 0) return <Skeleton />;
  if (!current && loading) return <Skeleton />;
  if (loadError && deck.length === 0) {
    return (
      <Notice title="Couldn't load the deck.">
        <p className="mb-4">{loadError}</p>
        <button
          onClick={loadDeck}
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
        >
          Try again
        </button>
      </Notice>
    );
  }
  if (!current) {
    return (
      <Notice title="You're all caught up.">
        <p className="mb-1">
          You&apos;ve been through everyone available right now
          {total > 0 ? ` — ${ratedByMe} of ${total}` : ""}. New members show up
          here as they join.
        </p>
        <p className="text-[13px] text-ink-500">
          {syncState === "offline"
            ? "Some ratings are still syncing — keep this tab open a moment."
            : "All your ratings are saved."}
        </p>
      </Notice>
    );
  }

  const pct = total > 0 ? Math.min(100, Math.round((ratedByMe / total) * 100)) : 0;

  return (
    <div>
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            You&apos;ve rated{" "}
            <span className="text-ink-950">{ratedByMe}</span> of{" "}
            <span className="text-ink-950">{total || "…"}</span>
          </p>
          <SyncBadge state={syncState} />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <motion.div
            className="h-full rounded-full bg-nessie-600"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.99 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card
            member={current}
            answers={answers}
            onScore={setScore}
            onVouch={setVouch}
            onNote={(note) => setAnswers((a) => ({ ...a, note }))}
            noteRequired={noteRequired}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls: back + deck-advance. The four-tap path auto-advances;
          this handles partial cards and honest skips. No form submit. */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <button
          onClick={back}
          disabled={index === 0}
          className="mt-2 text-[13px] text-ink-400 transition-colors hover:text-ink-950 disabled:opacity-0"
        >
          ← Back
        </button>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={advance}
            disabled={noteRequired}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-600 transition-colors hover:border-ink-950 hover:text-ink-950 disabled:opacity-40"
          >
            {anyAnswered ? "Next" : "Haven't interacted enough"}
            <span aria-hidden>→</span>
          </button>
          {noteRequired && (
            <span className="text-[11px] text-amber-600">
              Add a one-line note to continue.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Card({
  member,
  answers,
  onScore,
  onVouch,
  onNote,
  noteRequired,
}: {
  member: DeckMember;
  answers: Answers;
  onScore: (key: "integrity" | "curiosity" | "creativity", value: number) => void;
  onVouch: (value: Vouch) => void;
  onNote: (note: string) => void;
  noteRequired: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5 shadow-[var(--shadow-hover)] sm:p-6">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <CardAvatar member={member} />
        <div className="min-w-0 flex-1">
          <h2 className="serif truncate text-[24px] leading-tight text-ink-950">
            {member.displayName}
          </h2>
          {member.building ? (
            <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug text-ink-600">
              {member.building}
            </p>
          ) : (
            <p className="mt-0.5 font-mono text-[12px] text-ink-400">
              @{member.handle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {MEMBER_CONFIG.dimensions.score.map((dim) => (
          <ScoreRow
            key={dim.key}
            label={dim.label}
            prompt={dim.prompt}
            value={answers[dim.key as "integrity" | "curiosity" | "creativity"]}
            onPick={(v) =>
              onScore(dim.key as "integrity" | "curiosity" | "creativity", v)
            }
          />
        ))}

        <VouchRow
          label={MEMBER_CONFIG.dimensions.vouch.label}
          prompt={MEMBER_CONFIG.dimensions.vouch.prompt}
          value={answers.vouch}
          onPick={onVouch}
        />
      </div>

      {/* Note (appears only when a 1–2 is present) */}
      <AnimatePresence>
        {[answers.integrity, answers.curiosity, answers.creativity].some(
          (s) => s !== null && s <= MEMBER_CONFIG.lowScoreThreshold,
        ) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                One line — required for a 1 or 2
              </label>
              <textarea
                value={answers.note}
                onChange={(e) => onNote(e.target.value)}
                autoFocus
                rows={2}
                placeholder="What specifically happened — a missed commitment, a pattern you observed."
                className={`mt-1.5 w-full resize-none rounded-xl border bg-paper px-3 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:outline-none ${
                  noteRequired
                    ? "border-amber-400 focus:border-amber-500"
                    : "border-ink-200 focus:border-ink-950"
                }`}
              />
              <p className="mt-1 text-[11px] text-ink-400">
                Core-team only. Never shown in any aggregate, never shown to the
                person rated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreRow({
  label,
  prompt,
  value,
  onPick,
}: {
  label: string;
  prompt: string;
  value: number | null;
  onPick: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[15px] font-medium text-ink-950">{label}</span>
        {value === null && (
          <span className="font-mono text-[10px] text-ink-400">
            haven&apos;t interacted
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{prompt}</p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          const low = n <= MEMBER_CONFIG.lowScoreThreshold;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPick(n)}
              aria-pressed={selected}
              className={`h-11 rounded-xl border text-[15px] font-medium tabular-nums transition-colors ${
                selected
                  ? low
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-ink-950 bg-ink-950 text-paper"
                  : "border-ink-200 bg-paper text-ink-700 hover:border-ink-400 active:bg-ink-50"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VouchRow({
  label,
  prompt,
  value,
  onPick,
}: {
  label: string;
  prompt: string;
  value: Vouch | null;
  onPick: (v: Vouch) => void;
}) {
  const options: { v: Vouch; text: string }[] = [
    { v: "yes", text: "Yes" },
    { v: "not_sure", text: "Not sure" },
    { v: "no", text: "No" },
  ];
  return (
    <div className="border-t border-ink-100 pt-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[15px] font-medium text-ink-950">{label}</span>
        {value === null && (
          <span className="font-mono text-[10px] text-ink-400">
            haven&apos;t interacted
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{prompt}</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {options.map((o) => {
          const selected = value === o.v;
          const yes = o.v === "yes";
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onPick(o.v)}
              aria-pressed={selected}
              className={`h-12 rounded-xl border text-[14px] font-medium transition-colors ${
                selected
                  ? yes
                    ? "border-garden-600 bg-garden-600 text-white"
                    : "border-ink-950 bg-ink-950 text-paper"
                  : "border-ink-200 bg-paper text-ink-700 hover:border-ink-400 active:bg-ink-50"
              }`}
            >
              {o.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardAvatar({ member }: { member: DeckMember }) {
  if (member.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatarUrl}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 flex-none rounded-full object-cover"
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
    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[16px] text-ink-700">
      {initials}
    </div>
  );
}

function SyncBadge({ state }: { state: "idle" | "saving" | "offline" }) {
  if (state === "idle")
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-400">
        <span className="h-1.5 w-1.5 rounded-full bg-garden-500" />
        saved
      </span>
    );
  if (state === "saving")
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nessie-500" />
        saving…
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      offline — will retry
    </span>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
      <h2 className="serif text-[24px] leading-tight text-ink-950">{title}</h2>
      <div className="mt-3 text-[14.5px] leading-[1.6] text-ink-600">{children}</div>
      <div className="mt-5">
        <Link
          href="/members"
          className="font-mono text-[12px] text-ink-500 underline-offset-2 hover:text-ink-950 hover:underline"
        >
          ← back to the wall
        </Link>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-none rounded-full bg-ink-100 shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-ink-100 shimmer" />
          <div className="h-3 w-1/2 rounded bg-ink-100 shimmer" />
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-1/3 rounded bg-ink-100 shimmer" />
            <div className="h-11 w-full rounded-xl bg-ink-100 shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
