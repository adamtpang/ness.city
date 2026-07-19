/**
 * Member Rating Index — the one tuning surface.
 *
 * Every constant the index depends on lives here so the scoring, the reveal
 * gate, and the limits can be adjusted in one place. Values are read at
 * request time, so editing this file and redeploying re-tunes the whole
 * system. (The kill switch also flips at runtime with no redeploy via the
 * member_settings table — see settings.ts.)
 */

export type Bucket = -2 | -1 | 0 | 1 | 2;

export const MEMBER_CONFIG = {
  /**
   * The −2…+2 spectrum. Order is left→right as shown on the card. `tone`
   * drives the color (neg = red-ish, pos = green-ish, 0 = neutral).
   */
  scale: [
    { value: -2 as Bucket, label: "No", sub: "not a fit", emoji: "👎", tone: "neg" },
    { value: -1 as Bucket, label: "Meh", sub: "leaning no", emoji: "🤏", tone: "neg" },
    { value: 0 as Bucket, label: "Neutral", sub: "no strong read", emoji: "😐", tone: "zero" },
    { value: 1 as Bucket, label: "Like", sub: "leaning yes", emoji: "🙂", tone: "pos" },
    { value: 2 as Bucket, label: "Love", sub: "must stay", emoji: "🔥", tone: "pos" },
  ],

  /**
   * Aggregation. A member's score is a Bayesian-shrunk mean of the ratings
   * they've received, pulled toward `priorMean` with weight `priorWeight`,
   * so one +2 from a single rater doesn't top the board. Members below
   * `minRatingsToRank` are held out of the ranking (shown as "warming up").
   */
  score: {
    priorMean: 0,
    priorWeight: 3,
    minRatingsToRank: 3,
  },

  /**
   * Progressive reveal — the crawl / viral loop. You see
   *   base + revealPerRating × (ratings you've submitted)
   * leaderboard rows, capped at everyone. Signed-out visitors see
   * `signedOutVisible` as a teaser.
   */
  leaderboard: {
    baseVisible: 5,
    revealPerRating: 2,
    signedOutVisible: 3,
  },

  /**
   * Deck order — who gets rated first. Members whose directory `role` or
   * `location` matches one of these keywords (case-insensitive) are served
   * first (seed the high-signal people), then fewest-ratings for even
   * coverage, then freshest directory entry. Tune the keywords to your
   * directory data; add explicit columns (cohort, on_campus, joined_at) to
   * directory_profiles later for precise prioritization.
   */
  deck: {
    priorityKeywords: ["core", "longterm", "long-term", "team", "founder", "faculty"],
    limit: 40,
  },

  /** Max new ratings one rater can create per rolling hour (anti-bulk-dump). */
  rateLimitPerHour: 120,

  /**
   * Privacy: hide the viewer's own row from the leaderboard so nobody sees
   * their own score/rank. Flip to false to let people see themselves.
   */
  hideOwnRow: true,

  /** Share / invite loop. The celebratory prompt fires after `minRatings`. */
  share: {
    minRatings: 10,
    url: "https://ness.city/members",
  },
} as const;

export const SCALE_MIN = -2;
export const SCALE_MAX = 2;
