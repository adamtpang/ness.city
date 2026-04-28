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
