CREATE TABLE IF NOT EXISTS "deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"principal_deposits" bigint NOT NULL,
	"voluntary_deposits" bigint NOT NULL,
	"member_id" varchar(32),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monthly_deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" smallint NOT NULL,
	"deposit" bigint NOT NULL,
	"deposit_id" serial NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	CONSTRAINT "monthly_deposits_month_unique" UNIQUE("month")
);
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "id" SET DATA TYPE varchar(32);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deposits" ADD CONSTRAINT "deposits_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monthly_deposits" ADD CONSTRAINT "monthly_deposits_deposit_id_deposits_id_fk" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
