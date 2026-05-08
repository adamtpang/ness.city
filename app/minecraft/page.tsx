import Link from "next/link";
import { isMinecraftLive, minecraft } from "@/lib/minecraft";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

export default function MinecraftPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Server
          </p>
          <h1 className="serif mt-2 text-[52px] leading-[1.02] text-ink-950 sm:text-[68px]">
            Minecraft.
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-[1.55] text-ink-600 sm:text-[17px]">
            A community Minecraft server. Build, mine, swim in the loch. The
            cube version of Ness. Bring Tim.
          </p>
        </div>
      </FadeIn>

      {isMinecraftLive ? (
        <FadeIn delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/40">
            <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-900">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Server live
              </span>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Server address
                </p>
                <p className="mt-1.5 break-all font-mono text-[20px] text-ink-950 sm:text-[24px]">
                  {minecraft.serverHost}
                  {minecraft.port !== 25565 && `:${minecraft.port}`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Edition
                  </p>
                  <p className="mt-1 text-[14.5px] text-ink-950">
                    {minecraft.edition} Edition
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Version
                  </p>
                  <p className="mt-1 font-mono text-[14.5px] text-ink-950">
                    {minecraft.version}
                  </p>
                </div>
              </div>
              <p className="text-[14px] leading-[1.65] text-ink-700">
                {minecraft.vibe}
              </p>
            </div>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50/60 p-6">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-900">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Server is being set up
            </span>
            <h2 className="serif mt-3 text-[22px] leading-tight text-ink-950">
              Spinning it up. Drop your Minecraft handle in the meantime.
            </h2>
            <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
              Once the server is live, the address goes here. Currently
              targeting Java Edition {minecraft.version}, vanilla survival,
              friendly. No PvP unless we vote it in.
            </p>
            <Link
              href={minecraft.community.href}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
            >
              {minecraft.community.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeIn>
      )}

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            How to join
          </p>
          <ol className="mt-4 space-y-4 text-[14.5px] leading-[1.7] text-ink-700">
            <li>
              <span className="serif text-ink-400">01.</span> Open Minecraft{" "}
              {minecraft.edition} Edition, version{" "}
              <span className="font-mono">{minecraft.version}</span>.
            </li>
            <li>
              <span className="serif text-ink-400">02.</span> Multiplayer →
              Add Server → paste the address above.
            </li>
            <li>
              <span className="serif text-ink-400">03.</span> Join. Don&apos;t
              break Tim&apos;s house. Be excellent to each other.
            </li>
          </ol>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-8 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Hosting setup
          </p>
          <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
            How we provisioned this
          </h3>
          <ul className="mt-3 space-y-3 text-[13.5px] leading-[1.65] text-ink-700">
            <li className="flex gap-3">
              <span className="font-mono text-ink-400">·</span>
              <span>
                <strong>Cheapest:</strong>{" "}
                <a
                  href="https://aternos.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-950 underline-offset-4 hover:underline"
                >
                  Aternos
                </a>
                . Free, sleeps when no players. Good for a 5-friend group.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-ink-400">·</span>
              <span>
                <strong>Cheap and reliable:</strong> Mojang{" "}
                <a
                  href="https://www.minecraft.net/realms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-950 underline-offset-4 hover:underline"
                >
                  Realms
                </a>
                , $7.99/mo, no setup, official.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-ink-400">·</span>
              <span>
                <strong>Self-host:</strong> a $5/mo Hetzner CX22 runs a
                small server fine. Use{" "}
                <a
                  href="https://github.com/itzg/docker-minecraft-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-950 underline-offset-4 hover:underline"
                >
                  itzg/docker-minecraft-server
                </a>{" "}
                to skip the manual setup.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-[13px] text-ink-500">
            Once provisioned, update <span className="font-mono">lib/minecraft.ts</span>{" "}
            with the server hostname and redeploy. The page flips from{" "}
            &ldquo;being set up&rdquo; to live automatically.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to the city
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/whatsapp"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Browse interest groups
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}
