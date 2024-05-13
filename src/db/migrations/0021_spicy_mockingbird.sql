CREATE TABLE IF NOT EXISTS "monthly_loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" smallint NOT NULL,
	"loan" bigint NOT NULL,
	"branch_id" serial NOT NULL,
	"leader_id" varchar(32) NOT NULL,
	"deposit_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monthly_loans" ADD CONSTRAINT "monthly_loans_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monthly_loans" ADD CONSTRAINT "monthly_loans_leader_id_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "leaders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monthly_loans" ADD CONSTRAINT "monthly_loans_deposit_id_deposits_id_fk" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
