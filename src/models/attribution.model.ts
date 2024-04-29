import { Attribution } from '~/modules/database/schema';

export interface BaseAttribution extends Partial<Attribution> {}

export interface CreateAttribution extends BaseAttribution {}

export interface UpdateAttribution extends BaseAttribution {}
