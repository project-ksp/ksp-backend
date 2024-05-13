ALTER TABLE "delete_requests" DROP CONSTRAINT "delete_requests_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" DROP CONSTRAINT "loans_deposit_id_deposits_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "delete_requests" ADD CONSTRAINT "delete_requests_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deposits" ADD CONSTRAINT "deposits_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_deposit_id_deposits_id_fk" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
