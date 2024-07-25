import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import {
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { tags } from 'typia';
import { collectionTable } from './collection.schema';
import { artifactTable } from './artifact.schema';

export const collectionItemTable = pgTable('collection_item', {
  collectionId: uuid('collection_id')
    .$type<string & tags.Format<'uuid'>>()
    .notNull()
    .references(() => collectionTable.id),
  artifactId: uuid('artifact_id')
    .$type<string & tags.Format<'uuid'>>()
    .notNull()
    .references(() => artifactTable.id),

  //   createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
  //   updatedBy: uuid('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export type CollectionItem = InferSelectModel<typeof collectionItemTable>;
export type InsertCollectionItem = InferInsertModel<typeof collectionItemTable>;
