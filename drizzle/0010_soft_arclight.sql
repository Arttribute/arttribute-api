ALTER TYPE "arttribute_license" RENAME VALUE 'O' TO 'Open';--> statement-breakpoint
ALTER TYPE "arttribute_license" RENAME VALUE 'E' TO 'Exclusive';--> statement-breakpoint
ALTER TYPE "arttribute_license" RENAME VALUE 'NC' TO 'Non-Commercial';--> statement-breakpoint
ALTER TYPE "arttribute_license" RENAME VALUE 'ENC' TO 'Exclusive Non-Commercial';--> statement-breakpoint
ALTER TABLE "collection_item" DROP CONSTRAINT "collection_item_artifact_id_collection_collection_id_fk";
--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attribution" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attribution" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_artifact_id_artifact_artifact_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "artifact"("artifact_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
