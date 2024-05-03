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

export const collectionTable = pgTable('collection', {
  id: uuid('collection_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .$type<string & tags.Format<'uuid'>>(),
  creator: text('creator_id'),

  name: text('name').notNull(),

  license: text('license'),

  whitelist: jsonb('whitelist')
    .$type<Array<string & tags.Format<'uuid'>>>()
    .default(sql`'[]'::jsonb`),
  blacklist: jsonb('blacklist')
    .$type<Array<string & tags.Format<'uuid'>>>()
    .default(sql`'[]'::jsonb`),

  //   createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(
    sql`timezone('utc', now())`,
  ),
  //   updatedBy: uuid('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(
    sql`timezone('utc', now())`,
  ),
});

export type Collection = InferSelectModel<typeof collectionTable>;
export type InsertCollection = InferInsertModel<typeof collectionTable>;
