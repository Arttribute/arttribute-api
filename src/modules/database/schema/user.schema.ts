import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { tags } from 'typia';

export const userTable = pgTable('user', {
  id: uuid('user_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .$type<string & tags.Format<'uuid'>>(),

  email: text('email').unique(),
  web3Address: text('web3_address').unique(),

  //   createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
  //   updatedBy: uuid('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export type User = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;
