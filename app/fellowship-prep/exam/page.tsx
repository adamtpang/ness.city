import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";
import { ExamTrainer } from "@/components/ExamTrainer";
import { TOPICS, TOTAL_CARDS } from "@/lib/exam-deck";

/**
 * /fellowship-prep/exam
 *
 * Study surface for the Network School Exam. The explainer reproduces
 * only the verified public structure from https://ns.com/exam (via
 * EXAM_INTEL.md in ns-fellowship-prep); the trainer drills textbook
 * fundamentals for the seven published topics. Community-made,
 * unaffiliated with Network School.
 */

export const metadata: Metadata = {
  title: "NS Exam Study Deck",
  description:
    "Free study surface for the Network School Exam: the published structure, the seven topics with NS's recommended Schaum's Outlines, and a spaced-repetition flashcard trainer. Community-made, unaffiliated.",
  alternates: { canonical: "https://ness.city/fellowship-prep/exam" },
  openGraph: {
    title: "NS Exam Study Deck",
    description:
      "The published NS exam structure plus a spaced-repetition flashcard trainer for the seven published topics.",
    url: "https://ness.city/fellowship-prep/exam",
    siteName: "Ness",
    type: "website",
  },
};

const LADDER = [
  {
    n: 1,
    title: "Online practice exam",
    body: "About 1 hour, taken online, with a score at the end.",
  },
  {
    n: 2,
    title: "In-person test",
    body: "If you pass: a proctored, in-person, AI-proof test on pen and paper at Network School.",
  },
  {
    n: 3,
    title: "Job placement",
    body: 'NS’s words: "If you pass this test with flying colors, we’ll get you a job right away."',
  },
  {
    n: 4,
    title: "Scholarship track",
    body: "Raw talent without domain knowledge yet earns a free scholarship stay at NS while studying, with monthly progress tests to keep the scholarship.",
  },
];

const ONLINE_SECTIONS = [
  {
    name: "Personality",
    body: 'A warmup with "no right answers".',
  },
  {
    name: "Reasoning",
    body: "Language-neutral pattern questions. No AI or external tools allowed, and NS says you will be retested on similar material at the in-person exam.",
  },
  {
    name: "Knowledge",
    body: "Algebra, calculus, discrete math, algorithms, and complexity theory.",
  },
];

