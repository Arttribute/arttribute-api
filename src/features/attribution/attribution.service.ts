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
import { DatabaseService } from '~/modules/database/database.service';
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
  constructor(private databaseService: DatabaseService) {}

  public async createAttribution(props: { value: CreateAttribution }) {
    const { value } = props;
    let attributionEntry = await this.databaseService
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

    return attributionEntry;
  }

  public async getAttributions(
    props: {},
    options?: AttributionService.AttributionTableQuery,
  ) {
    const attributionEntries =
      await this.databaseService.query.attributionTable.findMany({
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

    const attributionEntry = await this.databaseService
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
    await this.databaseService
      .delete(attributionTable)
      .where(eq(attributionTable.id, id));
    return;
  }
}
