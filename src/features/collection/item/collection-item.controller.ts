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
import { Address, Public } from '../../authentication';

export interface CreateCollectionItem
  extends SetOptional<RawCreateCollectionItem, 'collectionId'> {}

@Controller({ version: '2', path: 'collections' })
export class CollectionItemController {
  constructor(private collectionItemService: CollectionItemService) {}

  @Post('/:collectionId/items')
  public async createCollectionItem(
    @TypedParam('collectionId') collectionId: Collection['id'],
    @TypedBody() body: CreateCollectionItem,
    @Address() address: string,
  ) {
    typia.misc.prune(body);
    body.collectionId = collectionId;
    const collection = await this.collectionItemService.createCollectionItem({
      value: body as RawCreateCollectionItem,
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
