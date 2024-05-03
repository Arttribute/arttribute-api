ALTER TABLE "artifact" ALTER COLUMN "license" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "creator_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "image_url" DROP NOT NULL;