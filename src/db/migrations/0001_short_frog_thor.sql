ALTER TABLE "users" ADD COLUMN "name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "branch_heads" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "tellers" DROP COLUMN IF EXISTS "name";