"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };
type Stage = { n: number; title: string; blurb: string; items: Item[] };

const STAGES: Stage[] = [
  {
    n: 1,
    title: "The Form",
    blurb:
      "Online application. First cut. Most applicants lose here on vagueness, not lack of talent.",
    items: [
      { id: "s1-1", text: "I can describe what I'm building in one sentence a stranger understands" },
      { id: "s1-2", text: "I have a live, shipped thing I can link to, not just an idea or a deck" },
      { id: "s1-3", text: "I've quantified what I've done with a real number (users, commits, revenue, uptime)" },
      { id: "s1-4", text: "My “why NS, why now” is specific to NS, not a generic answer I could paste anywhere" },
      { id: "s1-5", text: "Someone else has read my draft and given real feedback before I submit" },
      { id: "s1-6", text: "I'm applying early in the cohort window, not the last day" },
    ],
  },
  {
    n: 2,
    title: "The Zoom Interview",
    blurb: "Live conversation. They're checking if the form was true and if you're worth a room.",
    items: [
      { id: "s2-1", text: "I can explain my project in under 60 seconds, no notes" },
      { id: "s2-2", text: "I can name the single hardest technical problem I've personally solved recently" },
      { id: "s2-3", text: "I know exactly what I want from NS specifically, beyond “networking”" },
      { id: "s2-4", text: "I've rehearsed answering “why you, out of thousands of applicants”" },
      { id: "s2-5", text: "I have 2 to 3 real questions ready to ask them back" },
      { id: "s2-6", text: "I've tested my video and audio setup in advance" },
    ],
  },
  {
    n: 3,
    title: "The In-Person Exam",
    blurb: "You show up physically. This filters out people who were only good on a screen.",
    items: [
      { id: "s3-1", text: "I've planned travel and logistics for an in-person exam, not left it for the week of" },
      { id: "s3-2", text: "I've talked to anyone who's been through it before, community intel beats guessing" },
      { id: "s3-3", text: "I can perform under real time pressure, not just recite prepared answers" },
      { id: "s3-4", text: "I have a fallback plan if travel or scheduling gets tight" },
      { id: "s3-5", text: "I'll walk in rested, not sleep-deprived from last-minute cramming" },
    ],
  },
  {
    n: 4,
    title: "The Decision",
    blurb: "Out of your hands by this point. Worth thinking through anyway.",
    items: [
      { id: "s4-1", text: "I have a real first-30-days plan for if I get in" },
      { id: "s4-2", text: "I have a real plan for if I don't, this isn't my only shot" },
      { id: "s4-3", text: "I know the odds are roughly 1 in 30, and I'm applying anyway" },
    ],
  },
];

const TOTAL = STAGES.reduce((n, s) => n + s.items.length, 0);
const KEY = "ness-fellowship-prep-v1";

function labelFor(score: number) {
  const pct = score / TOTAL;
  if (pct === 0) return "just starting";
  if (pct < 0.35) return "getting oriented";
  if (pct < 0.7) return "getting sharp";
  if (pct < 1) return "nearly there";
  return "fellowship-ready";
}

export function FellowshipChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore corrupt/missing state
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(checked));
  }, [checked, hydrated]);

  const score = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl border border-ink-200 bg-paper p-5">
        <div>
          <p className="text-[22px] font-medium text-ink-950">
            {score} / {TOTAL}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
            {labelFor(score)}
          </p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-ink-100 sm:w-48">
          <div
            className="h-full bg-ink-950 transition-all"
            style={{ width: `${(score / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {STAGES.map((stage) => (
          <section key={stage.n} className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Stage {stage.n}
            </p>
            <h2 className="serif mt-2 text-[26px] leading-[1.1] text-ink-950 sm:text-[30px]">
              {stage.title}
            </h2>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">{stage.blurb}</p>
            <div className="mt-4 space-y-1">
              {stage.items.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-[14px] leading-[1.5] text-ink-800 transition-colors hover:bg-paper-tint"
                >
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={(e) =>
                      setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 flex-shrink-0 accent-ink-950"
                  />
                  <span className={checked[item.id] ? "text-ink-400 line-through" : ""}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={() => setChecked({})}
        className="mt-6 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
      >
        Reset checklist
      </button>
    </div>
  );
}
