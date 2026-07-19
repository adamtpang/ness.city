import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Ness v0.9 schema. The minimum tables to make Townhall, Bounties, and
 * PageRank persist for real. Auth is intentionally absent: posts carry a
 * displayName + handle until Clerk (or NS Directory SSO) ships in v1.0.
 */

export const problemStatusEnum = pgEnum("problem_status", [
  "open",
  "investigating",
  "in-progress",
  "solved",
]);

export const problemCategoryEnum = pgEnum("problem_category", [
  "operations",
  "social",
  "infra",
  "policy",
  "wellbeing",
  "other",
]);

export const bountyStateEnum = pgEnum("bounty_state", [
  "collecting",
  "funded",
  "claimed",
  "paid",
]);

export const marketKindEnum = pgEnum("market_kind", [
  "forsale",
  "free",
  "wanted",
  "housing",
  "service",
  "ride",
  "community",
]);

export const marketContactEnum = pgEnum("market_contact", [
  "whatsapp",
  "email",
  "discord",
  "telegram",
]);

export const marketStatusEnum = pgEnum("market_status", [
  "open",
  "claimed",
  "expired",
]);

export const citizens = pgTable(
  "citizens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    handle: text("handle").notNull().unique(),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    avatarSeed: text("avatar_seed"),
    karma: integer("karma").notNull().default(0),
    patronageCents: integer("patronage_cents").notNull().default(0),
    walletAddress: text("wallet_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    handleIdx: index("citizens_handle_idx").on(t.handle),
  }),
);

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    rootCause: text("root_cause").notNull(),
    category: problemCategoryEnum("category").notNull().default("other"),
    status: problemStatusEnum("status").notNull().default("open"),
    reporterId: uuid("reporter_id").references(() => citizens.id, {
      onDelete: "set null",
    }),
    reporterDisplayName: text("reporter_display_name").notNull(),
    affected: integer("affected").notNull().default(0),
    upvotes: integer("upvotes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index("problems_slug_idx").on(t.slug),
    statusIdx: index("problems_status_idx").on(t.status),
  }),
);

export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => citizens.id, {
    onDelete: "set null",
  }),
  authorDisplayName: text("author_display_name").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bounties = pgTable("bounties", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" })
    .unique(),
  proposalId: uuid("proposal_id").references(() => proposals.id, {
    onDelete: "set null",
  }),
  goalCents: integer("goal_cents").notNull(),
  state: bountyStateEnum("state").notNull().default("collecting"),
  claimedById: uuid("claimed_by_id").references(() => citizens.id, {
    onDelete: "set null",
  }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pledges = pgTable(
  "pledges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bountyId: uuid("bounty_id")
      .notNull()
      .references(() => bounties.id, { onDelete: "cascade" }),
    patronId: uuid("patron_id").references(() => citizens.id, {
      onDelete: "set null",
    }),
    patronDisplayName: text("patron_display_name").notNull(),
    amountCents: integer("amount_cents").notNull(),
    note: text("note"),
    txHash: text("tx_hash"),
    pledgedAt: timestamp("pledged_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    bountyIdx: index("pledges_bounty_idx").on(t.bountyId),
  }),
);

export const documentation = pgTable("documentation", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" })
    .unique(),
  authorId: uuid("author_id").references(() => citizens.id, {
    onDelete: "set null",
  }),
  authorDisplayName: text("author_display_name").notNull(),
  body: text("body").notNull(),
  costCents: integer("cost_cents"),
  upvotes: integer("upvotes").notNull().default(0),
  shippedAt: timestamp("shipped_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Comments on a problem. The community-problem-solving thread that
 * turns a flat issue into real conversation. GitHub Issues comments
 * analog. Authored by handle + display name (same lightweight identity
 * model used everywhere else); no auth gating yet.
 */
export const problemComments = pgTable(
  "problem_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => citizens.id, {
      onDelete: "set null",
    }),
    authorHandle: text("author_handle").notNull(),
    authorDisplayName: text("author_display_name").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    problemIdx: index("problem_comments_problem_idx").on(t.problemId),
    createdIdx: index("problem_comments_created_idx").on(t.createdAt),
  }),
);

/**
 * PageRank rings. Each row = one named connection within a citizen's ring.
 * Round runs 1..6, count limits enforced in the API layer.
 */
export const pagerankRings = pgTable(
  "pagerank_rings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    citizenId: uuid("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    namedHandle: text("named_handle").notNull(),
    namedCitizenId: uuid("named_citizen_id").references(() => citizens.id, {
      onDelete: "set null",
    }),
    round: integer("round").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    citizenIdx: index("pagerank_citizen_idx").on(t.citizenId),
    roundIdx: index("pagerank_round_idx").on(t.round),
  }),
);

