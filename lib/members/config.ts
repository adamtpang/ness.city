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
    // Values are the honest −2…+2 signal (kept for the operator dashboard).
    // Labels are framed as enthusiasm, not judgment — tapping the low end
    // reads as "not for me," never "you're not good enough." Nobody ever
    // sees their own score, and only the positive end is ever surfaced back.
    // tone is a neutral→green ramp (t0…t4). No red — the low end reads as
    // neutral, never negative. The −2…+2 value underneath is unchanged.
    { value: -2 as Bucket, label: "Pass", sub: "not for me", emoji: "🤷", tone: "t0" },
    { value: -1 as Bucket, label: "Meh", sub: "it's okay", emoji: "😐", tone: "t1" },
    { value: 0 as Bucket, label: "Curious", sub: "want to know more", emoji: "🤔", tone: "t2" },
    { value: 1 as Bucket, label: "Fan", sub: "really into this", emoji: "🙌", tone: "t3" },
    { value: 2 as Bucket, label: "Legend", sub: "must-know", emoji: "🔥", tone: "t4" },
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
    baseVisible: 1,
    revealPerRating: 1,
    revealPerInvite: 3,
    signedOutVisible: 1,
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

  /**
   * The roster is a real directory of real people, so it is NOT public. You
   * have to take part before you can browse the room: rate this many members
   * and the roster unlocks. Enforced server-side in /api/members/roster, not
   * just hidden in the UI, so the list is never fetchable by a crawler or a
   * casual visitor.
   */
  roster: {
    minRatingsToBrowse: 3,
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
    url: "https://ness.city",
  },
} as const;

export const SCALE_MIN = -2;
export const SCALE_MAX = 2;
