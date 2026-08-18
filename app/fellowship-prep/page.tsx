import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { FellowshipChecklist } from "@/components/FellowshipChecklist";

/**
 * /fellowship-prep
 *
 * A free exam course for the NS Fellowship track specifically:
 * online form, Zoom interview, in-person exam, decision. Distinct from
 * /guide (general Basic/Pro membership): the Fellowship is a separate,
 * far more selective process (~4,000 applicants for 128 slots in v1).
 *
 * Ported from github.com/adamtpang/ns-fellowship-prep, built by a
 * Fellowship applicant for the applicants who come after. Kept
 * independent per ness.city's own neutrality stance: not official, not
 * affiliated with Network School.
 */

export const metadata: Metadata = {
  title: "NS Fellowship Exam Course",
  description:
    "A free, honest exam course for the Network School Fellowship: the form, the Zoom interview, the in-person exam, the decision. Built by an applicant, for applicants.",
  alternates: { canonical: "https://ness.city/fellowship-prep" },
  openGraph: {
    title: "NS Fellowship Exam Course",
    description:
      "Free exam course for the Network School Fellowship's 4-stage process.",
    url: "https://ness.city/fellowship-prep",
    siteName: "Ness",
    type: "website",
  },
};

export default function FellowshipPrepPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> ness.city
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <header className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Free · unofficial
          </p>
          <h1 className="serif mt-3 text-[40px] leading-[1.05] text-ink-950 sm:text-[58px]">
            NS Fellowship
            <br />
            <span className="italic">Exam Course</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.65] text-ink-700 sm:text-[16px]">
            ~4,000 people apply per cohort for 128 spots. Most applicants
            lose ground on things entirely in their control: a vague form,
            an unrehearsed pitch, no plan for the in-person stage. This
            won&rsquo;t guarantee a seat. It makes sure you&rsquo;re not
            losing ground on the parts you actually control.
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Link
          href="/fellowship-prep/exam"
          className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-paper px-5 py-4 transition-colors hover:border-ink-950"
        >
          <div>
            <p className="text-[14px] font-medium text-ink-950">
              New: the NS Exam Study Deck
            </p>
            <p className="mt-0.5 text-[13px] leading-[1.6] text-ink-600">
              The published exam structure from ns.com/exam plus a
              spaced-repetition flashcard trainer for the seven published
              topics.
            </p>
          </div>
          <span aria-hidden className="text-ink-500">
            →
          </span>
        </Link>
      </FadeIn>

      <FadeInOnView>
        <div className="mt-10">
          <FellowshipChecklist />
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <p className="mt-10 text-[12px] leading-[1.7] text-ink-500">
          Not official, not affiliated with or endorsed by Network School.
          Structure is sourced from public information about the Fellowship
          process, not from NS itself. Progress saves in your browser only,
          nothing is sent anywhere. Built by a Fellowship applicant, ported
          from{" "}
          <a
            href="https://github.com/adamtpang/ns-fellowship-prep"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink-950"
          >
            github.com/adamtpang/ns-fellowship-prep
          </a>
          .
        </p>
      </FadeInOnView>
    </main>
  );
}
