ALTER TABLE "deposits" ALTER COLUMN "member_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "branch_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
