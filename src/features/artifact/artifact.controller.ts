import { Controller, Delete, Post, Get, Patch } from '@nestjs/common';
import { Artifact } from '~/modules/database/schema';
import { ArtifactService } from './artifact.service';

import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import typia from 'typia';
import { CreateArtifact, UpdateArtifact } from '~/models/artifact.model';
import { Result } from '~/shared/response';
import { Public } from '../authentication';

@Controller({ version: '2', path: 'artifacts' })
export class ArtifactController {
  constructor(private artifactService: ArtifactService) {}

  @Post()
  public async createArtifact(@TypedBody() body: CreateArtifact) {
    typia.misc.prune(body);
    const artifact = await this.artifactService.createArtifact({
      value: body,
    });
    return Result(artifact);
  }

  @Public()
  @Get('/:artifactId')
  public async getArtifact(
    @TypedParam('artifactId') artifactId: Artifact['id'],
  ) {
    const artifact = await this.artifactService.getArtifact({
      id: artifactId,
    });
    return Result(artifact);
  }

  @Patch('/:artifactId')
  public async updateArtifact(
    @TypedBody() delta: UpdateArtifact,
    @TypedParam('artifactId') artifactId: Artifact['id'],
  ) {
    typia.misc.prune(delta);
    const updatedArtifact = await this.artifactService.updateArtifact({
      id: artifactId,
      value: delta,
    });
    return Result(updatedArtifact);
  }

  @Delete('/:artifactId')
  public async deleteArtifact(
    @TypedParam('artifactId') artifactId: Artifact['id'],
  ) {
    return this.artifactService.deleteArtifact({ id: artifactId });
  }
}
