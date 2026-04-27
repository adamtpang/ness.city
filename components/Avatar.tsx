const palette = [
  "from-ember-500 to-ember-600",
  "from-violet-500 to-violet-700",
  "from-cyan-500 to-cyan-700",
  "from-pink-500 to-pink-700",
  "from-emerald-500 to-emerald-700",
  "from-blue-500 to-blue-700",
  "from-rose-500 to-rose-700",
  "from-amber-500 to-amber-700",
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
  const grad = palette[hash(seed) % palette.length];
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-[10px] font-semibold text-ink-950 ring-1 ring-ink-950`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
