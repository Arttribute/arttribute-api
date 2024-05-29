import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import {
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';
import { tags } from 'typia';
import { artifactTable } from './artifact.schema';
import { collectionTable } from './collection.schema';

export const attributionTable = pgTable('attribution', {
  id: uuid('attribution_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .$type<string & tags.Format<'uuid'>>(),

  artifactId: uuid('fk_artifact_id').references(() => artifactTable.id),
  collectionId: uuid('fk_collection_id').references(() => collectionTable.id),

  attributorId: text('attributor_id'),
  isValid: boolean('is_valid').notNull().default(true),

  expiresAt: timestamp('expires_at', { withTimezone: true }),

  //   createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
  //   updatedBy: uuid('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
});

export type Attribution = InferSelectModel<typeof attributionTable>;
export type InsertAttribution = InferInsertModel<typeof attributionTable>;