/**
 * Directory profiles. Seeded by scraping the community member directory
 * (the "house facebook" / Facemash move). Lets the /pagerank ring builder
 * autocomplete real people instead of relying on free-text handles.
 *
 * `source` lets us mix scraped rows with manually-added ones, and lets us
 * re-scrape idempotently by ON CONFLICT (handle) DO UPDATE.
 */
export const directoryProfiles = pgTable(
  "directory_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    handle: text("handle").notNull().unique(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    role: text("role"),
    location: text("location"),
    bio: text("bio"),
    externalId: text("external_id"),
    source: text("source").notNull().default("ns_directory"),
    scrapedAt: timestamp("scraped_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    handleIdx: index("directory_profiles_handle_idx").on(t.handle),
    displayNameIdx: index("directory_profiles_display_name_idx").on(t.displayName),
  }),
);

/**
 * Market listings. The craigslist / marketplace surface, built on top of
 * the identity layer: every listing carries a sellerHandle that resolves
 * to a citizen (and, once scraped, a directory_profiles row). Static seed
 * data in lib/market.ts is the fallback when the table is empty so the
 * page is never blank.
 *
 * Listings expire 30 days after creation (expiresAt set in the API).
 */
export const marketListings = pgTable(
  "market_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: marketKindEnum("kind").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    priceCents: integer("price_cents"),
    rate: text("rate"),
    /** Optional single photo, stored as a small client-resized data URL. */
    photoData: text("photo_data"),
    sellerId: uuid("seller_id").references(() => citizens.id, {
      onDelete: "set null",
    }),
    sellerHandle: text("seller_handle").notNull(),
    sellerDisplayName: text("seller_display_name").notNull(),
    contactKind: marketContactEnum("contact_kind").notNull(),
    contactValue: text("contact_value").notNull(),
    status: marketStatusEnum("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    statusIdx: index("market_listings_status_idx").on(t.status),
    kindIdx: index("market_listings_kind_idx").on(t.kind),
    sellerIdx: index("market_listings_seller_idx").on(t.sellerHandle),
  }),
);

