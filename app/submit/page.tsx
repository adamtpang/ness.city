import Link from "next/link";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-ink-200 transition-colors"
      >
        <span aria-hidden>←</span> back to feed
      </Link>

      <div className="mt-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink-50">Surface a problem</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-400">
          The best problems on Ness aren&apos;t complaints — they&apos;re diagnoses.
          Tell us what&apos;s broken, who&apos;s affected, and your best guess at why.
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <Field
          label="Title"
          hint="One sentence. Concrete. Skip 'maybe we should…'"
        >
          <input
            type="text"
            placeholder="Coworking Wi-Fi drops every afternoon around 3pm"
            className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-[14px] text-ink-50 placeholder:text-ink-600 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500"
          />
        </Field>

        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {["operations", "social", "infra", "policy", "wellbeing"].map((c) => (
              <label
                key={c}
                className="cursor-pointer rounded-full border border-ink-700 bg-ink-900 px-3 py-1.5 text-[12px] text-ink-300 hover:border-ember-500 hover:text-ink-100 transition-colors"
              >
                <input type="radio" name="category" value={c} className="sr-only" />
                {c}
              </label>
            ))}
          </div>
        </Field>

        <Field
          label="What's happening?"
          hint="The observable problem. What's affected? When? How often?"
        >
          <textarea
            rows={4}
            placeholder="Connection becomes unusable in main coworking from ~3pm to 5pm. Calls drop, deploys fail, members leave."
            className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-[14px] text-ink-50 placeholder:text-ink-600 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500"
          />
        </Field>

        <Field
          label="Why is it happening?"
          hint="Your best diagnosis. It's okay to be wrong — the community will refine it. But take a swing."
          accent
        >
          <textarea
            rows={4}
            placeholder="My guess: the AP shares a 5GHz channel with the building next door. Their afternoon shift starts at 3pm and the channel saturates."
            className="w-full rounded-md border border-ember-900/50 bg-ink-900 px-3 py-2 text-[14px] text-ink-50 placeholder:text-ink-600 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500"
          />
        </Field>

        <Field label="Roughly how many citizens are affected?">
          <input
            type="number"
            placeholder="62"
            className="w-32 rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-[14px] text-ink-50 placeholder:text-ink-600 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500"
          />
        </Field>

        <div className="flex items-center justify-between border-t border-ink-800 pt-6">
          <p className="text-[12px] text-ink-500 max-w-xs">
            Submitting earns 5 credit for surfacing. Solving it earns more.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-ember-500 px-5 py-2 text-[13px] font-medium text-ink-950 hover:bg-ember-400 transition-colors"
          >
            Submit problem
            <span aria-hidden>→</span>
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
  accent,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <label
        className={`block text-[12px] font-mono uppercase tracking-wider ${
          accent ? "text-ember-400" : "text-ink-300"
        }`}
      >
        {label}
      </label>
      {hint && <p className="mt-1 mb-2 text-[12px] text-ink-500">{hint}</p>}
      {!hint && <div className="mt-2" />}
      {children}
    </div>
  );
}
