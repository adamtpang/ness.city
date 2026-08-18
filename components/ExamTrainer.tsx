"use client";

import { useEffect, useMemo, useState } from "react";
import { TOPICS, TOTAL_CARDS, type Card } from "@/lib/exam-deck";

/**
 * ExamTrainer
 *
 * Anki-style flashcard trainer for the NS exam's published topic list.
 * Spaced-repetition-lite via a five-box Leitner system persisted in
 * localStorage. Client-side only, no login, no network calls, no
 * dependencies beyond React.
 */

const STORAGE_KEY = "ness-exam-trainer-v1";
const DAY_MS = 24 * 60 * 60 * 1000;

/** Review interval in days for each Leitner box (1 through 5). */
const BOX_INTERVAL_DAYS: Record<number, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

const MAX_BOX = 5;

type CardState = { box: number; due: number };
type Progress = Record<string, CardState>;
type Grade = "again" | "hard" | "good" | "easy";

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Progress = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        typeof value === "object" &&
        value !== null &&
        typeof (value as CardState).box === "number" &&
        typeof (value as CardState).due === "number"
      ) {
        out[id] = { box: (value as CardState).box, due: (value as CardState).due };
      }
    }
    return out;
  } catch {
    return {};
  }
}

function isDue(state: CardState | undefined, now: number): boolean {
  if (!state) return true; // new card, never studied
  return state.due <= now;
}

function applyGrade(state: CardState | undefined, grade: Grade, now: number): CardState {
  const box = state?.box ?? 1;
  if (grade === "again") {
    return { box: 1, due: now };
  }
  if (grade === "hard") {
    // Stay in the same box, come back soon (10 minutes).
    return { box, due: now + 10 * 60 * 1000 };
  }
  const step = grade === "easy" ? 2 : 1;
  const nextBox = Math.min(box + step, MAX_BOX);
  return { box: nextBox, due: now + BOX_INTERVAL_DAYS[nextBox] * DAY_MS };
}

const GRADE_BUTTONS: { grade: Grade; label: string; hint: string }[] = [
  { grade: "again", label: "Again", hint: "back to box 1" },
  { grade: "hard", label: "Hard", hint: "retry soon" },
  { grade: "good", label: "Good", hint: "next box" },
  { grade: "easy", label: "Easy", hint: "skip a box" },
];

