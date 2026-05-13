"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type DirectoryProfile = {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: string | null;
  location: string | null;
};

type Props = {
  /** Disabled when all rings are full. */
  disabled?: boolean;
  /** Called when the user picks a profile or enters a free-text name. */
  onPick: (value: { handle: string; displayName: string }) => void;
  /** Optional handles to grey out (already in this ring). */
  excludeHandles?: Set<string>;
  placeholder?: string;
  autoFocus?: boolean;
};

/**
 * Autocomplete picker over /api/directory/search. Falls back to free-text
 * submission when nothing matches or the directory is empty. Enter key adds
 * the highlighted result, or the typed text if no results.
 */
export function DirectoryPicker({
  disabled,
  onPick,
  excludeHandles,
  placeholder = "Name or handle",
  autoFocus,
}: Props) {
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState<DirectoryProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reqIdRef = useRef(0);

  // Debounced fetch.
  useEffect(() => {
    const q = draft.trim();
    if (q.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const id = ++reqIdRef.current;
      try {
        const res = await fetch(`/api/directory/search?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { ok?: boolean; results?: DirectoryProfile[] };
        // Stale request guard.
        if (id !== reqIdRef.current) return;
        const next = (data.results ?? []).filter(
          (r) => !excludeHandles?.has(r.handle.toLowerCase()),
        );
        setResults(next);
        setHighlight(0);
      } catch {
        if (id === reqIdRef.current) setResults([]);
      } finally {
        if (id === reqIdRef.current) setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [draft, excludeHandles]);

  // Click-outside to close.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function commit(profile?: DirectoryProfile) {
    if (profile) {
      onPick({ handle: profile.handle, displayName: profile.displayName });
    } else {
      const text = draft.trim();
      if (!text) return;
      // Free-text fallback: derive a handle.
      const handle = text
        .toLowerCase()
        .replace(/^@/, "")
        .replace(/[^a-z0-9._-]+/g, "")
        .slice(0, 40);
      onPick({ handle: handle || text.toLowerCase(), displayName: text });
    }
    setDraft("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && results[highlight]) commit(results[highlight]);
      else commit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && draft.trim().length > 0 && (loading || results.length > 0);

  return (
    <div ref={wrapRef} className="relative flex flex-1 gap-2">
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="flex-1 rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none disabled:opacity-50"
      />
      <button
        onClick={() => commit(results[highlight])}
        disabled={disabled || !draft.trim()}
        className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40 disabled:hover:bg-ink-950"
      >
        Add
        <span aria-hidden>↵</span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-[88px] top-full z-30 mt-1 overflow-hidden rounded-xl border border-ink-200 bg-paper shadow-lg"
          >
            {loading && results.length === 0 ? (
              <div className="px-3 py-2.5 text-[12px] text-ink-500">searching...</div>
            ) : results.length === 0 ? (
              <div className="px-3 py-2.5 text-[12px] text-ink-500">
                No match. Press Enter to add as free-text.
              </div>
            ) : (
              <ul className="max-h-72 overflow-y-auto">
                {results.map((r, i) => (
                  <li key={r.handle}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        commit(r);
                      }}
                      onMouseEnter={() => setHighlight(i)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                        i === highlight ? "bg-paper-tint" : "bg-paper"
                      }`}
                    >
                      <DirAvatar profile={r} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-ink-950">
                          {r.displayName}
                        </div>
                        <div className="truncate font-mono text-[11px] text-ink-500">
                          @{r.handle}
                          {r.role ? ` · ${r.role}` : ""}
                          {r.location ? ` · ${r.location}` : ""}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DirAvatar({ profile }: { profile: DirectoryProfile }) {
  if (profile.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarUrl}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 flex-none rounded-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  const initials = profile.displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink-100 font-mono text-[10px] text-ink-700">
      {initials}
    </div>
  );
}
