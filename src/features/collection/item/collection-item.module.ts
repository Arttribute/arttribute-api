import { Module } from '@nestjs/common';
import { CollectionItemController } from './collection-item.controller';
import { CollectionItemService } from './collection-item.service';

@Module({
  imports: [],
  controllers: [CollectionItemController],
  providers: [CollectionItemService],
  exports: [CollectionItemService],
})
export class CollectionItemModule {}
