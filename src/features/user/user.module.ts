import { Module } from '@nestjs/common';
import { UserArtifactModule } from './artifact';
import { UserAttributionModule } from './attribution';
import { UserCollectionModule } from './collection';
import { UserService } from './user.service';

@Module({
  imports: [UserArtifactModule, UserAttributionModule, UserCollectionModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
