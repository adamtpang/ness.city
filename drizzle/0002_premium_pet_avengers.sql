CREATE TYPE "public"."market_contact" AS ENUM('whatsapp', 'email', 'discord', 'telegram');--> statement-breakpoint
CREATE TYPE "public"."market_kind" AS ENUM('forsale', 'free', 'wanted', 'housing', 'service', 'ride', 'community');--> statement-breakpoint
CREATE TYPE "public"."market_status" AS ENUM('open', 'claimed', 'expired');--> statement-breakpoint
CREATE TABLE "market_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "market_kind" NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"price_cents" integer,
	"rate" text,
	"seller_id" uuid,
	"seller_handle" text NOT NULL,
	"seller_display_name" text NOT NULL,
	"contact_kind" "market_contact" NOT NULL,
	"contact_value" text NOT NULL,
	"status" "market_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "market_listings" ADD CONSTRAINT "market_listings_seller_id_citizens_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "market_listings_status_idx" ON "market_listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "market_listings_kind_idx" ON "market_listings" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "market_listings_seller_idx" ON "market_listings" USING btree ("seller_handle");