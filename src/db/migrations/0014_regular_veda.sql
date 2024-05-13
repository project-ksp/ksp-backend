DO $$ BEGIN
 CREATE TYPE "member_status" AS ENUM('diproses', 'belum disetujui', 'disetujui', 'ditolak');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "status" "member_status" DEFAULT 'diproses';--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "total_saving";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "total_loan";