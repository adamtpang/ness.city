import type { Metadata } from "next";
import { WaitlistForm } from "@/components/WaitlistForm";
import { isDbConfigured } from "@/lib/db";
import { ensureWaitlistTable, waitlistCount } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join Ness",
  description:
    "Sign up to help surface and solve problems for Network School and Ness.",
};

export default async function JoinPage() {
  let count = 0;
  if (isDbConfigured) {
    try {
      await ensureWaitlistTable();
      count = await waitlistCount();
    } catch {
      count = 0;
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
            Join the engine
          </p>
          <h1 className="serif mt-3 text-[46px] leading-[1.0] text-ink-950 sm:text-[68px]">
            Add value to NS and Ness.
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-[1.6] text-ink-700">
            Ness is how the community surfaces its real problems and solves them
            together. Tell us what you would build or fix, and we will bring you
            in as the engine opens up.
          </p>
          <div className="mt-8">
            <WaitlistForm initialCount={count} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="rounded-3xl border border-ink-200 bg-paper p-6 shadow-[0_24px_60px_-30px_rgba(10,10,10,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr-join.svg"
              alt="Scan to join Ness"
              width={300}
              height={300}
              className="h-[300px] w-[300px]"
            />
          </div>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-500">
            Scan to join · ness.city/join
          </p>
        </div>
      </div>
    </main>
  );
}
