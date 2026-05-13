CREATE TABLE "directory_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"role" text,
	"location" text,
	"bio" text,
	"external_id" text,
	"source" text DEFAULT 'ns_directory' NOT NULL,
	"scraped_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "directory_profiles_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE INDEX "directory_profiles_handle_idx" ON "directory_profiles" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "directory_profiles_display_name_idx" ON "directory_profiles" USING btree ("display_name");