CREATE TABLE IF NOT EXISTS "artifact" (
	"artifact_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"creator_id" text NOT NULL,
	"license" text NOT NULL,
	"image_url" text NOT NULL,
	"artifact_hash" text NOT NULL,
	"whitelist" jsonb NOT NULL,
	"blacklist" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT timezone('utc', now()),
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT timezone('utc', now())
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection" (
	"collection_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"creator_id" text NOT NULL,
	"license" text NOT NULL,
	"whitelist" jsonb NOT NULL,
	"blacklist" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT timezone('utc', now()),
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT timezone('utc', now())
);
