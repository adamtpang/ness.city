DO $$ BEGIN
  CREATE TYPE "public"."gathering_kind" AS ENUM('event', 'meal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gatherings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "gathering_kind" NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"place" text,
	"starts_at" timestamp with time zone NOT NULL,
	"host_id" uuid,
	"host_handle" text NOT NULL,
	"host_display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);--> statement-breakpoint
ALTER TABLE "gatherings" ADD CONSTRAINT "gatherings_host_id_citizens_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gatherings_kind_idx" ON "gatherings" USING btree ("kind");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gatherings_starts_at_idx" ON "gatherings" USING btree ("starts_at");
