CREATE TABLE "problem_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"author_id" uuid,
	"author_handle" text NOT NULL,
	"author_display_name" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problem_comments" ADD CONSTRAINT "problem_comments_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_comments" ADD CONSTRAINT "problem_comments_author_id_citizens_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "problem_comments_problem_idx" ON "problem_comments" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "problem_comments_created_idx" ON "problem_comments" USING btree ("created_at");