import { Except, SetNonNullable, SetRequired } from 'type-fest';
import { Collection } from '~/modules/database/schema';

export interface BaseCollection extends Partial<Collection> {}

export interface CreateCollection
  extends SetRequired<
    Except<
      SetNonNullable<BaseCollection>,
      'id' | 'creatorId' | 'createdAt' | 'updatedAt'
    >,
    'name'
  > {}

export interface UpdateCollection
  extends Except<
    BaseCollection,
    'id' | 'creatorId' | 'createdAt' | 'updatedAt'
  > {}
