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
import {
  CreateCollectionItem,
  UpdateCollectionItem,
} from '~/models/collection-item.model';
import {
  InsertCollectionItem,
  collectionItemTable,
} from '~/modules/database/schema';
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';

type Tables = typeof tables;

module CollectionItemService {
  export type CollectionItemTableQuery = DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<Tables>,
    ExtractTablesWithRelations<Tables>['collectionItemTable']
  >;
}

@Injectable()
export class CollectionItemService {
  constructor(private databaseService: DatabaseService) {}

  public async createCollectionItem(props: { value: CreateCollectionItem }) {
    const { value } = props;
    let collectionItemEntry = await this.databaseService
      .insert(collectionItemTable)
      .values(typia.misc.assertPrune<InsertCollectionItem>(value))
      .returning()
      .then(first);

    if (!collectionItemEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating collection item',
      );
    }

    return collectionItemEntry;
  }

  public async getCollectionItem(props: {
    collectionId: string;
    artifactId: string;
  }) {
    const { artifactId, collectionId } = props;

    const collectionItemEntry = await this.getCollectionItems(
      {},
      {
        where: (t, {}) =>
          and(eq(t.collectionId, collectionId), eq(t.artifactId, artifactId)),
      },
    ).then(first);

    if (!collectionItemEntry) {
      throw new NotFoundException(
        `Collection item of artifact id: ${artifactId} from collection id: ${collectionId} not found`,
      );
    }
  }

  public async getCollectionItems(
    props: {},
    options?: CollectionItemService.CollectionItemTableQuery,
  ) {
    const collectionItemEntries =
      await this.databaseService.query.collectionItemTable.findMany({
        ...options,
      });

    return collectionItemEntries;
  }

  public async updateCollectionItem(
    props: {
      collectionId: string;
      artifactId: string;
      value: UpdateCollectionItem;
    },
    options?: CollectionItemService.CollectionItemTableQuery & {
      where?: SQL<unknown>;
    },
  ) {
    const { artifactId, collectionId, value } = props;
    const {
      where: condition = and(
        eq(collectionItemTable.collectionId, collectionId),
        eq(collectionItemTable.artifactId, artifactId),
      ),
    } = options || {};

    const collectionItemEntry = await this.databaseService
      .update(collectionItemTable)
      .set(typia.misc.assertPrune<Partial<InsertCollectionItem>>(value))
      .where(condition)
      .returning()
      .then(first);

    if (!collectionItemEntry) {
      throw new InternalServerErrorException(
        'Error occurred while updating collection item',
      );
    }

    return collectionItemEntry;
  }

  public async deleteCollectionItem(props: {
    collectionId: string;
    artifactId: string;
  }) {
    const { artifactId, collectionId } = props;
    await this.databaseService
      .delete(collectionItemTable)
      .where(
        and(
          eq(collectionItemTable.collectionId, collectionId),
          eq(collectionItemTable.artifactId, artifactId),
        ),
      );
    return;
  }
}
