import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService extends SupabaseClient {
  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.warn('SUPABASE_URL and SUPABASE_KEY are required');
    }
    super(
      process.env.SUPABASE_URL || 'unavailable',
      process.env.SUPABASE_KEY || 'unavailable',
    );
    this.storage
      .createBucket('artifacts', {
        fileSizeLimit: 2 ** 20 * 10, // 10 megabytes
        public: true,
      })
      .then((val) => {
        if (val.error) {
          console.error(`Error creating storage bucket: ${val.error.message}`);
          return;
        }
        console.log(`Create storage bucket: ${val.data?.name}`);
      });
  }
}
