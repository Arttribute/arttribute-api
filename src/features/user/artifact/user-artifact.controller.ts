import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ArtifactService } from '~/features/artifact/artifact.service';
import { Artifact, artifactTable } from '~/modules/database/schema';
import { Result } from '~/shared/response';

@Controller({ version: '2', path: 'users/:userId/artifacts' })
export class UserArtifactController {
  constructor(private artifactService: ArtifactService) {}

  @Get()
  public async getArtifacts(
    @TypedParam('userId') userId: NonNullable<Artifact['creatorId']>,
  ) {
    const artifacts = await this.artifactService.getArtifacts(
      {},
      { where: eq(artifactTable.creatorId, userId) },
    );
    return Result(artifacts);
  }
}
