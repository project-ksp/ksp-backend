ALTER TABLE "loans" ADD COLUMN "status" "member_status" DEFAULT 'diproses' NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "updated_at" timestamp DEFAULT now();