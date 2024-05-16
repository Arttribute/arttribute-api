import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AttributionService } from './attribution.service';
import { Attribution } from '~/modules/database/schema';

import { TypedBody, TypedParam } from '@nestia/core';
import typia from 'typia';
import {
  CreateAttribution,
  UpdateAttribution,
} from '~/models/attribution.model';
import { Result } from '~/shared/response';
import { Address, Public } from '../authentication';

@Controller({ version: '2', path: 'attributions' })
export class AttributionController {
  constructor(private attributionService: AttributionService) {}

  @Post()
  public async createAttribution(
    @TypedBody() body: CreateAttribution,
    @Address() address: string,
  ) {
    typia.misc.prune(body);
    (body as unknown as Attribution).attributorId = address;

    const attribution = await this.attributionService.createAttribution({
      value: body,
    });

    return Result(attribution);
  }

  @Public()
  @Get('/:attributionId')
  public async getAttribution(
    @TypedParam('attributionId') attributionId: Attribution['id'],
  ) {
    const attribution = await this.attributionService.getAttribution({
      id: attributionId,
    });
    return Result(attribution);
  }

  @Patch('/:attributionId')
  public async updateAttribution(
    @TypedBody() delta: UpdateAttribution,
    @TypedParam('attributionId') attributionId: Attribution['id'],
  ) {
    typia.misc.prune(delta);
    const updatedAttribution = await this.attributionService.updateAttribution({
      id: attributionId,
      value: delta,
    });
    return Result(updatedAttribution);
  }

  @Delete('/:attributionId')
  public async deleteAttribution(
    @TypedParam('attributionId') attributionId: Attribution['id'],
  ) {
    return this.attributionService.deleteAttribution({ id: attributionId });
  }
}
