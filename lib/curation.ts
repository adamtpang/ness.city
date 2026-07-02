/**
 * Ness community curation, programmable to your liking.
 *
 * This file is the single source of truth for how Ness judges the quality of a
 * member. Every value here is a knob: change the numbers and you change what the
 * community rewards and who rises. Grounded in docs/curation.md.
 *
 * A member's quality is one composite score built from three axes:
 *   Character (trust)     earned from staked vouches, minus sanctions
 *   Ability (competence)  earned from what they ship on the engine (objective)
 *   Energy (contribution) earned from showing up and helping
 *
 * Character trust flows outward from a hand-picked seed set through the vouch
 * graph, decaying with distance, so quality starts at a high-quality root and
 * accounts far from it earn almost nothing. That is the anti-capture core.
 */

// ---------------------------------------------------------------------------
// 1. THE KNOBS YOU OWN
// ---------------------------------------------------------------------------

export const CURATION = {
  /**
   * How much you value each axis. Set the ratio you actually believe in.
   * Normalized, so { character: 5, ability: 3, energy: 2 } means 50% character,
   * 30% ability, 20% energy.
   */
  axisWeights: { character: 5, ability: 3, energy: 2 },

  /**
   * Character is a GATE, not a tradeoff. The rule: "I just want people I can
   * trust." So trust is necessary, not merely additive. No amount of ability or
   * energy lifts someone above provisional if their character is below this
   * floor. Trust first; everything else is second.
   */
  characterFloor: 0.5,

  /**
   * THE SEED SET. Your single biggest lever. These handles are the trusted root;
   * all character trust flows outward from them. Seed it with the people you
   * rated highest in your private rater: your real cowork core.
   */
  seedHandles: [] as string[], // e.g. ["alice", "bob", "carol"]

  /** Vouching: a vouch stakes the voucher's own standing on the vouchee. */
  vouch: {
    maxPerMember: 5, // scarcity makes a vouch mean something
    powerFromVoucherScore: true, // a trusted member's vouch counts more
    decayPerHop: 0.5, // trust attenuates with each hop from the seed
    maxHops: 3, // how far trust can travel
    reciprocityDiscount: 0.5, // mutual vouches are worth less (kills rating rings)
    maxShareFromOneVoucher: 0.4, // no single voucher can mint a member alone
  },

  /**
   * Seeding and growth. The loudest finding in the research: quality is a FLOW,
   * not a stock, and a community dilutes when newcomers arrive FASTER than they
   * can be absorbed (the "Eternal September"). So grow slowly, on purpose.
   */
  seed: {
    anchorSize: 12, // the hand-picked A-player anchor that imprints the culture
    foundingCohort: 100, // the vetted core you compound from, seeded by hand (not rate-limited)
  },
  growth: {
    targetConcurrent: 150, // Dunbar cap for one high-trust cell; split into cells beyond this
    assimilationRatio: 0.15, // post-founding: admit <= 15% of acculturated members per cycle
    cadenceDays: 30, // admit in bounded batches, never as a continuous firehose
  },

  /** Admission: two keys (core taste AND community trust) plus a hard character gate. */
  admission: {
    requireCoreVouch: true, // a seed or steward must vouch: core taste sets the bar (no bozo explosion)
    minCommunityVouches: 2, // AND the community endorses: distributed and anti-capture
    noAssholeGate: true, // any disqualifying character flag blocks entry, regardless of talent
  },

  /** The membership ladder. Composite score (0..1) needed to reach each tier. */
  tiers: {
    provisional: 0.0, // invited, on probation
    member: 0.25, // proved themselves
    trusted: 0.6, // may vouch at full weight
    steward: 0.85, // helps run the place
  },

  /** Probation: a newcomer stays provisional until BOTH are satisfied. */
  probation: {
    minDays: 14,
    requiresFirstContribution: true, // the "masterpiece": one shipped fix, funded bounty, or hosted event
  },

  /** Graduated sanctions (Ostrom): flags ding character and trigger review, never an auto-ban. */
  sanctions: {
    flagPenalty: 0.15,
    reviewBelow: 0.1, // below this, surface for HUMAN review
  },

  /**
   * Saturation targets: how much weighted activity reaches "full marks" on an
   * axis. Higher target = harder to max out. Tune to your community's scale.
   */
  targets: {
    ability: 5,
    energy: 8,
  },
};

