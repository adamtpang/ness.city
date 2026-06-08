import type { Metadata } from "next";
import Link from "next/link";
import { minecraft, isMinecraftLive } from "@/lib/minecraft";

export const metadata: Metadata = {
  title: "Games · Ness",
  description: "Where the Network School community plays together. Starting with Minecraft.",
};

export default function GamesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
        Games
      </p>
      <h1 className="serif mt-2 text-[46px] leading-[1.02] text-ink-950 sm:text-[60px]">
        Play together.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-700">
        Where the community blows off steam after the work is shipped. First up
        is Minecraft. More to come.
      </p>

      {/* Minecraft */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-paper-tint px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[20px] leading-none" aria-hidden>⛏️</span>
            <span className="serif text-[20px] text-ink-950">Minecraft</span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
              isMinecraftLive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isMinecraftLive ? "bg-emerald-500" : "bg-amber-500"
              }`}
              aria-hidden
            />
            {isMinecraftLive ? "Live" : "Being set up"}
          </span>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p className="text-[14px] text-ink-700">
            Hosted by <span className="font-medium text-ink-950">{minecraft.host}</span>.{" "}
            {minecraft.vibe}
          </p>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Edition" value={minecraft.edition} />
            <Field label="Version" value={minecraft.version} />
            <Field
              label="Address"
              value={isMinecraftLive ? minecraft.serverHost : "Coming soon"}
              mono
            />
          </dl>

          <div className="rounded-xl border border-dashed border-ink-300 bg-paper-tint p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
              Entry criteria
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-700">
              {minecraft.entryCriteria ||
                "Coming soon. Being finalized with the host, who decides who gets in and why."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/minecraft"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              How to join <span aria-hidden>→</span>
            </Link>
            <Link
              href={minecraft.community.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
            >
              {minecraft.community.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for more */}
      <section className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-paper-tint p-6 text-center">
        <p className="text-[14px] text-ink-600">More games coming.</p>
        <p className="mt-1 text-[12.5px] text-ink-400">
          Want to run one for the community? Surface it on the board and rally a few players.
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
        {label}
      </dt>
      <dd className={`mt-0.5 text-[14px] text-ink-950 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
