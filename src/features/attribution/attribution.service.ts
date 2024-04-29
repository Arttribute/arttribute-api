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
  CreateAttribution,
  UpdateAttribution,
} from '~/models/attribution.model';
import { InsertAttribution, attributionTable } from '~/modules/database/schema';
import { SupabaseService } from '~/modules/database/supabase';
import * as tables from '~/modules/database/schema';

type Tables = typeof tables;

module AttributionService {
  export type AttributionTableQuery = DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<Tables>,
    ExtractTablesWithRelations<Tables>['attributionTable']
  >;
}

@Injectable()
export class AttributionService {
  constructor(private supabaseService: SupabaseService) {}

  public async createAttribution(props: { value: CreateAttribution }) {
    const { value } = props;
    let attributionEntry = await this.supabaseService.client
      .insert(attributionTable)
      .values(typia.misc.assertPrune<InsertAttribution>(value))
      .returning()
      .then(first);

    if (!attributionEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating attribution',
      );
    }

    return attributionEntry;
  }

  public async getAttribution(props: { id: string }) {
    const { id } = props;

    const attributionEntry = await this.getAttributions(
      {},
      {
        where: (t, {}) => and(eq(t.id, id)),
      },
    ).then(first);

    if (!attributionEntry) {
      throw new NotFoundException(`Attribution with id: ${id} not found`);
    }
  }

  public async getAttributions(
    props: {},
    options?: AttributionService.AttributionTableQuery,
  ) {
    const attributionEntries =
      await this.supabaseService.client.query.attributionTable.findMany({
        ...options,
      });

    return attributionEntries;
  }

  public async updateAttribution(
    props: { id: string; value: UpdateAttribution },
    options?: AttributionService.AttributionTableQuery & {
      where?: SQL<unknown>;
    },
  ) {
    const { id, value } = props;
    const { where: condition = eq(attributionTable.id, id) } = options || {};

    const attributionEntry = await this.supabaseService.client
      .update(attributionTable)
      .set(typia.misc.assertPrune<Partial<InsertAttribution>>(value))
      .where(condition)
      .returning()
      .then(first);

    if (!attributionEntry) {
      throw new InternalServerErrorException(
        'Error occurred while updating attribution',
      );
    }

    return attributionEntry;
  }

  public async deleteAttribution(props: { id: string }) {
    const { id } = props;
    await this.supabaseService.client
      .delete(attributionTable)
      .where(eq(attributionTable.id, id));
    return;
  }
}