/**
 * Feedback widget submissions. v0.9 writes here in addition to logging.
 */
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  rating: integer("rating").notNull(),
  message: text("message"),
  page: text("page"),
  referrer: text("referrer"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Relations: lets us write `db.query.problems.findMany({ with: { proposals } })`
export const problemsRelations = relations(problems, ({ one, many }) => ({
  reporter: one(citizens, {
    fields: [problems.reporterId],
    references: [citizens.id],
  }),
  proposals: many(proposals),
  bounty: one(bounties),
  documentation: one(documentation),
}));

export const bountiesRelations = relations(bounties, ({ one, many }) => ({
  problem: one(problems, {
    fields: [bounties.problemId],
    references: [problems.id],
  }),
  proposal: one(proposals, {
    fields: [bounties.proposalId],
    references: [proposals.id],
  }),
  claimedBy: one(citizens, {
    fields: [bounties.claimedById],
    references: [citizens.id],
  }),
  pledges: many(pledges),
}));

export const pledgesRelations = relations(pledges, ({ one }) => ({
  bounty: one(bounties, {
    fields: [pledges.bountyId],
    references: [bounties.id],
  }),
  patron: one(citizens, {
    fields: [pledges.patronId],
    references: [citizens.id],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  problem: one(problems, {
    fields: [proposals.problemId],
    references: [problems.id],
  }),
  author: one(citizens, {
    fields: [proposals.authorId],
    references: [citizens.id],
  }),
}));

/**
 * Reverse side of problems.documentation. Without this, the relational
 * query API can't infer the join and throws "not enough information to
 * infer relation problems.documentation", which 500s every
 * /townhall/[slug] page. (Regression from the 2026-05-22 source loss;
 * the documentation table holds the problemId FK.)
 */
export const documentationRelations = relations(documentation, ({ one }) => ({
  problem: one(problems, {
    fields: [documentation.problemId],
    references: [problems.id],
  }),
}));

/* ============================================================
   Member Rating Index (ness.city/members)
   ------------------------------------------------------------
   Members rate each other on four dimensions; the aggregate
   becomes a ranked index that informs longterm-membership
   promotion. Self-contained so the whole subsystem can be
   frozen (kill switch) or dropped without touching the rest
   of Ness.

   Population model:
     - Ratees (subjects) are `directory_profiles` rows — the
       scraped NS member roster. No new roster to seed.
     - Raters are signed-in Privy users, keyed by their stable
       Privy DID. A rater is best-effort linked back to their
       own directory profile so we can exclude self and, later,
       read tenure.

   Hard privacy rule enforced at the query layer, not here:
   nobody ever sees their own score or who rated them, and the
   free-text `note` is core-team-only.
   ============================================================ */

/**
 * Vouch answer. Null (column left unset) is the fourth state,
 * "haven't interacted enough" — the default, not a skip. "not_sure"
 * means the rater knows them but is genuinely undecided; it is
 * excluded from the vouch ratio, whereas null carries no signal.
 */
export const vouchChoiceEnum = pgEnum("vouch_choice", ["yes", "no", "not_sure"]);

/**
 * Raters — the evaluators. One row per signed-in Privy user. Kept
 * distinct from `citizens` (which carries karma / patronage semantics)
 * so the rating subsystem stays self-contained. `tenureMonths` drives
 * rater weight (see lib/members/config.ts) and is backfillable; null
 * falls back to the configured floor weight.
 */
export const raters = pgTable(
  "raters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Stable Privy user id, e.g. did:privy:... — the rater's identity anchor. */
    privyDid: text("privy_did").notNull().unique(),
    email: text("email"),
    displayName: text("display_name").notNull(),
    /** Best-effort handle, used to self-link to a directory profile. */
    handle: text("handle"),
    /** The rater's own directory profile, when we can match one. Lets us
        exclude self from their rate list and (later) read tenure. */
    subjectProfileId: uuid("subject_profile_id").references(
      () => directoryProfiles.id,
      { onDelete: "set null" },
    ),
    /** Months at Network School. Null → floor weight until backfilled. */
    tenureMonths: integer("tenure_months"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastRatedAt: timestamp("last_rated_at", { withTimezone: true }),
  },
  (t) => ({
    handleIdx: index("raters_handle_idx").on(t.handle),
  }),
);

/**
 * Member ratings — the core table. One row per (rater, subject) pair,
 * upserted, so re-rating updates in place.
 *
 * Each dimension is nullable: a null means "haven't interacted enough"
 * (the default). `answeredCount` is how many of the four dimensions carry
 * a real answer; `counted` (answeredCount >= config.minAnsweredToCount)
 * is denormalized so aggregate queries can filter cheaply. A rating only
 * feeds aggregates when `counted` is true.
 *
 * `note` is required by the API whenever any 1–5 score is <= the
 * configured low-score threshold. It is core-team-only and must never
 * appear in any aggregate or public view.
 */
export const memberRatings = pgTable(
  "member_ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    raterId: uuid("rater_id")
      .notNull()
      .references(() => raters.id, { onDelete: "cascade" }),
    subjectProfileId: uuid("subject_profile_id")
      .notNull()
      .references(() => directoryProfiles.id, { onDelete: "cascade" }),
    /** 1–5, or null for "haven't interacted enough". */
    integrity: integer("integrity"),
    curiosity: integer("curiosity"),
    creativity: integer("creativity"),
    vouch: vouchChoiceEnum("vouch"),
    /** Core-only free text. Required when any score <= low-score threshold. */
    note: text("note"),
    answeredCount: integer("answered_count").notNull().default(0),
    counted: boolean("counted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pairUnique: uniqueIndex("member_ratings_pair_uidx").on(
      t.raterId,
      t.subjectProfileId,
    ),
    subjectIdx: index("member_ratings_subject_idx").on(t.subjectProfileId),
    raterIdx: index("member_ratings_rater_idx").on(t.raterId),
    countedIdx: index("member_ratings_counted_idx").on(t.counted),
    createdIdx: index("member_ratings_created_idx").on(t.createdAt),
  }),
);

/**
 * Runtime settings for the rating subsystem — a tiny key/value store so
 * the admin kill switch and public-page mode can flip without a redeploy.
 * Known keys:
 *   ratings_frozen : "true" | "false"  (kill switch: freeze writes + hide public page)
 *   public_mode    : "highlights" | "full"  (overrides the config default)
 * Absent key → fall back to the compile-time default in lib/members/config.ts.
 */
export const memberSettings = pgTable("member_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Dashboard access audit — every core-dashboard load logged with viewer +
 * timestamp, per the hard rules. Written by the (role-gated) dashboard;
 * never exposed publicly.
 */
export const memberDashboardViews = pgTable(
  "member_dashboard_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    viewer: text("viewer").notNull(),
    path: text("path"),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    viewedIdx: index("member_dashboard_views_viewed_idx").on(t.viewedAt),
  }),
);

export const ratersRelations = relations(raters, ({ one, many }) => ({
  profile: one(directoryProfiles, {
    fields: [raters.subjectProfileId],
    references: [directoryProfiles.id],
  }),
  ratings: many(memberRatings),
}));

export const memberRatingsRelations = relations(memberRatings, ({ one }) => ({
  rater: one(raters, {
    fields: [memberRatings.raterId],
    references: [raters.id],
  }),
  subject: one(directoryProfiles, {
    fields: [memberRatings.subjectProfileId],
    references: [directoryProfiles.id],
  }),
}));
