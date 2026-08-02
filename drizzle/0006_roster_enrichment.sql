ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "on_campus" boolean;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "github" text;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "twitter" text;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "industry" text;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "member_type" text;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "joined_at" text;--> statement-breakpoint
ALTER TABLE "directory_profiles" ADD COLUMN IF NOT EXISTS "skills" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "directory_profiles_on_campus_idx" ON "directory_profiles" USING btree ("on_campus");
