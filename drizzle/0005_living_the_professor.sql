ALTER TABLE "attribution" ALTER COLUMN "attributor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "creator_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "license" DROP NOT NULL;