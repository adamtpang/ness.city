import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-ember-400 to-ember-600" />
            <div className="absolute inset-[3px] rounded-[4px] bg-ink-950 flex items-center justify-center text-ember-400 text-[11px] font-bold tracking-tight">
              N
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-ink-50">ness</span>
            <span className="hidden sm:inline text-[11px] text-ink-500 font-mono">.city</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-[13px] text-ink-300 hover:bg-ink-800 hover:text-ink-50 transition-colors"
          >
            Problems
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-md px-3 py-1.5 text-[13px] text-ink-300 hover:bg-ink-800 hover:text-ink-50 transition-colors"
          >
            Citizens
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline rounded-md px-3 py-1.5 text-[13px] text-ink-300 hover:bg-ink-800 hover:text-ink-50 transition-colors"
          >
            About
          </Link>
          <Link
            href="/submit"
            className="ml-2 rounded-md bg-ember-500 px-3 py-1.5 text-[13px] font-medium text-ink-950 hover:bg-ember-400 transition-colors"
          >
            Surface a problem
          </Link>
        </nav>
      </div>
    </header>
  );
}
