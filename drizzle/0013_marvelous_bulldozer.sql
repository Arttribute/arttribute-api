ALTER TABLE "artifact" DROP CONSTRAINT "artifact_artifact_hash_unique";--> statement-breakpoint
ALTER TABLE "artifact" DROP COLUMN IF EXISTS "artifact_hash";