ALTER TABLE "raters" ADD COLUMN IF NOT EXISTS "invite_code" text;--> statement-breakpoint
ALTER TABLE "raters" ADD COLUMN IF NOT EXISTS "referred_by" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "raters_invite_code_uidx" ON "raters" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "raters_referred_by_idx" ON "raters" USING btree ("referred_by");
