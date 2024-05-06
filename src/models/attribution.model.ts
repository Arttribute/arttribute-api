import { SetRequired } from 'type-fest';
import { Attribution } from '~/modules/database/schema';

// export interface BaseAttribution extends Partial<Attribution> { }
export type BaseAttribution =
  | SetRequired<Partial<Omit<Attribution, 'artifactId'>>, 'collectionId'>
  | SetRequired<Partial<Omit<Attribution, 'collectionId'>>, 'artifactId'>;

export type CreateAttribution = Omit<
  BaseAttribution,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateAttribution = Omit<
  BaseAttribution,
  'id' | 'attributionId' | 'createdAt' | 'updatedAt'
>;
