/**
 * Member Rating Index — the one tuning surface.
 *
 * Every constant the index depends on lives here so scoring, gates, and
 * limits can be adjusted in one place. Values are read at request time, so
 * editing this file and redeploying re-tunes the whole system; nothing else
 * needs to change. (The kill switch and public mode can also be flipped at
 * runtime with no redeploy via the member_settings table — see settings.ts.)
 *
 * Nothing here is secret. Do not put tokens or connection strings in this
 * file; those stay in env.
 */

export type PublicMode = "highlights" | "full";

export const MEMBER_CONFIG = {
  /** The four dimensions, in card order. Order here IS the tap order. */
  dimensions: {
    score: [
      {
        key: "integrity",
        label: "Integrity",
        prompt: "Do they do what they said they'd do?",
      },
      {
        key: "curiosity",
        label: "Curiosity",
        prompt: "Do they engage outside their own lane?",
      },
      {
        key: "creativity",
        label: "Creativity",
        prompt: "Do they make and ship things?",
      },
    ],
    vouch: {
      key: "vouch",
      label: "Vouch",
      prompt: "Would you want this person still here in 12 months?",
    },
  },

  /**
   * A rating feeds aggregates only if at least this many of the four
   * dimensions carry a real answer. "Haven't interacted enough" (null)
   * does not count toward this.
   */
  minAnsweredToCount: 3,

  /**
   * Any 1–5 score at or below this requires a one-line note. Notes are
   * core-team-only and never appear in any aggregate or public view.
   */
  lowScoreThreshold: 2,

  /** Rater weight = clamp(months_at_ns / fullTenureMonths, floor, cap). */
  raterWeight: {
    fullTenureMonths: 6,
    floor: 0.2,
    cap: 1.0,
  },

  /**
   * Recency decay on a rating's influence. Full weight while fresh, then a
   * linear taper down to `floor`, reached at `zeroAtMonths`. Tenure earns
   * influence; stale ratings lose it.
   */
  recency: {
    fullWeightMonths: 6,
    zeroAtMonths: 18,
    floor: 0.25,
  },

  /**
   * Composite weights. Vouch ratio is weighted heaviest; the three scored
   * dimensions are secondary. Weights are normalized at compute time, so
   * these are relative, not required to sum to 1.
   */
  composite: {
    vouch: 0.5,
    integrity: 0.5 / 3,
    curiosity: 0.5 / 3,
    creativity: 0.5 / 3,
  },

  /**
   * Confidence (0–1) blends how many ratings a member has with how diverse
   * the raters are. `fullConfidenceRatings` is the count at which the volume
   * term saturates; `diversityWeight` is how much distinct-rater spread
   * matters vs. raw volume. Surfaced next to every score, always.
   */
  confidence: {
    fullConfidenceRatings: 12,
    diversityWeight: 0.35,
  },

  /**
   * Below this many counted ratings a member is flagged "insufficient data"
   * and shown no rank / no numeric score.
   */
  insufficientDataThreshold: 5,

  /** Max new ratings one rater can create per rolling hour (anti-bulk-dump). */
  rateLimitPerHour: 60,

  /**
   * Reciprocal-pair review: when A rates B and B rates A within this window,
   * and the two composites differ from the crowd by more than the delta,
   * surface the pair for human review (never auto-suppress).
   */
  reciprocalReview: {
    windowHours: 24,
    flagCompositeDelta: 1.0,
  },

  /** Public page default. The member_settings row, if present, overrides this. */
  publicMode: "highlights" as PublicMode,

  /** How many top-vouched members the highlights wall shows. */
  highlightsWallSize: 24,

  /**
   * Minimum "yes" vouches before a member can appear on the public wall, so
   * the wall is real social proof and never surfaces someone off one vouch.
   */
  highlightsMinVouches: 3,

  /**
   * Phase 4 viral gates (not enforced yet; here so tuning lives in one place).
   *   viewGateMinRatings  — rate this many before the highlights wall unlocks.
   *   shareCardMinRatings — offer a share card after rating this many.
   */
  gates: {
    viewGateMinRatings: 5,
    shareCardMinRatings: 10,
  },
} as const;

export type ScoreDimensionKey =
  (typeof MEMBER_CONFIG.dimensions.score)[number]["key"];
