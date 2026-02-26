CREATE TYPE "public"."source" AS ENUM('wellfound', 'linkedin', 'referral', 'twitter', 'cold_email', 'other');--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"resume_url" text,
	"portfolio_url" text,
	"linkedin_url" text,
	"github_url" text,
	"default_follow_up_days" integer DEFAULT 7 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "source" "source" DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "job_url" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "contact_url" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "last_contacted_at" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;