import { MEMBER_CONFIG, SCALE_MIN, SCALE_MAX } from "./config";

/**
 * The scoring model, as pure functions. A member's ratings are just a list
 * of −2…+2 buckets; these turn that into the number the leaderboard ranks
 * on. Kept pure so it's trivial to reason about.
 *
 * A member NEVER sees their own output — the leaderboard hides the viewer's
 * own row (see config.hideOwnRow) and never reveals who rated whom.
 */

/** Bayesian-shrunk mean: pulls low-count members toward the prior (0). */
export function shrunkScore(ratings: number[]): number {
  const { priorMean, priorWeight } = MEMBER_CONFIG.score;
  const sum = ratings.reduce((s, r) => s + r, 0);
  return (sum + priorMean * priorWeight) / (ratings.length + priorWeight);
}

/** Plain average, for display. */
export function mean(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((s, r) => s + r, 0) / ratings.length;
}

/** Median rating received. */
export function median(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const s = [...ratings].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Map a −2…+2 score to a 0…1 fill for the sentiment bar. */
export function toFill(score: number): number {
  const t = (score - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return Math.max(0, Math.min(1, t));
}

/**
 * How many leaderboard rows a rater has unlocked:
 *   base + revealPerRating × (people you rated) + revealPerInvite × (people you brought in)
 * Inviting is worth more than rating, to push the viral loop.
 */
export function unlockedRows(
  ratedCount: number,
  invitesCount: number,
  total: number,
  signedIn: boolean,
): number {
  const { baseVisible, revealPerRating, revealPerInvite, signedOutVisible } = MEMBER_CONFIG.leaderboard;
  if (!signedIn) return Math.min(signedOutVisible, total);
  return Math.min(total, baseVisible + revealPerRating * ratedCount + revealPerInvite * invitesCount);
}
