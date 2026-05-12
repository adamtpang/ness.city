/**
 * NS Points math, captured for the calculator on /points.
 *
 * Source: community member-points documentation. The formula is documented
 * publicly upstream; we just code it up.
 *
 *   Epoch 1 (NS ID ≤ 64):  points(n) = 2^24             = 16,777,216
 *   After NS ID #64:       points(n) = floor(2^30 / n)
 *
 *   2^24 = 16,777,216
 *   2^30 = 1,073,741,824 = 64 × 2^24
 *
 * Vesting schedule:
 *   - 1-year cliff. Nothing vests in months 0-11.
 *   - At month 12, 1/4 (25%) vests.
 *   - From month 13 to month 48, an additional 1/48 vests each month.
 *   - At month 48, 100% vested.
 */

export const POINTS_EPOCH_1_LIMIT = 64;
export const POINTS_EPOCH_1_AWARD = 2 ** 24; // 16,777,216
export const POINTS_TOTAL_SUPPLY_BASE = 2 ** 30; // 1,073,741,824

export function pointsForId(id: number): number {
  if (!Number.isFinite(id) || id <= 0) return 0;
  if (id <= POINTS_EPOCH_1_LIMIT) return POINTS_EPOCH_1_AWARD;
  return Math.floor(POINTS_TOTAL_SUPPLY_BASE / id);
}

/**
 * Total points outstanding if there are `total` longtermers.
 * Sum of pointsForId(1..total).
 *
 * - For i ≤ 64:        contributes 2^24
 * - For i > 64:        contributes floor(2^30 / i), approximated by 2^30 / i
 *
 * For total ≤ 64: exact sum = total * 2^24
 * For total > 64: 64 * 2^24 + Σ (2^30/i) for i = 65..total
 *                = 2^30 + 2^30 * (H(total) - H(64))
 *                where H(k) is the kth harmonic number, H(k) ≈ ln(k) + γ
 *                so H(total) - H(64) ≈ ln(total/64) + 1/(2k) corrections
 *
 * For UI purposes we evaluate the sum directly; total is small enough
 * (a few thousand max) that we don't need the asymptotic.
 */
export function totalPointsOutstanding(total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 0;
  const epoch1 = Math.min(total, POINTS_EPOCH_1_LIMIT) * POINTS_EPOCH_1_AWARD;
  let rest = 0;
  for (let i = POINTS_EPOCH_1_LIMIT + 1; i <= total; i++) {
    rest += Math.floor(POINTS_TOTAL_SUPPLY_BASE / i);
  }
  return epoch1 + rest;
}

/**
 * Vesting fraction at a given month after start.
 * - month < 12: 0
 * - month == 12: 0.25
 * - 12 < month < 48: 0.25 + (month - 12) / 48
 * - month >= 48: 1
 */
export function vestedFraction(monthsElapsed: number): number {
  if (!Number.isFinite(monthsElapsed) || monthsElapsed < 12) return 0;
  if (monthsElapsed >= 48) return 1;
  // Cliff at 12, then 1/48 per month from 13..48 (36 months × 1/48 = 0.75)
  return 0.25 + (monthsElapsed - 12) / 48;
}

export function vestedFractionFromYears(years: number): number {
  return vestedFraction(years * 12);
}

/**
 * Implied USD value of a citizen's points at a given valuation,
 * vesting state, and total member count.
 *
 *   share          = pointsForId(id) / totalPointsOutstanding(total)
 *   nominalValue   = share * nsValuationUsd
 *   vestedValue    = nominalValue * vestedFraction
 */
export function impliedUsdValue(opts: {
  id: number;
  nsValuationUsd: number;
  totalLongtermers: number;
  yearsElapsed: number;
}): {
  yourPoints: number;
  totalPoints: number;
  sharePct: number;
  vestedPct: number;
  nominalUsd: number;
  vestedUsd: number;
} {
  const yourPoints = pointsForId(opts.id);
  const totalPoints = totalPointsOutstanding(opts.totalLongtermers);
  const share = totalPoints === 0 ? 0 : yourPoints / totalPoints;
  const vested = vestedFractionFromYears(opts.yearsElapsed);
  return {
    yourPoints,
    totalPoints,
    sharePct: share * 100,
    vestedPct: vested * 100,
    nominalUsd: opts.nsValuationUsd * share,
    vestedUsd: opts.nsValuationUsd * share * vested,
  };
}

export function formatUsd(usd: number): string {
  if (!Number.isFinite(usd)) return "$·";
  if (usd >= 1_000_000_000)
    return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(0)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
