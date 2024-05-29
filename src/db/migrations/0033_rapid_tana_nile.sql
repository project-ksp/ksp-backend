ALTER TABLE "loans" ALTER COLUMN "start_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "end_date" DROP NOT NULL;