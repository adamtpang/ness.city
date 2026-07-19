CREATE TYPE "public"."vouch_choice" AS ENUM('yes', 'no', 'not_sure');--> statement-breakpoint
CREATE TABLE "member_dashboard_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewer" text NOT NULL,
	"path" text,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rater_id" uuid NOT NULL,
	"subject_profile_id" uuid NOT NULL,
	"integrity" integer,
	"curiosity" integer,
	"creativity" integer,
	"vouch" "vouch_choice",
	"note" text,
	"answered_count" integer DEFAULT 0 NOT NULL,
	"counted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"privy_did" text NOT NULL,
	"email" text,
	"display_name" text NOT NULL,
	"handle" text,
	"subject_profile_id" uuid,
	"tenure_months" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_rated_at" timestamp with time zone,
	CONSTRAINT "raters_privy_did_unique" UNIQUE("privy_did")
);
--> statement-breakpoint
ALTER TABLE "member_ratings" ADD CONSTRAINT "member_ratings_rater_id_raters_id_fk" FOREIGN KEY ("rater_id") REFERENCES "public"."raters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ratings" ADD CONSTRAINT "member_ratings_subject_profile_id_directory_profiles_id_fk" FOREIGN KEY ("subject_profile_id") REFERENCES "public"."directory_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raters" ADD CONSTRAINT "raters_subject_profile_id_directory_profiles_id_fk" FOREIGN KEY ("subject_profile_id") REFERENCES "public"."directory_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "member_dashboard_views_viewed_idx" ON "member_dashboard_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "member_ratings_pair_uidx" ON "member_ratings" USING btree ("rater_id","subject_profile_id");--> statement-breakpoint
CREATE INDEX "member_ratings_subject_idx" ON "member_ratings" USING btree ("subject_profile_id");--> statement-breakpoint
CREATE INDEX "member_ratings_rater_idx" ON "member_ratings" USING btree ("rater_id");--> statement-breakpoint
CREATE INDEX "member_ratings_counted_idx" ON "member_ratings" USING btree ("counted");--> statement-breakpoint
CREATE INDEX "member_ratings_created_idx" ON "member_ratings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "raters_handle_idx" ON "raters" USING btree ("handle");