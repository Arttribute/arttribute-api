import { config } from 'dotenv';
config();

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/modules/database/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.SUPABASE_POSTGRES_HOST || '',
    port: parseInt(process.env.SUPABASE_POSTGRES_PORT || '') || undefined,
    database: process.env.SUPABASE_POSTGRES_DATABASE || '',
    user: process.env.SUPABASE_POSTGRES_USER || '',
    password: process.env.SUPABASE_POSTGRES_PASSWORD || '',
  },
} satisfies Config;
