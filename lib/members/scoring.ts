import { MEMBER_CONFIG, type ScoreDimensionKey } from "./config";

/**
 * The scoring model, as pure functions over the config. No DB, no I/O —
 * feed it rating rows and it returns the numbers the index is built on.
 * Kept pure so it is trivial to reason about and to unit-check by hand.
 *
 * A member NEVER sees their own output here; these functions serve the
 * core dashboard and the (score-free) public highlights only.
 */

export type VouchChoice = "yes" | "no" | "not_sure";

/** One counted rating, as the scorer needs it. */
export type ScoredRating = {
  raterId: string;
  integrity: number | null;
  curiosity: number | null;
  creativity: number | null;
  vouch: VouchChoice | null;
  /** Rater tenure at NS in months; null → floor weight. */
  raterTenureMonths: number | null;
  /** Age of the rating in months, for recency decay. */
  ageMonths: number;
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Rater weight from tenure: clamp(months / full, floor, cap). */
export function raterWeight(tenureMonths: number | null): number {
  const { fullTenureMonths, floor, cap } = MEMBER_CONFIG.raterWeight;
  if (tenureMonths == null) return floor;
  return clamp(tenureMonths / fullTenureMonths, floor, cap);
}

/** Recency multiplier: full while fresh, then linear taper to a floor. */
export function recencyWeight(ageMonths: number): number {
  const { fullWeightMonths, zeroAtMonths, floor } = MEMBER_CONFIG.recency;
  if (ageMonths <= fullWeightMonths) return 1;
  if (ageMonths >= zeroAtMonths) return floor;
  const span = zeroAtMonths - fullWeightMonths;
  const t = (ageMonths - fullWeightMonths) / span; // 0..1
  return 1 - t * (1 - floor);
}

/** Combined per-rating weight (tenure × recency). */
export function ratingWeight(r: ScoredRating): number {
  return raterWeight(r.raterTenureMonths) * recencyWeight(r.ageMonths);
}

/**
 * Weighted vouch ratio = weighted(yes) / weighted(yes + no). "not_sure" and
 * "haven't interacted" (null) are excluded entirely. Returns null when no
 * rater expressed a yes/no.
 */
export function vouchRatio(ratings: ScoredRating[]): number | null {
  let yes = 0;
  let denom = 0;
  for (const r of ratings) {
    if (r.vouch !== "yes" && r.vouch !== "no") continue;
    const w = ratingWeight(r);
    denom += w;
    if (r.vouch === "yes") yes += w;
  }
  if (denom === 0) return null;
  return yes / denom;
}

/** Weighted mean of one 1–5 dimension, ignoring nulls. Null if none answered. */
export function dimensionMean(
  ratings: ScoredRating[],
  key: ScoreDimensionKey,
): number | null {
  let sum = 0;
  let denom = 0;
  for (const r of ratings) {
    const v = r[key];
    if (v == null) continue;
    const w = ratingWeight(r);
    sum += w * v;
    denom += w;
  }
  if (denom === 0) return null;
  return sum / denom;
}

/**
 * Confidence in [0,1]: blends rating volume (saturating at
 * fullConfidenceRatings) with rater diversity (distinct raters / ratings).
 * A 4.9 from three raters lands low here, and the UI is expected to show it.
 */
export function confidence(ratings: ScoredRating[]): number {
  const n = ratings.length;
  if (n === 0) return 0;
  const { fullConfidenceRatings, diversityWeight } = MEMBER_CONFIG.confidence;
  const volume = clamp(n / fullConfidenceRatings, 0, 1);
  const distinctRaters = new Set(ratings.map((r) => r.raterId)).size;
  const diversity = distinctRaters / n; // 1 when every rating is a distinct rater
  return clamp(volume * (1 - diversityWeight) + volume * diversity * diversityWeight, 0, 1);
}

export type MemberScore = {
  ratingCount: number;
  distinctRaters: number;
  /** True when below the insufficient-data threshold: show no rank. */
  insufficientData: boolean;
  vouchRatio: number | null;
  dimensions: Record<ScoreDimensionKey, number | null>;
  /** Composite in [0,1], vouch weighted heaviest. Null if nothing to score. */
  composite: number | null;
  confidence: number;
};

/**
 * Full composite for one member. Composite normalizes the 1–5 dimension
 * means to [0,1] and blends them with the vouch ratio using the configured
 * weights (vouch heaviest), over whichever terms are present.
 */
export function scoreMember(ratings: ScoredRating[]): MemberScore {
  const ratingCount = ratings.length;
  const distinctRaters = new Set(ratings.map((r) => r.raterId)).size;
  const insufficientData = ratingCount < MEMBER_CONFIG.insufficientDataThreshold;

  const dimensions = {
    integrity: dimensionMean(ratings, "integrity"),
    curiosity: dimensionMean(ratings, "curiosity"),
    creativity: dimensionMean(ratings, "creativity"),
  } as Record<ScoreDimensionKey, number | null>;

  const vr = vouchRatio(ratings);

  // Blend present terms with config weights, then renormalize by the weight
  // actually used so a missing term doesn't drag the composite down.
  const terms: { value: number; weight: number }[] = [];
  if (vr != null) terms.push({ value: vr, weight: MEMBER_CONFIG.composite.vouch });
  for (const key of ["integrity", "curiosity", "creativity"] as const) {
    const mean = dimensions[key];
    if (mean != null) {
      terms.push({
        value: (mean - 1) / 4, // 1..5 -> 0..1
        weight: MEMBER_CONFIG.composite[key],
      });
    }
  }
  const usedWeight = terms.reduce((s, t) => s + t.weight, 0);
  const composite =
    usedWeight === 0
      ? null
      : terms.reduce((s, t) => s + t.value * t.weight, 0) / usedWeight;

  return {
    ratingCount,
    distinctRaters,
    insufficientData,
    vouchRatio: vr,
    dimensions,
    composite,
    confidence: confidence(ratings),
  };
}

/** Human label for a confidence value, for the always-on confidence chip. */
export function confidenceLabel(c: number): "low" | "medium" | "high" {
  if (c < 0.34) return "low";
  if (c < 0.67) return "medium";
  return "high";
}
