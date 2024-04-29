CREATE TABLE IF NOT EXISTS "attribution" (
	"attribution_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"fk_artifact_id" uuid,
	"fk_collection_id" uuid,
	"attributor_id" text NOT NULL,
	"is_valid" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT timezone('utc', now()),
	"updated_at" timestamp with time zone DEFAULT timezone('utc', now())
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection_item" (
	"collection_id" uuid NOT NULL,
	"artifact_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc', now()),
	"updated_at" timestamp with time zone DEFAULT timezone('utc', now())
);
--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "whitelist" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "whitelist" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "blacklist" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "artifact" ALTER COLUMN "blacklist" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "whitelist" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "whitelist" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "blacklist" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "collection" ALTER COLUMN "blacklist" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact" DROP COLUMN IF EXISTS "created_by";--> statement-breakpoint
ALTER TABLE "artifact" DROP COLUMN IF EXISTS "updated_by";--> statement-breakpoint
ALTER TABLE "collection" DROP COLUMN IF EXISTS "created_by";--> statement-breakpoint
ALTER TABLE "collection" DROP COLUMN IF EXISTS "updated_by";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribution" ADD CONSTRAINT "attribution_fk_artifact_id_artifact_artifact_id_fk" FOREIGN KEY ("fk_artifact_id") REFERENCES "artifact"("artifact_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribution" ADD CONSTRAINT "attribution_fk_collection_id_collection_collection_id_fk" FOREIGN KEY ("fk_collection_id") REFERENCES "collection"("collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collection_id_collection_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collection"("collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_artifact_id_collection_collection_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "collection"("collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
