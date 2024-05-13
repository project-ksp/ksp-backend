CREATE TABLE IF NOT EXISTS "delete_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" varchar(32) NOT NULL,
	"proof_url" varchar(256) NOT NULL,
	"status" "member_status" DEFAULT 'diproses' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "delete_requests" ADD CONSTRAINT "delete_requests_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
