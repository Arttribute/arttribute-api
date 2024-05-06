import { Injectable } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';

@Injectable()
export class StorageService extends StorageClient {
  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.warn('SUPABASE_URL and SUPABASE_KEY are required');
    }
    super(process.env.SUPABASE_STORAGE_URL || 'unavailable', {
      apikey: process.env.SUPABASE_KEY || 'unavailable',
      Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
    });
    this.createBucket('artifacts', {
      fileSizeLimit: 2 ** 20 * 10, // 10 megabytes
      public: true,
    }).then((val) => {
      if (val.error) {
        console.error(`Error creating storage bucket: ${val.error.message}`);
        return;
      }
      console.log(`Create storage bucket: ${val.data?.name}`);
    });
  }
}
