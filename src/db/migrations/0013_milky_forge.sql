ALTER TABLE "members" ADD COLUMN "is_married" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "spouse" varchar(256);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "birth_place" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "birth_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "religion" "religion" NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "occupation" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "kelurahan" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "kecamatan" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "city" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "postal_code" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "education" "education" NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "phone_number" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "profile_picture_url" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "id_picture_url" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "user_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
