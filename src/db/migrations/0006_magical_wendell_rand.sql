CREATE TABLE IF NOT EXISTS "members" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"nik" varchar(16) NOT NULL,
	"gender" "gender" NOT NULL,
	"leader" varchar(256) NOT NULL,
	"total_saving" integer DEFAULT 0 NOT NULL,
	"total_loan" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "members_nik_unique" UNIQUE("nik")
);
