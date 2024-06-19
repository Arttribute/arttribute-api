import { Module } from '@nestjs/common';
import { CollectionItemController } from './collection-item.controller';
import { CollectionItemService } from './collection-item.service';
import { CollectionItemActionsModule } from './actions';

@Module({
  imports: [CollectionItemActionsModule],
  controllers: [CollectionItemController],
  providers: [CollectionItemService],
  exports: [CollectionItemService],
})
export class CollectionItemModule {}
