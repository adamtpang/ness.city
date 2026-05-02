/**
 * Solarpunk skyline. SVG vector composition: sun + curved horizon +
 * stylized towers wrapped in vines + a shy Nessie crest in the loch
 * below. Visible, tasteful, ties together the green/blue palette.
 *
 * Designed to slot under a hero with `mt-14`. Scales with the viewport;
 * the SVG itself is responsive.
 */
export function SolarpunkSkyline({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-ink-200 bg-paper ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 800 280"
        className="block h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft sky gradient background */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#dbeafe" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="loch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#172554" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#facc15" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="280" fill="url(#sky)" />

        {/* Sun glow */}
        <circle cx="600" cy="78" r="120" fill="url(#sun)" />
        <circle cx="600" cy="78" r="36" fill="#fde68a" opacity="0.95" />

        {/* Distant clouds */}
        <ellipse cx="120" cy="56" rx="60" ry="6" fill="#ffffff" opacity="0.85" />
        <ellipse cx="180" cy="64" rx="40" ry="4" fill="#ffffff" opacity="0.75" />
        <ellipse cx="700" cy="42" rx="50" ry="5" fill="#ffffff" opacity="0.85" />

        {/* Background hills */}
        <path
          d="M0 200 Q 120 160, 240 180 T 480 180 T 720 170 L 800 175 L 800 220 L 0 220 Z"
          fill="#22c55e"
          opacity="0.18"
        />
        <path
          d="M0 215 Q 140 185, 280 200 T 560 195 T 800 200 L 800 230 L 0 230 Z"
          fill="#16a34a"
          opacity="0.22"
        />

        {/* Towers (left cluster) wrapped in vines */}
        <g>
          {/* Tower A */}
          <rect
            x="80"
            y="120"
            width="40"
            height="100"
            rx="6"
            fill="#0a0a0a"
            opacity="0.82"
          />
          {[140, 160, 180, 200].map((y) => (
            <rect
              key={`a-${y}`}
              x="86"
              y={y}
              width="6"
              height="6"
              fill="#fde68a"
              opacity="0.9"
            />
          ))}
          {[140, 160, 180, 200].map((y) => (
            <rect
              key={`a2-${y}`}
              x="106"
              y={y}
              width="6"
              height="6"
              fill="#fde68a"
              opacity="0.9"
            />
          ))}
          {/* Vines on tower A */}
          <path
            d="M120 130 Q 130 150, 122 170 Q 114 185, 124 200 Q 132 215, 122 220"
            stroke="#16a34a"
            strokeWidth="2"
            fill="none"
          />
          {[140, 165, 195].map((y, i) => (
            <ellipse
              key={`la-${i}`}
              cx={i % 2 === 0 ? 128 : 118}
              cy={y}
              rx="4"
              ry="2.5"
              fill="#16a34a"
              transform={`rotate(${i * 25} ${i % 2 === 0 ? 128 : 118} ${y})`}
            />
          ))}

          {/* Tower B (taller, dome top) */}
          <rect
            x="140"
            y="80"
            width="48"
            height="140"
            rx="6"
            fill="#0a0a0a"
            opacity="0.88"
          />
          <ellipse cx="164" cy="80" rx="28" ry="14" fill="#16a34a" opacity="0.7" />
          <ellipse cx="164" cy="76" rx="20" ry="10" fill="#22c55e" opacity="0.8" />
          {[100, 120, 140, 160, 180, 200].map((y) => (
            <g key={`b-${y}`}>
              <rect
                x="148"
                y={y}
                width="6"
                height="6"
                fill="#fde68a"
                opacity={y < 140 ? 0.95 : 0.85}
              />
              <rect
                x="172"
                y={y}
                width="6"
                height="6"
                fill="#fde68a"
                opacity={y < 140 ? 0.95 : 0.85}
              />
            </g>
          ))}
          <path
            d="M188 95 Q 200 130, 184 160 Q 170 185, 186 215"
            stroke="#16a34a"
            strokeWidth="2"
            fill="none"
          />
          {[110, 145, 180, 205].map((y, i) => (
            <ellipse
              key={`lb-${i}`}
              cx={i % 2 === 0 ? 196 : 178}
              cy={y}
              rx="5"
              ry="3"
              fill="#16a34a"
              transform={`rotate(${i * 30 + 15} ${i % 2 === 0 ? 196 : 178} ${y})`}
            />
          ))}
        </g>

        {/* Treehouse / dome cluster (center) */}
        <g>
          <ellipse cx="340" cy="200" rx="55" ry="12" fill="#16a34a" opacity="0.4" />
          <path
            d="M285 200 Q 285 150, 340 150 Q 395 150, 395 200 Z"
            fill="#22c55e"
            opacity="0.92"
          />
          <path
            d="M295 200 Q 295 158, 340 158 Q 385 158, 385 200 Z"
            fill="#16a34a"
            opacity="0.85"
          />
          <rect x="328" y="178" width="14" height="22" fill="#0a0a0a" opacity="0.85" />
          <circle cx="320" cy="172" r="4" fill="#fde68a" opacity="0.95" />
          <circle cx="360" cy="172" r="4" fill="#fde68a" opacity="0.95" />
          <circle cx="340" cy="160" r="4" fill="#fde68a" opacity="0.95" />
          {/* Trunk */}
          <rect x="334" y="200" width="12" height="20" fill="#92400e" opacity="0.85" />
        </g>

        {/* Right tower with antenna */}
        <g>
          <rect
            x="500"
            y="100"
            width="34"
            height="120"
            rx="4"
            fill="#0a0a0a"
            opacity="0.82"
          />
          {[120, 140, 160, 180, 200].map((y) => (
            <rect
              key={`c-${y}`}
              x="506"
              y={y}
              width="6"
              height="6"
              fill="#fde68a"
              opacity="0.9"
            />
          ))}
          {[120, 140, 160, 180, 200].map((y) => (
            <rect
              key={`c2-${y}`}
              x="522"
              y={y}
              width="6"
              height="6"
              fill="#fde68a"
              opacity="0.9"
            />
          ))}
          <line x1="517" y1="100" x2="517" y2="78" stroke="#0a0a0a" strokeWidth="1.5" />
          <circle cx="517" cy="76" r="3" fill="#facc15" />
          {/* Vine */}
          <path
            d="M534 110 Q 540 135, 530 160 Q 520 185, 532 215"
            stroke="#16a34a"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Loch (water) */}
        <path d="M0 220 L 800 220 L 800 280 L 0 280 Z" fill="url(#loch)" />

        {/* Ripples */}
        <path
          d="M40 240 Q 100 235, 160 240 T 280 240 T 400 240 T 520 240 T 640 240 T 760 240"
          stroke="#bfdbfe"
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M0 256 Q 80 250, 160 256 T 320 256 T 480 256 T 640 256 T 800 256"
          stroke="#bfdbfe"
          strokeWidth="0.9"
          fill="none"
          opacity="0.3"
        />

        {/* Nessie surfacing in the loch */}
        <g transform="translate(420, 226)">
          <path
            d="M0 14 Q 8 4 16 14 Q 22 8 28 14 Q 32 9 38 12 L 50 18"
            stroke="#172554"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />
          <circle cx="48" cy="14" r="1.5" fill="#fde68a" />
          {/* Splash */}
          <path
            d="M-4 18 Q 8 13 22 18 T 50 18"
            stroke="#bfdbfe"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
        </g>

        {/* Tiny boat */}
        <g transform="translate(700, 240)">
          <path d="M0 0 L 24 0 L 20 6 L 4 6 Z" fill="#0a0a0a" opacity="0.8" />
          <line x1="12" y1="0" x2="12" y2="-12" stroke="#0a0a0a" strokeWidth="1" />
          <path d="M12 -12 L 22 -2 L 12 -2 Z" fill="#bfdbfe" />
        </g>
      </svg>
    </div>
  );
}
