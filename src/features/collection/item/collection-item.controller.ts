import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Artifact, Collection } from '~/modules/database/schema';

import { TypedBody, TypedParam } from '@nestia/core';
import { SetOptional } from 'type-fest';
import typia from 'typia';
import {
  CreateCollectionItem as RawCreateCollectionItem,
  UpdateCollectionItem,
} from '~/models/collection-item.model';
import { Result } from '~/shared/response';
import { CollectionItemService } from './collection-item.service';
import { Address, Email, Public } from '../../authentication';
import { map } from 'lodash';
import { UserId } from '~/features/authentication/decorators/userId.decorator';

export interface CreateCollectionItem
  extends SetOptional<RawCreateCollectionItem, 'collectionId'> {}

@Controller({ version: '2', path: 'collections' })
export class CollectionItemController {
  constructor(private collectionItemService: CollectionItemService) {}

  @Post('/:collectionId/items')
  public async createCollectionItem(
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() body: CreateCollectionItem,
    @UserId() userId: string,
  ) {
    body.collectionId = collectionId;
    typia.misc.prune<CreateCollectionItem>(body);

    const collection = await this.collectionItemService.createCollectionItem({
      value: body as RawCreateCollectionItem,
    });

    return Result(collection);
  }

  @Post('/:collectionId/items/batch')
  public async createCollectionItems(
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() body: Array<CreateCollectionItem>,
    @UserId() userId: string,
  ) {
    body = map(body, (_) => {
      _.collectionId = collectionId;
      return _;
    });
    typia.misc.prune<Array<CreateCollectionItem>>(body);

    const collections = await this.collectionItemService.createCollectionItems({
      value: body as RawCreateCollectionItem[],
    });

    return Result(collections);
  }

  @Public()
  @Get('/:collectionId/items')
  public async getCollectionItems(
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    const collection = await this.collectionItemService.getCollectionItems({
      collectionId,
    });
    return Result(collection);
  }
  @Public()
  @Get('/:collectionId/items/:itemId')
  public async getCollectionItem(
    @TypedParam('itemId') itemId: Artifact['id'],
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    const collection = await this.collectionItemService.getCollectionItem({
      collectionId,
      artifactId: itemId,
    });
    return Result(collection);
  }

  @Patch('/:collectionId/items/:itemId')
  public async updateCollectionItem(
    @TypedParam('itemId') itemId: Artifact['id'],
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() delta: UpdateCollectionItem,
  ) {
    typia.misc.prune(delta);
    const updatedCollection =
      await this.collectionItemService.updateCollectionItem({
        collectionId,
        artifactId: itemId,
        delta,
      });
    return Result(updatedCollection);
  }

  @Delete('/:collectionId/items/:itemId')
  public async deleteCollectionItem(
    @TypedParam('itemId') itemId: Artifact['id'],
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    return this.collectionItemService.deleteCollectionItem({
      collectionId,
      artifactId: itemId,
    });
  }
}