export default function ExamPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <FadeIn y={6}>
        <Link
          href="/fellowship-prep"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> fellowship prep
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <header className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Free · unofficial · community-made
          </p>
          <h1 className="serif mt-3 text-[40px] leading-[1.05] text-ink-950 sm:text-[58px]">
            NS Exam
            <br />
            <span className="italic">Study Deck</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.65] text-ink-700 sm:text-[16px]">
            Network School publishes the structure and topic list of its exam
            at{" "}
            <a
              href="https://ns.com/exam"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink-950"
            >
              ns.com/exam
            </a>
            . This page reproduces that public structure, then gives you a
            spaced-repetition trainer with {TOTAL_CARDS} concept cards across
            the seven published topics.
          </p>
        </header>
      </FadeIn>

      {/* The ladder */}
      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            The published structure
          </p>
          <h2 className="serif mt-2 text-[26px] leading-[1.1] text-ink-950 sm:text-[30px]">
            Four steps to a tech job
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">
            NS runs this with Replit as an experiment in a merit scholarship
            open to anyone. The ladder, as published:
          </p>
          <div className="mt-5 space-y-3">
            {LADDER.map((step) => (
              <div
                key={step.n}
                className="flex gap-4 rounded-xl border border-ink-200 bg-paper px-4 py-3.5 sm:px-5"
              >
                <span className="font-mono text-[12px] font-medium text-ink-500">{step.n}</span>
                <div>
                  <p className="text-[14px] font-medium text-ink-950">{step.title}</p>
                  <p className="mt-0.5 text-[13px] leading-[1.6] text-ink-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      {/* Online exam sections */}
      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Step 1 in detail
          </p>
          <h2 className="serif mt-2 text-[26px] leading-[1.1] text-ink-950 sm:text-[30px]">
            The online exam has three sections
          </h2>
          <div className="mt-5 space-y-3">
            {ONLINE_SECTIONS.map((section, i) => (
              <div
                key={section.name}
                className="flex gap-4 rounded-xl border border-ink-200 bg-paper px-4 py-3.5 sm:px-5"
              >
                <span className="font-mono text-[12px] font-medium text-ink-500">{i + 1}</span>
                <div>
                  <p className="text-[14px] font-medium text-ink-950">{section.name}</p>
                  <p className="mt-0.5 text-[13px] leading-[1.6] text-ink-600">{section.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-[1.6] text-ink-600">
            Signup follows the intro page at ns.com/exam; NS asks you to link
            social media profiles as an anti-spam step.
          </p>
        </section>
      </FadeInOnView>

      {/* Topics and Schaum's */}
      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            The syllabus
          </p>
          <h2 className="serif mt-2 text-[26px] leading-[1.1] text-ink-950 sm:text-[30px]">
            Seven published topics
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-600">
            Each topic below is published on ns.com/exam along with NS&rsquo;s
            own recommended study resource, a Schaum&rsquo;s Outline per
            topic.
          </p>
          <div className="mt-5 space-y-2">
            {TOPICS.map((topic, i) => (
              <div
                key={topic.slug}
                className="rounded-xl border border-ink-200 bg-paper px-4 py-3.5 sm:px-5"
              >
                <div className="flex gap-4">
                  <span className="font-mono text-[12px] font-medium text-ink-500">{i + 1}</span>
                  <div>
                    <p className="text-[14px] font-medium text-ink-950">
                      {topic.name}
                      <span className="font-normal text-ink-600"> · {topic.scope}</span>
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                      NS recommends: {topic.schaums}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnView>

      {/* Trainer */}
      <FadeInOnView>
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            The trainer
          </p>
          <h2 className="serif mt-2 text-[26px] leading-[1.1] text-ink-950 sm:text-[30px]">
            Flashcards for the published topics
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-600">
            Practice concepts for the published topic list, not real or
            leaked exam questions. Every card is a standard textbook fact.
            Flip, self-grade, and a Leitner schedule decides when you see it
            again. Everything saves in your browser only.
          </p>
          <div className="mt-6">
            <ExamTrainer />
          </div>
        </section>
      </FadeInOnView>

      {/* Honesty note */}
      <FadeInOnView>
        <section className="mt-12 rounded-2xl border border-ink-200 bg-paper p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            What is published vs what is not
          </p>
          <div className="mt-3 space-y-3 text-[13px] leading-[1.7] text-ink-700">
            <p>
              <span className="font-medium text-ink-950">Published:</span>{" "}
              everything in the explainer above comes from{" "}
              <a
                href="https://ns.com/exam"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-ink-950"
              >
                ns.com/exam
              </a>
              , NS&rsquo;s public page for the open merit scholarship and
              job-placement exam run with Replit: the four-step ladder, the
              three online sections, the scholarship mechanics, and the seven
              topics with their recommended Schaum&rsquo;s Outlines.
            </p>
            <p>
              <span className="font-medium text-ink-950">Not published:</span>{" "}
              the Fellowship&rsquo;s own in-person Room exam specifics
              (questions, length, scoring, pass criteria) are not public
              anywhere. The in-person exam described on ns.com/exam matches
              the Room&rsquo;s public description (proctored, pen and paper,
              AI-proof), so this syllabus is the best available preparation
              proxy, but that is an inference, not a published fact.
            </p>
            <p>
              <span className="font-medium text-ink-950">This deck:</span>{" "}
              community-made and unaffiliated with Network School. The cards
              are textbook fundamentals for the published topic list, written
              for this site. They are not real, reconstructed, or leaked exam
              questions.
            </p>
          </div>
        </section>
      </FadeInOnView>
    </main>
  );
}
