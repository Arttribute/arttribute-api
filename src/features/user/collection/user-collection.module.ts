import { Module, forwardRef } from '@nestjs/common';
import { UserCollectionController } from './user-collection.controller';
import { CollectionModule } from '~/features/collection';

@Module({
  imports: [forwardRef(() => CollectionModule)],
  controllers: [UserCollectionController],
  providers: [],
  exports: [],
})
export class UserCollectionModule {}
