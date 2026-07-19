"use client";

/**
 * Plain-language notice shown before a member's first rating (hard rule).
 * Says what's collected, who sees it, and that it's never shown to the
 * person being rated.
 */
export function ConsentNotice({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Before you start
      </p>
      <h2 className="serif mt-2 text-[26px] leading-tight text-ink-950">
        How this works, plainly.
      </h2>
      <ul className="mt-4 space-y-3 text-[14.5px] leading-[1.6] text-ink-700">
        <li className="flex gap-3">
          <span aria-hidden className="mt-[2px] text-ink-400">
            •
          </span>
          <span>
            You rate fellow members on four quick things: integrity,
            curiosity, creativity, and whether you&apos;d vouch for them. Every
            question has a &ldquo;haven&apos;t interacted enough&rdquo; default
            — only answer where you actually have a read.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-[2px] text-ink-400">
            •
          </span>
          <span>
            <strong className="font-medium text-ink-950">
              Nobody ever sees their own score, and nobody sees who rated them.
            </strong>{" "}
            Not now, not later. The person you rate never finds out what you
            said.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-[2px] text-ink-400">
            •
          </span>
          <span>
            Ratings feed an aggregate index that helps decide who&apos;s invited
            into longterm membership. Only the core team sees the full numbers
            and any notes you leave.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-[2px] text-ink-400">
            •
          </span>
          <span>
            It&apos;s anonymous to everyone but the core team, and it takes
            about ten seconds per person. Be honest.
          </span>
        </li>
      </ul>
      <button
        onClick={onAccept}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800 sm:w-auto"
      >
        Got it — start rating
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
