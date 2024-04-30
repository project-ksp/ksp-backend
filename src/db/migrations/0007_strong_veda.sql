ALTER TABLE "branches" DROP CONSTRAINT "branches_head_id_branch_heads_id_fk";
--> statement-breakpoint
ALTER TABLE "branch_heads" ADD COLUMN "branch_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branch_heads" ADD CONSTRAINT "branch_heads_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "branches" DROP COLUMN IF EXISTS "head_id";