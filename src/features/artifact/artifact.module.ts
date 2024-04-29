import { Module } from '@nestjs/common';
import { ArtifactController } from './artifact.controller';
import { ArtifactService } from './artifact.service';

@Module({
  imports: [],
  controllers: [ArtifactController],
  providers: [ArtifactService],
  exports: [ArtifactService],
})
export class ArtifactModule {}
