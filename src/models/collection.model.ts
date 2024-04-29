import { Collection } from '~/modules/database/schema';

export interface BaseCollection extends Partial<Collection> {}

export interface CreateCollection extends BaseCollection {}

export interface UpdateCollection extends BaseCollection {}
