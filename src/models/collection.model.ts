import { SetRequired } from 'type-fest';
import { Collection } from '~/modules/database/schema';

export interface BaseCollection extends Partial<Collection> {}

export interface CreateCollection
  extends SetRequired<
    Omit<BaseCollection, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>,
    'name'
  > {}

export interface UpdateCollection
  extends Omit<
    BaseCollection,
    'id' | 'creatorId' | 'createdAt' | 'updatedAt'
  > {}
