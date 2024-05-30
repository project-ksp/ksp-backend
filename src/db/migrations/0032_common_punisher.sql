ALTER TABLE "tellers" ALTER COLUMN "phone_number" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "join_date" date;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "request_date" date;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "dropping_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "verified";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "verified";