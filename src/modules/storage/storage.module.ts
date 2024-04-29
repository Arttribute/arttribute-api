import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
