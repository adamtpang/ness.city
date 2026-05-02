type Props = {
  className?: string;
  withWater?: boolean;
};

export function NessieLogo({ className, withWater = true }: Props) {
  return (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3 21
           Q5.5 13 8 21
           Q10.5 16 13 21
           Q15.5 18 17 14
           Q19 8 25 6.5
           Q31 5 33.5 9
           Q34 10 33 10.5
           Q31 11 29 10.7
           L26.5 10.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30.5" cy="8.6" r="0.9" fill="currentColor" />
      {withWater && (
        <path
          d="M2 24 Q8 22.5 14 24 T26 24 T38 24 T42 24"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
      )}
    </svg>
  );
}

export function NessieMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3 19
           Q5 13 7.5 19
           Q9.5 15 11.5 19
           Q13 16 14 13
           Q15.5 8 19.5 7
           Q23.5 6 25 9
           Q25.3 10 24.3 10.3
           Q22.5 10.7 21 10.5
           L19 10.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.4" cy="8.6" r="0.85" fill="currentColor" />
      <path
        d="M3 22 Q7 21 11 22 T19 22 T25 22"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Larger illustrated Nessie for hero / mascot uses. Filled shapes,
 * friendlier expression with a clear eye and a small smile. Designed for
 * t-shirts, plushies, "loch in" merch, and AI-assistant avatar slots.
 */
export function NessieMascot({
  className,
  primary = "currentColor",
  highlight = "#ffffff",
}: {
  className?: string;
  primary?: string;
  highlight?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Body silhouette: tail, three humps, neck, head */}
      <path
        fill={primary}
        d="
          M6 60
          C 4 56, 8 52, 14 53
          C 18 54, 21 58, 22 61
          C 24 53, 28 49, 32 49
          C 36 49, 40 53, 41 60
          C 43 53, 46 50, 50 50
          C 54 50, 57 53, 58 59
          C 60 51, 62 44, 67 38
          C 72 32, 80 26, 90 24
          C 100 22, 108 26, 109 33
          C 110 38, 106 41, 100 41
          C 96 41, 93 39, 91 38
          C 92 41, 91 44, 87 45
          C 84 46, 81 45, 79 42
          C 76 47, 71 51, 66 55
          C 62 58, 60 61, 59 65
          L 6 65
          Z
        "
      />

      {/* Eye highlight */}
      <circle cx="100" cy="32" r="2.2" fill={highlight} />
      <circle cx="100.4" cy="32.2" r="1.1" fill={primary} />

      {/* Tiny mouth curve */}
      <path
        d="M93 39 Q95 41 97 40"
        stroke={highlight}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Water lines, gentle */}
      <path
        d="M4 70 Q14 67 24 70 T44 70 T64 70 T84 70 T108 70 T118 70"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M2 75 Q12 73 22 75 T40 75 T60 75 T82 75 T106 75 T118 75"
        stroke={primary}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
        fill="none"
      />
    </svg>
  );
}
