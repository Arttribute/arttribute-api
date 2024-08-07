import { Controller, Post } from '@nestjs/common';
import { CollectionItemService } from '../collection-item.service';
import { TypedParam, TypedBody } from '@nestia/core';
import { Artifact, Collection } from '~/modules/database/schema';
import { map } from 'lodash';
import typia from 'typia';
import { Result } from '~/shared/response';
import { Address } from '~/features/authentication';
import { CreateCollectionItem } from '../collection-item.controller';

@Controller({ version: '2', path: 'collections/:collectionId/items' })
export class CollectionItemActionsController {
  constructor(private collectionItemService: CollectionItemService) {}

  @Post('add')
  public async addCollectionItem(
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() body: string,
    @Address() address: string,
  ) {
    const collection = await this.collectionItemService.createCollectionItem({
      value: { collectionId, itemId: body },
    });

    return Result(collection);
  }

  @Post('add/batch')
  public async addCollectionItems(
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() body: Array<string>,
    @Address() address: string,
  ) {
    const collection = await this.collectionItemService.createCollectionItems({
      value: map(body, (itemId) => ({ collectionId, itemId })),
    });

    return Result(collection);
  }
}
