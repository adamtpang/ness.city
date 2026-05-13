import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
  index,
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