export type Curation = typeof CURATION;

// ---------------------------------------------------------------------------
// 2. THE SIGNALS each member's score is computed from
// ---------------------------------------------------------------------------

export type MemberSignals = {
  handle: string;
  isSeed: boolean;
  // Ability: objective, straight from the engine (the masterpiece machine).
  fixesShipped: number;
  bountiesSolved: number;
  bountiesFunded: number;
  // Energy: participation.
  eventsHosted: number;
  helpsGiven: number;
  // Character inputs.
  vouchTrust: number; // 0..1, the output of computeVouchTrust() below
  activeFlags: number;
};

export type Vouch = { voucher: string; vouchee: string };
export type Tier = "provisional" | "member" | "trusted" | "steward";

export type Scored = {
  handle: string;
  character: number;
  ability: number;
  energy: number;
  composite: number; // 0..1
  tier: Tier;
};

// ---------------------------------------------------------------------------
// 3. THE SCORING (pure functions, no database, easy to test and tune)
// ---------------------------------------------------------------------------

/** Diminishing-returns curve: 0 at 0, approaches 1, hits 0.5 at x = k. */
function sat(x: number, k: number): number {
  return x <= 0 ? 0 : x / (x + k);
}
function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function ability(s: MemberSignals, c: Curation): number {
  // The objective axis: what they actually shipped. Hardest to fake or bias.
  const work = s.fixesShipped * 1.5 + s.bountiesSolved * 1.5 + s.bountiesFunded * 1;
  return sat(work, c.targets.ability);
}
function energy(s: MemberSignals, c: Curation): number {
  const participation = s.eventsHosted * 2 + s.helpsGiven * 1;
  return sat(participation, c.targets.energy);
}
function character(s: MemberSignals, c: Curation): number {
  return clamp01(s.vouchTrust - s.activeFlags * c.sanctions.flagPenalty);
}

export function scoreMember(s: MemberSignals, c: Curation = CURATION): Scored {
  const ch = character(s, c);
  const ab = ability(s, c);
  const en = energy(s, c);
  const w = c.axisWeights;
  const composite =
    (ch * w.character + ab * w.ability + en * w.energy) /
    (w.character + w.ability + w.energy);
  // Character is a gate: below the floor you cannot rise above provisional,
  // however able or fun you are. Trust first, everything else second.
  const tier = ch >= c.characterFloor ? tierOf(composite, c) : "provisional";
  return { handle: s.handle, character: ch, ability: ab, energy: en, composite, tier };
}

export function tierOf(score: number, c: Curation = CURATION): Tier {
  const t = c.tiers;
  if (score >= t.steward) return "steward";
  if (score >= t.trusted) return "trusted";
  if (score >= t.member) return "member";
  return "provisional";
}

/** Probation gate: time AND a first contribution (the masterpiece). */
export function passesProbation(
  opts: { daysSinceJoin: number; hasFirstContribution: boolean },
  c: Curation = CURATION,
): boolean {
  return (
    opts.daysSinceJoin >= c.probation.minDays &&
    (!c.probation.requiresFirstContribution || opts.hasFirstContribution)
  );
}

/**
 * Admission gate: two keys plus the no-asshole rule. A candidate needs a core
 * vouch (taste) AND enough community vouches (distributed trust), and any
 * disqualifying character flag is an automatic no, however talented they are.
 */
export function canAdmit(
  cand: { coreVouches: number; communityVouches: number; hasDisqualifyingFlag: boolean },
  c: Curation = CURATION,
): boolean {
  const a = c.admission;
  if (a.noAssholeGate && cand.hasDisqualifyingFlag) return false;
  if (a.requireCoreVouch && cand.coreVouches < 1) return false;
  return cand.communityVouches >= a.minCommunityVouches;
}

