import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { AttributionService } from '~/features/attribution/attribution.service';
import { Attribution, attributionTable } from '~/modules/database/schema';
import { Result } from '~/shared/response';

@Controller({ version: '2', path: 'users/:userId/attributions' })
export class UserAttributionController {
  constructor(private attributionService: AttributionService) {}

  @Get()
  public async getAttributions(
    @TypedParam('userId') userId: NonNullable<Attribution['attributorId']>,
  ) {
    const attributions = await this.attributionService.getAttributions(
      {},
      { where: eq(attributionTable.attributorId, userId) },
    );
    return Result(attributions);
  }
}