export function ExamTrainer() {
  const [progress, setProgress] = useState<Progress>({});
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Session state: null means the topic picker is showing.
  const [session, setSession] = useState<{
    topicName: string;
    queue: Card[];
    index: number;
    flipped: boolean;
    reviewed: number;
  } | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setNow(Date.now());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, hydrated]);

  const dueByTopic = useMemo(() => {
    const map: Record<string, { due: number; fresh: number }> = {};
    for (const topic of TOPICS) {
      let due = 0;
      let fresh = 0;
      for (const card of topic.cards) {
        const state = progress[card.id];
        if (!state) fresh += 1;
        else if (isDue(state, now)) due += 1;
      }
      map[topic.slug] = { due, fresh };
    }
    return map;
  }, [progress, now]);

  const totalDue = useMemo(
    () => Object.values(dueByTopic).reduce((n, t) => n + t.due + t.fresh, 0),
    [dueByTopic],
  );

  function startSession(topicSlug: string | "all") {
    const currentNow = Date.now();
    setNow(currentNow);
    const topics = topicSlug === "all" ? TOPICS : TOPICS.filter((t) => t.slug === topicSlug);
    const queue: Card[] = [];
    for (const topic of topics) {
      for (const card of topic.cards) {
        if (isDue(progress[card.id], currentNow)) queue.push(card);
      }
    }
    if (queue.length === 0) return;
    setSession({
      topicName: topicSlug === "all" ? "All topics" : topics[0]?.name ?? "",
      queue,
      index: 0,
      flipped: false,
      reviewed: 0,
    });
  }

  function grade(g: Grade) {
    if (!session) return;
    const card = session.queue[session.index];
    if (!card) return;
    const currentNow = Date.now();
    setProgress((prev) => ({
      ...prev,
      [card.id]: applyGrade(prev[card.id], g, currentNow),
    }));
    setSession((prev) => {
      if (!prev) return prev;
      // "Again" and "hard" put the card back at the end of this session's queue.
      const requeue = g === "again" || g === "hard";
      const queue = requeue ? [...prev.queue, card] : prev.queue;
      return {
        ...prev,
        queue,
        index: prev.index + 1,
        flipped: false,
        reviewed: prev.reviewed + 1,
      };
    });
    setNow(currentNow);
  }

  function endSession() {
    setSession(null);
    setNow(Date.now());
  }

  function resetProgress() {
    setProgress({});
    setSession(null);
    setNow(Date.now());
  }

  const topicLabelFor = (slug: string): string => {
    const t = dueByTopic[slug];
    if (!t) return "";
    if (t.fresh > 0 && t.due > 0) return `${t.due} due, ${t.fresh} new`;
    if (t.fresh > 0) return `${t.fresh} new`;
    if (t.due > 0) return `${t.due} due`;
    return "all caught up";
  };

  // Active study session view
  if (session) {
    const card = session.queue[session.index];
    if (!card) {
      return (
        <div className="rounded-2xl border border-ink-200 bg-paper p-6 text-center sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Session complete
          </p>
          <p className="serif mt-3 text-[26px] text-ink-950">
            {session.reviewed} {session.reviewed === 1 ? "review" : "reviews"} done
          </p>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">
            Cards you graded Good or Easy moved up a box and come back in 1
            to 14 days. Anything marked Again starts over in box 1.
          </p>
          <button
            onClick={endSession}
            className="mt-5 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
          >
            Back to topics
          </button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            {session.topicName} · {session.queue.length - session.index} left
          </p>
          <button
            onClick={endSession}
            className="text-[12px] text-ink-500 transition-colors hover:text-ink-950"
          >
            End session
          </button>
        </div>

        <div className="mt-6 min-h-[140px]">
          <p className="text-[17px] leading-[1.55] text-ink-950 sm:text-[19px]">{card.front}</p>
          {session.flipped && (
            <p className="mt-5 border-t border-ink-200 pt-5 text-[15px] leading-[1.65] text-ink-700">
              {card.back}
            </p>
          )}
        </div>

        {!session.flipped ? (
          <button
            onClick={() => setSession((prev) => (prev ? { ...prev, flipped: true } : prev))}
            className="mt-6 w-full rounded-xl bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
          >
            Show answer
          </button>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADE_BUTTONS.map(({ grade: g, label, hint }) => (
              <button
                key={g}
                onClick={() => grade(g)}
                className="rounded-xl border border-ink-200 bg-paper px-3 py-2.5 text-center transition-colors hover:border-ink-950"
              >
                <span className="block text-[13px] font-medium text-ink-950">{label}</span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-500">
                  {hint}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Topic picker view
  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl border border-ink-200 bg-paper p-5">
        <div>
          <p className="text-[22px] font-medium text-ink-950">
            {hydrated ? totalDue : "–"} / {TOTAL_CARDS}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
            cards due or new
          </p>
        </div>
        <button
          onClick={() => startSession("all")}
          disabled={!hydrated || totalDue === 0}
          className="rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Study all due
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {TOPICS.map((topic) => {
          const counts = dueByTopic[topic.slug];
          const hasWork = hydrated && counts !== undefined && counts.due + counts.fresh > 0;
          return (
            <div
              key={topic.slug}
              className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 bg-paper px-4 py-3.5 sm:px-5"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-ink-950">{topic.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                  {topic.cards.length} cards · {hydrated ? topicLabelFor(topic.slug) : "loading"}
                </p>
              </div>
              <button
                onClick={() => startSession(topic.slug)}
                disabled={!hasWork}
                className="flex-shrink-0 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[12px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Study
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-[12px] leading-[1.6] text-ink-500">
          Leitner boxes: Good moves a card up (1, 3, 7, then 14 day gaps),
          Again sends it back to box 1. Progress saves in this browser only.
        </p>
        <button
          onClick={resetProgress}
          className="ml-4 flex-shrink-0 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[12px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
