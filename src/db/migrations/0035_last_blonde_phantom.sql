ALTER TABLE "loans" ALTER COLUMN "start_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "end_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "dropping_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "dropping_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" DROP COLUMN IF EXISTS "postal_code";