ALTER TABLE "members" ALTER COLUMN "total_saving" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "total_loan" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "branch_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
