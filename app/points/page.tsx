"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  formatNumber,
  formatUsd,
  impliedUsdValue,
  pointsForId,
  POINTS_EPOCH_1_AWARD,
  POINTS_EPOCH_1_LIMIT,
  POINTS_TOTAL_SUPPLY_BASE,
  vestedFractionFromYears,
} from "@/lib/points";
import { InfoModal } from "@/components/InfoModal";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

const VALUATION_STEPS: { label: string; usd: number; note: string }[] = [
  { label: "Conservative", usd: 50_000_000, note: "Real estate + ops today" },
  { label: "Mid", usd: 500_000_000, note: "Mature campus, healthy revenue" },
  { label: "Bullish", usd: 5_000_000_000, note: "Network State scale" },
  { label: "Wild", usd: 50_000_000_000, note: "Generational outcome" },
];

export default function PointsPage() {
  const [id, setId] = useState(100);
  const [valuationUsd, setValuationUsd] = useState(500_000_000);
  const [totalLongtermers, setTotalLongtermers] = useState(500);
  const [yearsElapsed, setYearsElapsed] = useState(4);

  const result = useMemo(
    () =>
      impliedUsdValue({
        id,
        nsValuationUsd: valuationUsd,
        totalLongtermers,
        yearsElapsed,
      }),
    [id, valuationUsd, totalLongtermers, yearsElapsed],
  );

  // For the timeline preview at fixed milestones
  const timeline = [1, 2, 3, 4].map((y) => {
    const v = vestedFractionFromYears(y);
    return {
      year: y,
      pct: v * 100,
      usd: result.nominalUsd * v,
    };
  });

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-12">
      <FadeIn>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Points Vault
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[60px]">
            What are your points worth?
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-[1.55] text-ink-600 sm:text-[16.5px]">
            A free calculator for NS longtermer points. Move the dials.
            See the implied USD value at different valuations and vesting
            states.
          </p>
        </div>
      </FadeIn>

      {/* Hero result card */}
      <FadeIn delay={0.1}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-950 bg-ink-950 p-6 text-paper sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
              For NS ID #{id} at {formatUsd(valuationUsd)} valuation, year {yearsElapsed}
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
                Vested USD value
              </p>
              <p className="serif mt-1 text-[40px] leading-none tabular-nums sm:text-[52px]">
                {formatUsd(result.vestedUsd)}
              </p>
              <p className="mt-1 text-[12px] text-ink-300">
                {result.vestedPct.toFixed(0)}% vested · nominal{" "}
                {formatUsd(result.nominalUsd)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
                Your points
              </p>
              <p className="serif mt-1 text-[28px] leading-tight tabular-nums">
                {formatNumber(result.yourPoints)}
              </p>
              <p className="mt-1 text-[12px] text-ink-300">
                {result.sharePct.toFixed(3)}% of total ·{" "}
                {formatNumber(result.totalPoints)} outstanding
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <InfoModal
              trigger="How is this calculated?"
              title="The formula"
            >
              <div className="space-y-4 text-[14.5px] leading-[1.7] text-ink-800">
                <p>The math is documented publicly on ns.com/longterm.</p>
                <div className="rounded-xl bg-paper-tint p-4">
                  <p className="font-mono text-[12px] text-ink-500">
                    Epoch 1 (first 64 longtermers)
                  </p>
                  <p className="mt-2 font-mono text-[14px] text-ink-950">
                    points(n) = 2<sup>24</sup> = {formatNumber(POINTS_EPOCH_1_AWARD)}
                  </p>
                </div>
                <div className="rounded-xl bg-paper-tint p-4">
                  <p className="font-mono text-[12px] text-ink-500">
                    After NS ID #{POINTS_EPOCH_1_LIMIT}
                  </p>
                  <p className="mt-2 font-mono text-[14px] text-ink-950">
                    points(n) = ⌊2<sup>30</sup> / n⌋
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-ink-500">
                    where 2<sup>30</sup> = {formatNumber(POINTS_TOTAL_SUPPLY_BASE)}
                  </p>
                </div>
                <p>
                  Every time the longtermer base doubles, the per-person
                  reward halves. So the early IDs get exponentially more.
                </p>
                <p>
                  USD value here is implied:{" "}
                  <em>(your share of total points) × (NS valuation) × (vested fraction)</em>.
                  The valuation slider is your guess. The total-longtermer
                  slider lets you stress-test dilution.
                </p>
              </div>
            </InfoModal>
            <InfoModal trigger="Vesting schedule" title="The vesting curve">
              <div className="space-y-4 text-[14.5px] leading-[1.7] text-ink-800">
                <p>
                  One-year cliff, four-year vest. Same shape Google early
                  employees had.
                </p>
                <ul className="space-y-2">
                  <li>
                    <span className="font-mono text-[12px] text-ink-500">
                      Months 0-11:
                    </span>{" "}
                    nothing vests.
                  </li>
                  <li>
                    <span className="font-mono text-[12px] text-ink-500">
                      Month 12:
                    </span>{" "}
                    1/4 (25%) vests on the cliff.
                  </li>
                  <li>
                    <span className="font-mono text-[12px] text-ink-500">
                      Months 13-48:
                    </span>{" "}
                    additional 1/48 vests each month.
                  </li>
                  <li>
                    <span className="font-mono text-[12px] text-ink-500">
                      Month 48+:
                    </span>{" "}
                    100% vested.
                  </li>
                </ul>
              </div>
            </InfoModal>
            <InfoModal trigger="Precedents" title="Why this could work">
              <div className="space-y-4 text-[14.5px] leading-[1.7] text-ink-800">
                <p>
                  The official thesis (per ns.com/longterm) cites three
                  precedents:
                </p>
                <ul className="space-y-3">
                  <li>
                    <strong>Google equity.</strong> Early holders did
                    extraordinarily well. The early ID/vest mechanic
                    deliberately echoes that.
                  </li>
                  <li>
                    <strong>Shenzhen real estate.</strong> Early buyers
                    captured the upside as the place became valuable.
                    Same story for early NS land.
                  </li>
                  <li>
                    <strong>USDC (Balaji-adjacent track record).</strong> A
                    successful track record of taking abstract financial
                    primitives to mainstream value.
                  </li>
                </ul>
                <p className="text-ink-700">
                  All three are speculative parallels, not guarantees. NS
                  Points are currently a non-transferable loyalty reward.
                  Conversion to financial value depends on the legal mechanism.
                </p>
              </div>
            </InfoModal>
            <InfoModal trigger="Disclaimer" title="What this is not">
              <div className="space-y-4 text-[14.5px] leading-[1.7] text-ink-800">
                <p>
                  This page is a community calculator, not a financial
                  product. NS Points are{" "}
                  <strong>currently a non-transferable loyalty reward</strong> per
                  ns.com/longterm. The implied USD value is a thought experiment.
                </p>
                <p>
                  &ldquo;Early holders of points might do very well, *if* we
                  can figure out the legal mechanism.&rdquo; (NS&apos;s own
                  framing.)
                </p>
                <p>
                  Ness is an independent project, not affiliated with
                  Network School. Numbers shown are user-input scenarios.
                  Don&apos;t make life decisions on a slider.
                </p>
              </div>
            </InfoModal>
          </div>
        </div>
      </FadeIn>

      {/* Dials */}
      <FadeIn delay={0.16}>
        <div className="mt-8 grid gap-4">
          <Dial
            label="Your NS ID"
            value={id}
            min={1}
            max={1000}
            step={1}
            display={`#${id}`}
            note={
              id <= POINTS_EPOCH_1_LIMIT
                ? `Epoch 1 longtermer · ${formatNumber(POINTS_EPOCH_1_AWARD)} pts`
                : `Post-Epoch · ${formatNumber(pointsForId(id))} pts`
            }
            onChange={setId}
          />
          <ValuationDial value={valuationUsd} onChange={setValuationUsd} />
          <Dial
            label="Total longtermers"
            value={totalLongtermers}
            min={64}
            max={5000}
            step={10}
            display={formatNumber(totalLongtermers)}
            note={`Affects total points outstanding · your share dilutes as more join`}
            onChange={setTotalLongtermers}
          />
          <Dial
            label="Years from joining"
            value={yearsElapsed}
            min={0}
            max={6}
            step={0.25}
            display={`${yearsElapsed.toFixed(2)} yr`}
            note={`${(vestedFractionFromYears(yearsElapsed) * 100).toFixed(1)}% vested`}
            onChange={setYearsElapsed}
          />
        </div>
      </FadeIn>

      {/* Timeline */}
      <FadeInOnView>
        <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          <div className="border-b border-ink-200 bg-paper-tint px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Vesting timeline at the current valuation
            </p>
            <h2 className="serif mt-1 text-[20px] leading-tight text-ink-950">
              Year by year, {formatUsd(valuationUsd)} valuation, NS ID #{id}
            </h2>
          </div>
          <ol className="divide-y divide-ink-100">
            {timeline.map((t) => (
              <li
                key={t.year}
                className="grid grid-cols-12 items-center gap-4 px-5 py-4"
              >
                <div className="col-span-2 font-mono text-[12px] text-ink-500">
                  Year {t.year}
                </div>
                <div className="col-span-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-ink-950"
                    />
                  </div>
                </div>
                <div className="col-span-1 text-right text-[12px] tabular-nums text-ink-500">
                  {t.pct.toFixed(0)}%
                </div>
                <div className="col-span-3 text-right serif text-[18px] tabular-nums text-ink-950">
                  {formatUsd(t.usd)}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </FadeInOnView>

      {/* What this is */}
      <FadeInOnView>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Card title="What NS Points are">
            <p>
              A non-transferable loyalty reward for NS longtermers. Issued by
              NS Points formula on ID assignment, vested over four years
              with a one-year cliff. Documented on ns.com/longterm.
            </p>
          </Card>
          <Card title="Why early IDs matter">
            <p>
              Every time the longtermer base doubles, the reward halves. ID
              #1 gets 16.7M points. ID #64 also gets 16.7M (epoch 1). ID
              #128 gets 8.4M. ID #256 gets 4.2M. Early conviction is paid
              for.
            </p>
          </Card>
          <Card title="Hold tight, not sell tight">
            <p>
              Vesting punishes leaving early and rewards staying. One year
              gets you 25%. Four years gets you 100%. The math says: stay
              if you want the upside.
            </p>
          </Card>
          <Card title="Where the value comes from">
            <p>
              Today: speculative. Long term: real estate, operating
              companies, fund equity, treasury reserves, and any token
              that gets attached. The slider is a thought experiment, not
              a promise.
            </p>
          </Card>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            More on /longterm
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            The official source for everything points-related is{" "}
            <a
              href="https://ns.com/longterm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-4 hover:underline"
            >
              ns.com/longterm
            </a>
            . This page is a community-run calculator that mirrors that
            math.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to the city
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            How Ness works
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function Dial({
  label,
  value,
  min,
  max,
  step,
  display,
  note,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  note?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          {label}
        </label>
        <span className="serif text-[22px] tabular-nums text-ink-950">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full cursor-pointer accent-nessie-600"
      />
      {note && (
        <p className="mt-2 text-[12px] text-ink-500">{note}</p>
      )}
    </div>
  );
}

function ValuationDial({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  // log scale across $10M..$50B
  const minLog = Math.log10(10_000_000);
  const maxLog = Math.log10(50_000_000_000);
  const logVal = Math.log10(Math.max(10_000_000, value));

  const activePreset = VALUATION_STEPS.find((p) => p.usd === value);

  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700">
          NS valuation (USD)
        </label>
        <span className="serif text-[22px] tabular-nums text-ink-950">
          {formatUsd(value)}
        </span>
      </div>
      <input
        type="range"
        min={minLog}
        max={maxLog}
        step={0.01}
        value={logVal}
        onChange={(e) => onChange(Math.round(10 ** Number(e.target.value)))}
        className="mt-3 w-full cursor-pointer accent-nessie-600"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {VALUATION_STEPS.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.usd)}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
              activePreset?.label === p.label
                ? "border-ink-950 bg-ink-950 text-paper"
                : "border-ink-200 bg-paper text-ink-700 hover:border-ink-950 hover:text-ink-950"
            }`}
          >
            {p.label} · {formatUsd(p.usd)}
          </button>
        ))}
      </div>
      {activePreset && (
        <p className="mt-2 text-[12px] text-ink-500">{activePreset.note}</p>
      )}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
      <div className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
        {children}
      </div>
    </div>
  );
}
