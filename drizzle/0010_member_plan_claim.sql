ALTER TABLE "member_plans" ADD COLUMN "claimed_by_rater_id" uuid;--> statement-breakpoint
ALTER TABLE "member_plans" ADD CONSTRAINT "member_plans_claimed_by_rater_id_raters_id_fk" FOREIGN KEY ("claimed_by_rater_id") REFERENCES "public"."raters"("id") ON DELETE set null ON UPDATE no action;
