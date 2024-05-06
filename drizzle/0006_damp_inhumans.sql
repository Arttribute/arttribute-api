DO $$ BEGIN
 CREATE TYPE "arttribute_license" AS ENUM('MIT', 'GPL', 'Apache', 'BSD', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "artifact" DROP COLUMN "license";--> statement-breakpoint
ALTER TABLE "artifact" ADD COLUMN "license" arttribute_license;--> statement-breakpoint
ALTER TABLE "collection" DROP COLUMN "license";--> statement-breakpoint
ALTER TABLE "collection" ADD COLUMN "license" arttribute_license;