import { Except, SetNonNullable, SetRequired } from 'type-fest';
import { Attribution } from '~/modules/database/schema';

// export interface BaseAttribution extends Partial<Attribution> { }
export type BaseAttribution =
  | SetRequired<
      Partial<Except<SetNonNullable<Attribution>, 'artifactId'>>,
      'collectionId'
    >
  | SetRequired<
      Partial<Except<SetNonNullable<Attribution>, 'collectionId'>>,
      'artifactId'
    >;

export type CreateAttribution = Except<
  SetNonNullable<BaseAttribution>,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateAttribution = Except<
  BaseAttribution,
  'id' | 'createdAt' | 'updatedAt'
>;
