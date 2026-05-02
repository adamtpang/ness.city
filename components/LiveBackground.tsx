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
      {/* Drifting orb mid-left */}
      <div
        className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #bfdbfe, rgba(191,219,254,0))",
          animation: "ness-drift-b 32s ease-in-out infinite alternate",
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
