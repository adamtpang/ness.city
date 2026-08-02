CREATE TABLE IF NOT EXISTS "member_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_profile_id" uuid NOT NULL,
	"destination" text NOT NULL,
	"depart_on" text,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "member_plans" ADD CONSTRAINT "member_plans_subject_profile_id_directory_profiles_id_fk" FOREIGN KEY ("subject_profile_id") REFERENCES "public"."directory_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "member_plans_profile_uidx" ON "member_plans" USING btree ("subject_profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_plans_destination_idx" ON "member_plans" USING btree ("destination");
