import { CollectionItem } from '~/modules/database/schema';

export interface BaseCollectionItem extends Partial<CollectionItem> {}

export interface CreateCollectionItem extends BaseCollectionItem {}

export interface UpdateCollectionItem extends BaseCollectionItem {}
