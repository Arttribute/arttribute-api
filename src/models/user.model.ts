import { Except, SetNonNullable, SetRequired } from 'type-fest';
import { User } from '~/modules/database/schema';

export interface BaseUser extends Partial<User> {}

export interface CreateUser extends Except<SetNonNullable<BaseUser>, 'id'> {}

export interface UpdateUser extends Except<BaseUser, 'id'> {}
