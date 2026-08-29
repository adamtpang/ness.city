import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Ness",
  description:
    "Contact Adam Pang about Ness, report a public issue, or find the right path for a privacy or security concern.",
  alternates: { canonical: "/contact" },
};

const linkClass =
  "font-medium text-ink-950 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        Contact
      </p>
      <h1 className="serif mt-3 text-[48px] leading-[1.02] text-ink-950 sm:text-[60px]">
        Talk to the person operating Ness.
      </h1>
      <p className="mt-6 text-[17px] leading-[1.7] text-ink-700">
        Ness is an independent open-source project operated by Adam Pang. The
        project does not have a sales, support, or legal department; Adam
        reviews project questions, corrections, privacy requests, and security
        reports directly.
      </p>

      <div className="mt-12 space-y-4">
        <section className="rounded-2xl border border-ink-200 bg-paper p-6">
          <h2 className="serif text-[24px] text-ink-950">Public project issues</h2>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Bug reports, documentation corrections, and feature proposals can
            be opened in the public{" "}
            <a
              href="https://github.com/adamtpang/ness.city/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              ness.city issue tracker
            </a>
            . Do not include private messages, account identifiers, router
            labels, or other personal information in a public issue.
          </p>
        </section>

        <section className="rounded-2xl border border-ink-200 bg-paper p-6">
          <h2 className="serif text-[24px] text-ink-950">Private concerns</h2>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Privacy requests, removal requests, or sensitive security reports
            should use one of the current contact methods linked from{" "}
            <a
              href="https://adampang.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Adam Pang&apos;s public site
            </a>
            . Ness does not promise a response time, and no payment or support
            plan is required to raise a concern.
          </p>
        </section>

        <section className="rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <h2 className="serif text-[24px] text-ink-950">Before contacting</h2>
          <p className="mt-2 text-[14px] leading-[1.7] text-ink-700">
            Include the relevant ness.city URL and enough non-sensitive detail
            to reproduce the issue. For a data request, describe the browser,
            contribution, waitlist entry, or public profile involved because
            the anonymous rating system may not contain a name or email that
            identifies a device record.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-[13px]">
        <Link href="/privacy" className={linkClass}>
          Read the privacy notice
        </Link>
        <Link href="/about" className={linkClass}>
          About Ness
        </Link>
      </div>
    </main>
  );
}
