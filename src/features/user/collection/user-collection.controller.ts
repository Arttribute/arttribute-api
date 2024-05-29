import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Public } from '~/features/authentication';
import { CollectionService } from '~/features/collection/collection.service';
import { Collection, collectionTable } from '~/modules/database/schema';
import { Result } from '~/shared/response';

@Controller({ version: '2', path: 'users/:userId/collections' })
export class UserCollectionController {
  constructor(private collectionService: CollectionService) {}

  @Public()
  @Get()
  public async getCollections(
    @TypedParam('userId') userId: NonNullable<Collection['creatorId']>,
  ) {
    const collections = await this.collectionService.getCollections(
      {},
      { where: eq(collectionTable.creatorId, userId) },
    );
    return Result(collections);
  }
}
