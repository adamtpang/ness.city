"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

const CATEGORIES = ["operations", "social", "infra", "policy", "wellbeing"] as const;
type Category = (typeof CATEGORIES)[number];

type Draft = {
  title: string;
  category: Category | "";
  summary: string;
  rootCause: string;
  affected: string;
  reporterDisplayName: string;
  reporterHandle: string;
};

const EMPTY: Draft = {
  title: "",
  category: "",
  summary: "",
  rootCause: "",
  affected: "",
  reporterDisplayName: "",
  reporterHandle: "",
};

const STORAGE_KEY = "ness:problem-draft:v2";
const IDENTITY_KEY = "ness:identity:v1";

type Submitted = {
  draft: Draft;
  slug: string;
  problemId: string;
  karmaAwarded: number;
  serverMode: boolean;
};

export default function SubmitPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        setDraft({ ...EMPTY, ...parsed });
        setTouched(true);
      }
      const id = localStorage.getItem(IDENTITY_KEY);
      if (id) {
        const parsed = JSON.parse(id) as { name: string; handle: string };
        setDraft((d) => ({
          ...d,
          reporterDisplayName: d.reporterDisplayName || parsed.name || "",
          reporterHandle: d.reporterHandle || parsed.handle || "",
        }));
      }
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !touched) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft, touched, hydrated]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setTouched(true);
    setError(null);
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function reset() {
    setDraft({
      ...EMPTY,
      reporterDisplayName: draft.reporterDisplayName,
      reporterHandle: draft.reporterHandle,
    });
    setSubmitted(null);
    setTouched(false);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit() {
    if (!draft.title.trim()) return setError("Give your problem a title.");
    if (!draft.category) return setError("Pick a category.");
    if (!draft.summary.trim()) return setError("Describe what's happening.");
    if (!draft.rootCause.trim())
      return setError("Take a swing at why it's happening.");
    if (!draft.reporterDisplayName.trim())
      return setError("Add your display name so the karma lands in the right account.");
    if (!draft.reporterHandle.trim())
      return setError("Add a short handle (no @, just letters).");

    setSubmitting(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title.trim(),
          summary: draft.summary.trim(),
          rootCause: draft.rootCause.trim(),
          category: draft.category,
          reporterDisplayName: draft.reporterDisplayName.trim(),
          reporterHandle: draft.reporterHandle.trim().replace(/^@/, "").toLowerCase(),
          affected: draft.affected ? Number(draft.affected) : 0,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        problem?: { id: string; slug: string };
        karmaAwarded?: number;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.problem) {
        // Fallback: save locally and let the user know.
        if (res.status === 503) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
          setSubmitted({
            draft,
            slug: "",
            problemId: "local-only",
            karmaAwarded: 0,
            serverMode: false,
          });
          return;
        }
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }

      // Success: clear draft, store identity for future submissions
      try {
        localStorage.setItem(
          IDENTITY_KEY,
          JSON.stringify({
            name: draft.reporterDisplayName.trim(),
            handle: draft.reporterHandle.trim().replace(/^@/, "").toLowerCase(),
          }),
        );
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }

      setSubmitted({
        draft,
        slug: data.problem.slug,
        problemId: data.problem.id,
        karmaAwarded: data.karmaAwarded ?? 0,
        serverMode: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-12">
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-700">
            {submitted.serverMode ? "Published" : "Saved locally"}
          </p>
          <h1 className="serif mt-2 text-[40px] leading-[1.05] text-ink-950">
            {submitted.serverMode
              ? "Your problem is live."
              : "Your problem is queued."}
          </h1>
          {submitted.serverMode ? (
            <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
              You earned{" "}
              <span className="inline-flex items-center rounded-full border border-ink-300 bg-paper-tint px-2 py-0.5 font-mono text-[12px] tabular-nums text-ink-950">
                +{submitted.karmaAwarded}
              </span>{" "}
              karma for surfacing with a real diagnosis. The problem is now on
              the townhall feed.
            </p>
          ) : (
            <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
              Database isn&apos;t configured yet. We saved your draft to this
              browser. Refresh once Postgres is wired and submit again.
            </p>
          )}
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
            <div className="border-b border-ink-200 bg-paper-tint px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              {submitted.serverMode ? "Published" : "Draft preview"}
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  {submitted.draft.category}
                </p>
                <h2 className="serif mt-1 text-[22px] leading-tight text-ink-950">
                  {submitted.draft.title}
                </h2>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Summary
                </p>
                <p className="mt-1 text-[14px] leading-[1.65] text-ink-700">
                  {submitted.draft.summary}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Why it happens
                </p>
                <p className="mt-1 text-[14px] leading-[1.65] text-ink-700">
                  {submitted.draft.rootCause}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-6 flex flex-wrap gap-3">
            {submitted.serverMode && submitted.slug && (
              <Link
                href={`/solve/${submitted.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Open the problem page
                <span aria-hidden>→</span>
              </Link>
            )}
            <Link
              href="/solve"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              Back to townhall
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              Submit another
            </button>
          </div>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <FadeIn y={6}>
        <Link
          href="/solve"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to townhall
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            New problem
          </p>
          <h1 className="serif mt-2 text-[40px] leading-[1.05] text-ink-950">
            Surface something broken.
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-600">
            The best problems on Ness aren&apos;t complaints. They&apos;re
            diagnoses. Tell us what&apos;s broken, who&apos;s affected, and
            your best guess at why. Earns +5 karma on submit.
          </p>
          {touched && hydrated && !submitted && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-paper-tint px-3 py-1 font-mono text-[11px] text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              draft auto-saved to this browser
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <form
          className="mt-10 space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Field label="Title" hint="One sentence. Concrete. Skip 'maybe we should…'">
            <input
              type="text"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Coworking Wi-Fi drops every afternoon around 3pm"
              className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = draft.category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update("category", c)}
                    className={`relative rounded-full px-3.5 py-1.5 text-[12px] transition-colors ${
                      active
                        ? "text-paper"
                        : "border border-ink-200 bg-paper text-ink-700 hover:border-ink-950 hover:text-ink-950"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="category-pill"
                        className="absolute inset-0 rounded-full bg-ink-950"
                        transition={{ type: "spring", stiffness: 500, damping: 36 }}
                      />
                    )}
                    <span className="relative">{c}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field
            label="What's happening?"
            hint="The observable problem. What's affected? When? How often?"
          >
            <textarea
              rows={4}
              value={draft.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Connection becomes unusable in main coworking from ~3pm to 5pm. Calls drop, deploys fail, members leave."
              className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field
            label="Why is it happening?"
            hint="Your best diagnosis. It's okay to be wrong, the community will refine it. But take a swing."
          >
            <textarea
              rows={4}
              value={draft.rootCause}
              onChange={(e) => update("rootCause", e.target.value)}
              placeholder="My guess: the AP shares a 5GHz channel with the building next door. Their afternoon shift starts at 3pm and the channel saturates."
              className="w-full rounded-xl border border-ink-300 bg-paper-tint px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Your name">
              <input
                type="text"
                value={draft.reporterDisplayName}
                onChange={(e) => update("reporterDisplayName", e.target.value)}
                placeholder="Adam Pang"
                className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </Field>
            <Field label="Handle">
              <input
                type="text"
                value={draft.reporterHandle}
                onChange={(e) =>
                  update("reporterHandle", e.target.value.replace(/^@/, ""))
                }
                placeholder="adam"
                className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </Field>
            <Field label="Citizens affected (rough)">
              <input
                type="number"
                inputMode="numeric"
                value={draft.affected}
                onChange={(e) => update("affected", e.target.value)}
                placeholder="62"
                className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </Field>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 border-t border-ink-200 pt-6">
            <p className="max-w-xs text-[12px] text-ink-500">
              Submitting earns +5 karma and lands the problem on the live
              feed. No login required for v0.10.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit problem"}
              {!submitting && <span aria-hidden>→</span>}
            </button>
          </div>
        </form>
      </FadeIn>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
        {label}
      </label>
      {hint && <p className="mt-1.5 mb-3 text-[12px] text-ink-500">{hint}</p>}
      {!hint && <div className="mt-3" />}
      {children}
    </div>
  );
}
