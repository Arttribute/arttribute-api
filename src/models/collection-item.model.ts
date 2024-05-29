import { Except, SetNonNullable, SetRequired } from 'type-fest';
import { tags } from 'typia';
import { CollectionItem } from '~/modules/database/schema';

export interface BaseCollectionItem extends Partial<CollectionItem> {}

export interface CreateCollectionItem
  extends SetRequired<
    Except<
      SetNonNullable<BaseCollectionItem>,
      'artifactId' | 'createdAt' | 'updatedAt'
    >,
    'collectionId'
  > {
  itemId: string & tags.Format<'uuid'>;
}

export interface UpdateCollectionItem
  extends Except<
    BaseCollectionItem,
    'artifactId' | 'collectionId' | 'createdAt' | 'updatedAt'
  > {}
