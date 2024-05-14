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

export const arttributeLicenseEnum = pgEnum('arttribute_license', [
  'Open', // Open
  'Exclusive', // Exclusive
  'Non-Commercial', // Non-Commercial
  'Exclusive Non-Commercial', // Exclusive Non-Commercial
]);

export type ArttributeLicense =
  (typeof arttributeLicenseEnum.enumValues)[number];

export const artifactTable = pgTable('artifact', {
  id: uuid('artifact_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .$type<string & tags.Format<'uuid'>>(),

  name: text('name'),
  license: arttributeLicenseEnum('license'),

  creatorId: text('creator_id'),

  imageUrl: text('image_url'),
  artifactHash: text('artifact_hash').notNull().unique(),

  whitelist: jsonb('whitelist')
    .$type<Array<string & tags.Format<'uuid'>>>()
    .default(sql`'[]'::jsonb`),
  blacklist: jsonb('blacklist')
    .$type<Array<string & tags.Format<'uuid'>>>()
    .default(sql`'[]'::jsonb`),

  //   createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
  //   updatedBy: uuid('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
});

export type Artifact = InferSelectModel<typeof artifactTable>;
export type InsertArtifact = InferInsertModel<typeof artifactTable>;
