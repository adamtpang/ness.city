const FORM_URL = "https://forms.gle/GFZkLWmvC8CrBkW38";
const FORM_LABEL = "forms.gle/GFZkLWmvC8CrBkW38";
const WHATSAPP_URL = "https://wa.me/16716862020";

/**
 * The CTA card, shared by /join and /waitlist. One QR to the Google Form,
 * the form link shown in full so people can read or copy it, and a WhatsApp
 * line to reach Adam. No database, nothing to break.
 */
export function JoinCard() {
  return (
    <main className="mx-auto flex min-h-[82vh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
        Join the engine
      </p>
      <h1 className="serif mt-3 text-[44px] leading-[1.0] text-ink-950 sm:text-[60px]">
        Add value to NS and Ness.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-ink-700">
        Looking for open sourcerers, patrons, and solvers. Scan or tap to join
        the beta.
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
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
      >
        Open the form <span aria-hidden>→</span>
      </a>
      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 font-mono text-[12.5px] text-ink-500 underline underline-offset-4 hover:text-ink-950"
      >
        {FORM_LABEL}
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 text-[13px] text-ink-600 transition-colors hover:text-ink-950"
      >
        <span aria-hidden>💬</span> Questions? Message Adam on WhatsApp
      </a>
    </main>
  );
}
