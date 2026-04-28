const palette = [
  "bg-[#1f2937] text-white",
  "bg-[#7c2d12] text-white",
  "bg-[#365314] text-white",
  "bg-[#831843] text-white",
  "bg-[#1e3a8a] text-white",
  "bg-[#581c87] text-white",
  "bg-[#0c4a6e] text-white",
  "bg-[#7c2d12] text-white",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function Avatar({
  initials,
  seed,
  size = 28,
}: {
  initials: string;
  seed: string;
  size?: number;
}) {
  const cls = palette[hash(seed) % palette.length];
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full font-medium ring-1 ring-paper ${cls}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
