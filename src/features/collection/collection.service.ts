import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DBQueryConfig,
  ExtractTablesWithRelations,
  SQL,
  and,
  eq,
} from 'drizzle-orm';
import { first } from 'lodash';
import typia from 'typia';
import { CreateCollection, UpdateCollection } from '~/models/collection.model';
import { InsertCollection, collectionTable } from '~/modules/database/schema';
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';

type Tables = typeof tables;

module CollectionService {
  export type CollectionTableQuery = DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<Tables>,
    ExtractTablesWithRelations<Tables>['collectionTable']
  >;
}

@Injectable()
export class CollectionService {
  constructor(private databaseService: DatabaseService) {}

  public async createCollection(props: { value: CreateCollection }) {
    const { value } = props;
    let collectionEntry = await this.databaseService
      .insert(collectionTable)
      .values(typia.misc.assertPrune<InsertCollection>(value))
      .returning()
      .then(first);

    if (!collectionEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating collection',
      );
    }

    return collectionEntry;
  }

  public async getCollection(props: { id: string }) {
    const { id } = props;

    const collectionEntry = await this.getCollections(
      {},
      {
        where: (t, {}) => and(eq(t.id, id)),
      },
    ).then(first);

    if (!collectionEntry) {
      throw new NotFoundException(`Collection with id: ${id} not found`);
    }

    return collectionEntry;
  }

  public async getCollections(
    props: {},
    options?: CollectionService.CollectionTableQuery,
  ) {
    const collectionEntries =
      await this.databaseService.query.collectionTable.findMany({
        ...options,
      });

    return collectionEntries;
  }

  public async updateCollection(
    props: { id: string; value: UpdateCollection },
    options?: CollectionService.CollectionTableQuery & { where?: SQL<unknown> },
  ) {
    const { id, value } = props;
    const { where: condition = eq(collectionTable.id, id) } = options || {};

    const collectionEntry = await this.databaseService
      .update(collectionTable)
      .set(typia.misc.assertPrune<Partial<InsertCollection>>(value))
      .where(condition)
      .returning()
      .then(first);

    if (!collectionEntry) {
      throw new InternalServerErrorException(
        'Error occurred while updating collection',
      );
    }

    return collectionEntry;
  }

  public async deleteCollection(props: { id: string }) {
    const { id } = props;
    await this.databaseService
      .delete(collectionTable)
      .where(eq(collectionTable.id, id));
    return;
  }
}
