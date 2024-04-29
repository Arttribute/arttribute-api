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
import { CreateArtifact, UpdateArtifact } from '~/models/artifact.model';
import { InsertArtifact, artifactTable } from '~/modules/database/schema';
import { SupabaseService } from '~/modules/database/supabase';
import * as tables from '~/modules/database/schema';

type Tables = typeof tables;

module ArtifactService {
  export type ArtifactTableQuery = DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<Tables>,
    ExtractTablesWithRelations<Tables>['artifactTable']
  >;
}

@Injectable()
export class ArtifactService {
  constructor(private supabaseService: SupabaseService) {}

  public async createArtifact(props: { value: CreateArtifact }) {
    const { value } = props;
    let artifactEntry = await this.supabaseService.client
      .insert(artifactTable)
      .values(typia.misc.assertPrune<InsertArtifact>(value))
      .returning()
      .then(first);

    if (!artifactEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating artifact',
      );
    }

    return artifactEntry;
  }

  public async getArtifact(props: { id: string }) {
    const { id } = props;

    const artifactEntry = await this.getArtifacts(
      {},
      {
        where: (t, {}) => and(eq(t.id, id)),
      },
    ).then(first);

    if (!artifactEntry) {
      throw new NotFoundException(`Artifact with id: ${id} not found`);
    }
  }

  public async getArtifacts(
    props: {},
    options?: ArtifactService.ArtifactTableQuery,
  ) {
    const artifactEntries =
      await this.supabaseService.client.query.artifactTable.findMany({
        ...options,
      });

    return artifactEntries;
  }

  public async updateArtifact(
    props: { id: string; value: UpdateArtifact },
    options?: ArtifactService.ArtifactTableQuery & { where?: SQL<unknown> },
  ) {
    const { id, value } = props;
    const { where: condition = eq(artifactTable.id, id) } = options || {};

    const artifactEntry = await this.supabaseService.client
      .update(artifactTable)
      .set(typia.misc.assertPrune<Partial<InsertArtifact>>(value))
      .where(condition)
      .returning()
      .then(first);

    if (!artifactEntry) {
      throw new InternalServerErrorException(
        'Error occurred while updating artifact',
      );
    }

    return artifactEntry;
  }

  public async deleteArtifact(props: { id: string }) {
    const { id } = props;
    await this.supabaseService.client
      .delete(artifactTable)
      .where(eq(artifactTable.id, id));
    return;
  }
}
