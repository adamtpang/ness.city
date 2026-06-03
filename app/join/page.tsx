import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Ness",
  description: "Scan to join Ness. Open sourcerers, patrons, and solvers.",
};

const FORM_URL = "https://forms.gle/GFZkLWmvC8CrBkW38";

/**
 * The CTA page: one QR that leads to the Google Form. No database, nothing
 * to break on stage. Tapping the code (or the link) also opens the form on
 * desktop.
 */
export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-[82vh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
        Join the engine
      </p>
      <h1 className="serif mt-3 text-[44px] leading-[1.0] text-ink-950 sm:text-[60px]">
        Add value to NS and Ness.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-ink-700">
        Looking for open sourcerers, patrons, and solvers. Scan to join the beta.
      </p>

      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 rounded-3xl border border-ink-200 bg-paper p-6 shadow-[0_24px_60px_-30px_rgba(10,10,10,0.4)] transition-transform hover:scale-[1.02]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/qr-join.svg"
          alt="Scan to join Ness"
          width={300}
          height={300}
          className="h-[300px] w-[300px]"
        />
      </a>

      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-500 underline-offset-4 hover:text-ink-950 hover:underline"
      >
        Scan or tap to join →
      </a>
    </main>
  );
}
