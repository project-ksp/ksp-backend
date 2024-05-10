ALTER TABLE "leaders" ADD COLUMN "id" varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE "leaders" ADD CONSTRAINT "leaders_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "leader_id" varchar(32);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_leader_id_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "leaders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint