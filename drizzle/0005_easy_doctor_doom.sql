CREATE TABLE "problem_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"author_handle" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problem_reactions" ADD CONSTRAINT "problem_reactions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "problem_reactions_problem_idx" ON "problem_reactions" USING btree ("problem_id");--> statement-breakpoint
CREATE UNIQUE INDEX "problem_reactions_unique" ON "problem_reactions" USING btree ("problem_id","author_handle","emoji");