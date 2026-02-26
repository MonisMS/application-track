CREATE TABLE "vault_snippet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "twitter_url" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "resume_file_key" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "resume_file_name" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "resume_mime_type" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "resume_uploaded_at" timestamp;--> statement-breakpoint
ALTER TABLE "vault_snippet" ADD CONSTRAINT "vault_snippet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;