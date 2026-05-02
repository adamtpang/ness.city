CREATE TYPE "public"."bounty_state" AS ENUM('collecting', 'funded', 'claimed', 'paid');--> statement-breakpoint
CREATE TYPE "public"."problem_category" AS ENUM('operations', 'social', 'infra', 'policy', 'wellbeing', 'other');--> statement-breakpoint
CREATE TYPE "public"."problem_status" AS ENUM('open', 'investigating', 'in-progress', 'solved');--> statement-breakpoint
CREATE TABLE "bounties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"proposal_id" uuid,
	"goal_cents" integer NOT NULL,
	"state" "bounty_state" DEFAULT 'collecting' NOT NULL,
	"claimed_by_id" uuid,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bounties_problem_id_unique" UNIQUE("problem_id")
);
--> statement-breakpoint
CREATE TABLE "citizens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"bio" text,
	"avatar_seed" text,
	"karma" integer DEFAULT 0 NOT NULL,
	"patronage_cents" integer DEFAULT 0 NOT NULL,
	"wallet_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "citizens_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "documentation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"author_id" uuid,
	"author_display_name" text NOT NULL,
	"body" text NOT NULL,
	"cost_cents" integer,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"shipped_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documentation_problem_id_unique" UNIQUE("problem_id")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" integer NOT NULL,
	"message" text,
	"page" text,
	"referrer" text,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagerank_rings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"citizen_id" uuid NOT NULL,
	"named_handle" text NOT NULL,
	"named_citizen_id" uuid,
	"round" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pledges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bounty_id" uuid NOT NULL,
	"patron_id" uuid,
	"patron_display_name" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"note" text,
	"tx_hash" text,
	"pledged_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"root_cause" text NOT NULL,
	"category" "problem_category" DEFAULT 'other' NOT NULL,
	"status" "problem_status" DEFAULT 'open' NOT NULL,
	"reporter_id" uuid,
	"reporter_display_name" text NOT NULL,
	"affected" integer DEFAULT 0 NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "problems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"author_id" uuid,
	"author_display_name" text NOT NULL,
	"summary" text NOT NULL,
	"body" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_claimed_by_id_citizens_id_fk" FOREIGN KEY ("claimed_by_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "documentation_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "documentation_author_id_citizens_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagerank_rings" ADD CONSTRAINT "pagerank_rings_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagerank_rings" ADD CONSTRAINT "pagerank_rings_named_citizen_id_citizens_id_fk" FOREIGN KEY ("named_citizen_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_patron_id_citizens_id_fk" FOREIGN KEY ("patron_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_reporter_id_citizens_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_author_id_citizens_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "citizens_handle_idx" ON "citizens" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "pagerank_citizen_idx" ON "pagerank_rings" USING btree ("citizen_id");--> statement-breakpoint
CREATE INDEX "pagerank_round_idx" ON "pagerank_rings" USING btree ("round");--> statement-breakpoint
CREATE INDEX "pledges_bounty_idx" ON "pledges" USING btree ("bounty_id");--> statement-breakpoint
CREATE INDEX "problems_slug_idx" ON "problems" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "problems_status_idx" ON "problems" USING btree ("status");