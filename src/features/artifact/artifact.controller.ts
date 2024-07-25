import { Controller, Delete, Post, Get, Patch } from '@nestjs/common';
import { Artifact } from '~/modules/database/schema';
import { ArtifactService } from './artifact.service';

import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import typia from 'typia';
import { CreateArtifact, UpdateArtifact } from '~/models/artifact.model';
import { Result } from '~/shared/response';
import { Address, Email, Public } from '../authentication';
import { UserId } from '../authentication/decorators/userId.decorator';

@Controller({ version: '2', path: 'artifacts' })
export class ArtifactController {
  constructor(private artifactService: ArtifactService) {}

  @Post()
  public async createArtifact(
    @TypedBody() body: CreateArtifact,
    @UserId() userId: string,
  ) {
    typia.misc.prune(body);
    (body as unknown as Artifact).creatorId = userId;
    const artifact = await this.artifactService.createArtifact({
      value: body,
    });
    return Result(artifact);
  }

  @Post('check')
  public async checkArtifacts(
    @TypedBody() body: Array<CreateArtifact>,
    @UserId() userId: string,
  ) {
    const checkedArtifacts = await this.artifactService.checkArtifacts({
      value: body,
      userId,
    });
    return Result(checkedArtifacts);
  }

  @Public()
  @Get()
  public async getArtifacts() {
    const artifacts = await this.artifactService.getArtifacts(
      {},
      {
        orderBy(fields, { desc }) {
          return desc(fields.createdAt);
        },
      },
    );
    return Result(artifacts);
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
