DO $$ BEGIN
 CREATE TYPE "arttribute_license" AS ENUM('O', 'E', 'NC', 'ENC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "artifact" ADD COLUMN "license" "arttribute_license";--> statement-breakpoint
ALTER TABLE "collection" ADD COLUMN "license" "arttribute_license";