/**
 * Subtle live background. Two slow-drifting blue gradient orbs +
 * a faint animated wave at the very bottom. Stays out of the way.
 */
export function LiveBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Drifting blue orb top-right (loch) */}
      <div
        className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #93c5fd, rgba(147,197,253,0))",
          animation: "ness-drift-a 24s ease-in-out infinite alternate",
        }}
      />
      {/* Drifting blue orb mid-left */}
      <div
        className="absolute -left-40 top-1/3 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #bfdbfe, rgba(191,219,254,0))",
          animation: "ness-drift-b 32s ease-in-out infinite alternate",
        }}
      />
      {/* Solarpunk green orb, lower-right */}
      <div
        className="absolute -right-32 bottom-24 h-[520px] w-[520px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #bbf7d0, rgba(187,247,208,0))",
          animation: "ness-drift-c 38s ease-in-out infinite alternate",
        }}
      />
      {/* Sun glow top-center, optimistic city horizon */}
      <div
        className="absolute left-1/2 -top-40 h-[680px] w-[680px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #fef3c7, rgba(254,243,199,0))",
          animation: "ness-drift-d 44s ease-in-out infinite alternate",
        }}
      />
      {/* Second green orb mid-bottom-left */}
      <div
        className="absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #86efac, rgba(134,239,172,0))",
          animation: "ness-drift-c 30s ease-in-out infinite alternate-reverse",
        }}
      />
      {/* Loch waves at the bottom */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[140px] w-full opacity-50"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 90 C 240 70 480 110 720 90 S 1200 70 1440 90 L 1440 140 L 0 140 Z"
          fill="#bfdbfe"
        />
        <path
          d="M0 110 C 240 90 480 130 720 110 S 1200 90 1440 110 L 1440 140 L 0 140 Z"
          fill="#93c5fd"
          opacity="0.8"
          style={{ animation: "ness-wave 14s ease-in-out infinite alternate" }}
        />
      </svg>
    </div>
  );
}