/**
 * Post-founding intake budget: how many newcomers the community can absorb this
 * cycle without diluting. The Eternal September guard, newcomers never outrun the
 * acculturated members who carry the culture. Returns 0 once at target size.
 */
export function intakeBudget(acculturatedCount: number, c: Curation = CURATION): number {
  const room = Math.max(0, c.growth.targetConcurrent - acculturatedCount);
  const absorbable = Math.floor(acculturatedCount * c.growth.assimilationRatio);
  return Math.min(room, absorbable);
}

// ---------------------------------------------------------------------------
// 4. THE TRUST GRAPH (the character axis: vouches propagated from the seed)
// ---------------------------------------------------------------------------

/**
 * Propagate trust from the seed set outward through the vouch graph.
 *
 * Seeds start at 1.0. Each vouch (voucher -> vouchee) passes a fraction of the
 * voucher's trust to the vouchee, attenuated by decayPerHop, discounted if the
 * vouch is mutual, and capped so no single voucher dominates. Iterating maxHops
 * times lets trust travel that many hops from the root. Returns handle -> trust
 * in [0,1]; feed it back in as MemberSignals.vouchTrust.
 *
 * This is what makes fake accounts worthless: with no path from the seed, an
 * account (and everyone it vouches for) stays at 0.
 */
export function computeVouchTrust(
  handles: string[],
  vouches: Vouch[],
  c: Curation = CURATION,
): Record<string, number> {
  const seeds = new Set(c.seedHandles);
  const trust: Record<string, number> = {};
  for (const h of handles) trust[h] = seeds.has(h) ? 1 : 0;

  const key = (a: string, b: string) => `${a} ${b}`;
  const edges = new Set(vouches.map((v) => key(v.voucher, v.vouchee)));
  const incoming: Record<string, string[]> = {};
  for (const v of vouches) (incoming[v.vouchee] ??= []).push(v.voucher);

  const cfg = c.vouch;
  for (let hop = 0; hop < cfg.maxHops; hop++) {
    const next = { ...trust };
    for (const h of handles) {
      if (seeds.has(h)) continue;
      let sum = 0;
      for (const voucher of incoming[h] ?? []) {
        let w = (cfg.powerFromVoucherScore ? trust[voucher] : 1) * cfg.decayPerHop;
        if (edges.has(key(h, voucher))) w *= cfg.reciprocityDiscount; // mutual vouch
        sum += Math.min(w, cfg.maxShareFromOneVoucher); // per-voucher cap
      }
      next[h] = clamp01(sum);
    }
    Object.assign(trust, next);
  }
  return trust;
}

// ---------------------------------------------------------------------------
// 5. WHAT A VOUCH ATTESTS (curating for the specific traits, behaviorally)
// ---------------------------------------------------------------------------

/**
 * You cannot read character off an application; it shows in behavior and in the
 * people who will stake their reputation on you. So a vouch is not a thumbs-up,
 * it is a set of firsthand attestations, each tied to a trait we curate for.
 *
 * Integrity is REQUIRED: a vouch that cannot affirm it does not count at all
 * (character is a gate). The rest enrich the picture. The voucher's own standing
 * is on the line, so these are answered honestly or left blank.
 */
export const VOUCH_PROMPTS = [
  {
    key: "integrity",
    required: true,
    trait: "Character / trust",
    ask: "Would you stake your own standing on this person's integrity?",
  },
  {
    key: "ability",
    required: false,
    trait: "Competence",
    ask: "Have you seen them ship something real?",
  },
  {
    key: "respectsTime",
    required: false,
    trait: "Common sense, no time-wasting",
    ask: "Do they respect people's time and follow through on what they say?",
  },
  {
    key: "curiosity",
    required: false,
    trait: "Curious and creative",
    ask: "Are they genuinely curious, and do they make things?",
  },
] as const;

export type Attestation = {
  integrity: boolean;
  ability?: boolean;
  respectsTime?: boolean;
  curiosity?: boolean;
};

/** A vouch only counts toward trust if its required attestation (integrity) holds. */
export function vouchCounts(a: Attestation): boolean {
  return VOUCH_PROMPTS.every((p) => !p.required || a[p.key as keyof Attestation] === true);
}
