import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { AttributionService } from '~/features/attribution/attribution.service';
import {
  Artifact,
  Attribution,
  Collection,
  attributionTable,
} from '~/modules/database/schema';
import { Result } from '~/shared/response';
import { Address, Public } from '../../authentication';
import { UserAttributionService } from './user-attribution.service';

@Controller({ version: '2', path: 'users' })
export class UserAttributionController {
  constructor(
    private attributionService: AttributionService,
    private userAttributionService: UserAttributionService,
  ) {}

  @Public()
  @Get('me/attributions')
  public async getAttributions(@Address() address: string) {
    const userId = address;
    const attributions = await this.attributionService.getAttributions(
      {},
      { where: eq(attributionTable.attributorId, userId) },
    );
    return Result(attributions);
  }

  @Public()
  @Get('/:userId/attributions')
  public async getAttributionsByUserId(
    @TypedParam('userId') userId: NonNullable<Attribution['attributorId']>,
  ) {
    const attributions = await this.attributionService.getAttributions(
      {},
      { where: eq(attributionTable.attributorId, userId) },
    );
    return Result(attributions);
  }

  @Public()
  @Get('/:userId/attributions/:type/:typeId')
  public async getAttributionsForTypeByUserId(
    @TypedParam('userId') userId: NonNullable<Attribution['attributorId']>,
    @TypedParam('type') type: 'collection' | 'artifact',
    @TypedParam('typeId') typeId: Collection['id'] | Artifact['id'],
  ) {
    const attribution = await this.userAttributionService.getAttributionForType(
      {
        type,
        typeId,
        userId,
      },
    );
    return Result(attribution);
  }
}
