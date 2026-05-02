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
      {/* Drifting orb top-right */}
      <div
        className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #93c5fd, rgba(147,197,253,0))",
          animation: "ness-drift-a 24s ease-in-out infinite alternate",
        }}
      />
      {/* Drifting orb mid-left, blue */}
      <div
        className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #bfdbfe, rgba(191,219,254,0))",
          animation: "ness-drift-b 32s ease-in-out infinite alternate",
        }}
      />
      {/* Solarpunk green orb, lower-right, slow drift */}
      <div
        className="absolute -right-32 bottom-32 h-[460px] w-[460px] rounded-full opacity-[0.13] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #bbf7d0, rgba(187,247,208,0))",
          animation: "ness-drift-c 38s ease-in-out infinite alternate",
        }}
      />
      {/* Sun glow at top — optimistic city horizon */}
      <div
        className="absolute left-1/2 -top-40 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #fef3c7, rgba(254,243,199,0))",
          animation: "ness-drift-d 44s ease-in-out infinite alternate",
        }}
      />
      {/* Loch waves at the bottom */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[120px] w-full opacity-[0.18]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 80 C 240 60 480 100 720 80 S 1200 60 1440 80 L 1440 120 L 0 120 Z"
          fill="#bfdbfe"
        />
        <path
          d="M0 95 C 240 75 480 115 720 95 S 1200 75 1440 95 L 1440 120 L 0 120 Z"
          fill="#dbeafe"
          style={{ animation: "ness-wave 14s ease-in-out infinite alternate" }}
        />
      </svg>
    </div>
  );
}
