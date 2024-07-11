import { Module, forwardRef } from '@nestjs/common';
import { CollectionItemActionsController } from './collection-item-actions.controller';
import { CollectionItemModule } from '../collection-item.module';
// import { CollectionItemActionsService } from './collection-item-actions.service';

@Module({
  imports: [forwardRef(() => CollectionItemModule)],
  controllers: [CollectionItemActionsController],
  //   providers: [CollectionItemActionsService],
  //   exports: [CollectionItemActionsService],
})
export class CollectionItemActionsModule {}
