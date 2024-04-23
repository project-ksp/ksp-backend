DO $$ BEGIN
 CREATE TYPE "education" AS ENUM('sd', 'smp', 'sma', 's1', 's2');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('laki-laki', 'perempuan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "religion" AS ENUM('islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branches" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"kelurahan" varchar(256) NOT NULL,
	"kecamatan" varchar(256) NOT NULL,
	"city" varchar(256) NOT NULL,
	"postal_code" varchar(5) NOT NULL,
	"head_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch_heads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_married" boolean DEFAULT false NOT NULL,
	"spouse" varchar(256),
	"birth_place" varchar(256) NOT NULL,
	"birth_date" date NOT NULL,
	"gender" "gender" NOT NULL,
	"nik" varchar(16) NOT NULL,
	"religion" "religion" NOT NULL,
	"occupation" varchar(256) NOT NULL,
	"address" text NOT NULL,
	"kelurahan" varchar(256) NOT NULL,
	"kecamatan" varchar(256) NOT NULL,
	"city" varchar(256) NOT NULL,
	"postal_code" varchar(5) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"education" "education" NOT NULL,
	"profile_picture_url" varchar(256) NOT NULL,
	"id_picture_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branches" ADD CONSTRAINT "branches_head_id_branch_heads_id_fk" FOREIGN KEY ("head_id") REFERENCES "branch_heads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
