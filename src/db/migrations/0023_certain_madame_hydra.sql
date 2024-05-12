CREATE TABLE IF NOT EXISTS "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan" bigint NOT NULL,
	"deposit_id" serial NOT NULL,
	"leader_id" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "monthly_deposits";--> statement-breakpoint
DROP TABLE "monthly_loans";--> statement-breakpoint
ALTER TABLE "deposits" ADD COLUMN "mandatory_deposits" bigint NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_deposit_id_deposits_id_fk" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_leader_id_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "leaders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
