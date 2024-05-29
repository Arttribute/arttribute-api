import { Module, forwardRef } from '@nestjs/common';
import { UserArtifactController } from './user-artifact.controller';
import { ArtifactModule } from '~/features/artifact';

@Module({
  imports: [forwardRef(() => ArtifactModule)],
  controllers: [UserArtifactController],
  providers: [],
  exports: [],
})
export class UserArtifactModule {}
