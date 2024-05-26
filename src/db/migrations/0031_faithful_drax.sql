ALTER TABLE "branch_heads" DROP COLUMN IF EXISTS "postal_code";--> statement-breakpoint
ALTER TABLE "branch_heads" DROP COLUMN IF EXISTS "profile_picture_url";--> statement-breakpoint
ALTER TABLE "leaders" DROP COLUMN IF EXISTS "postal_code";--> statement-breakpoint
ALTER TABLE "leaders" DROP COLUMN IF EXISTS "profile_picture_url";--> statement-breakpoint
ALTER TABLE "tellers" DROP COLUMN IF EXISTS "postal_code";--> statement-breakpoint
ALTER TABLE "tellers" DROP COLUMN IF EXISTS "profile_picture_url";