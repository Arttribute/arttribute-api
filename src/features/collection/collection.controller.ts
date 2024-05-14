import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from '~/modules/database/schema';

import { TypedBody, TypedParam } from '@nestia/core';
import typia from 'typia';
import { CreateCollection, UpdateCollection } from '~/models/collection.model';
import { Result } from '~/shared/response';
import { Public } from '../authentication';

@Controller({ version: '2', path: 'collections' })
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post()
  public async createCollection(@TypedBody() body: CreateCollection) {
    typia.misc.prune(body);
    const collection = await this.collectionService.createCollection({
      value: body,
    });

    return Result(collection);
  }

  @Public()
  @Get('/:collectionId')
  public async getCollection(
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    const collection = await this.collectionService.getCollection({
      id: collectionId,
    });
    return Result(collection);
  }

  @Patch('/:collectionId')
  public async updateCollection(
    @TypedBody() delta: UpdateCollection,
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    typia.misc.prune(delta);
    const updatedCollection = await this.collectionService.updateCollection({
      id: collectionId,
      value: delta,
    });
    return Result(updatedCollection);
  }

  @Delete('/:collectionId')
  public async deleteCollection(
    @TypedParam('collectionId') collectionId: Collection['id'],
  ) {
    return this.collectionService.deleteCollection({ id: collectionId });
  }
}
