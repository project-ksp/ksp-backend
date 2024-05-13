CREATE TABLE IF NOT EXISTS "tellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
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
	"branch_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tellers" ADD CONSTRAINT "tellers_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
