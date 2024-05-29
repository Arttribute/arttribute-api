import { Module } from '@nestjs/common';
import { UserArtifactModule } from './artifact';
import { UserAttributionModule } from './attribution';
import { UserCollectionModule } from './collection';

@Module({
  imports: [UserArtifactModule, UserAttributionModule, UserCollectionModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
