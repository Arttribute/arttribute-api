import { Injectable, Provider } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export interface DatabaseService extends PostgresJsDatabase<typeof schema> {}

@Injectable()
export class DatabaseService {}

export const DatabaseServiceProvider: Provider = {
  provide: DatabaseService,
  useFactory: () => {
    const isLambda = Boolean(process.env.LAMBDA_TASK_ROOT);

    return drizzle(
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
      { schema },
    );
  },
};
