import { config } from 'dotenv';
config();

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const isLambda = Boolean(process.env.LAMBDA_TASK_ROOT);

const drizzleClient = drizzle(
  postgres({
    host: process.env.SUPABASE_POSTGRES_HOST || '',
    port: isLambda
      ? 6543
      : parseInt(process.env.SUPABASE_POSTGRES_PORT || '') || undefined,
    database: process.env.SUPABASE_POSTGRES_DATABASE || '',
    user: process.env.SUPABASE_POSTGRES_USER || '',
    password: process.env.SUPABASE_POSTGRES_PASSWORD || '',
    prepare: isLambda ? false : undefined,
  }),
);

migrate(drizzleClient, { migrationsFolder: 'drizzle' })
  .then(() => {
    console.log('Successfully migrated database');
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
