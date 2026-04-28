import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to feed
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
            diagnoses. Tell us what&apos;s broken, who&apos;s affected, and your
            best guess at why.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <form className="mt-10 space-y-7">
          <Field label="Title" hint="One sentence. Concrete. Skip 'maybe we should…'">
            <input
              type="text"
              placeholder="Coworking Wi-Fi drops every afternoon around 3pm"
              className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {["operations", "social", "infra", "policy", "wellbeing"].map((c) => (
                <label
                  key={c}
                  className="cursor-pointer rounded-full border border-ink-200 bg-paper px-3.5 py-1.5 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
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
              className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field
            label="Why is it happening?"
            hint="Your best diagnosis. It's okay to be wrong, the community will refine it. But take a swing."
          >
            <textarea
              rows={4}
              placeholder="My guess: the AP shares a 5GHz channel with the building next door. Their afternoon shift starts at 3pm and the channel saturates."
              className="w-full rounded-xl border border-ink-300 bg-paper-tint px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field label="Roughly how many citizens are affected?">
            <input
              type="number"
              placeholder="62"
              className="w-32 rounded-xl border border-ink-200 bg-paper px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <div className="flex items-center justify-between border-t border-ink-200 pt-6">
            <p className="max-w-xs text-[12px] text-ink-500">
              Submitting earns 5 credit for surfacing. Solving it earns more.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              Submit problem
              <span aria-hidden>→</span>
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
