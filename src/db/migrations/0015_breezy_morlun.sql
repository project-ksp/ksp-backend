ALTER TABLE "members" DROP CONSTRAINT "members_leader_id_leaders_id_fk";
--> statement-breakpoint
ALTER TABLE "leaders" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "leader_id";