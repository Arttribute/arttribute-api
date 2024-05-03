import {
  BadRequestException,
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
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';
import parseDataURL from 'data-urls';
import { DataURL } from 'data-urls';
import { StorageService } from '~/modules/storage/storage.service';
// import phash from 'sharp-phash';
const phash = require('sharp-phash');
import { extension } from 'mime-types';
import { PostgresError } from 'postgres';

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
  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService,
  ) {}

  public async createArtifact(props: { value: CreateArtifact }) {
    const { value } = props;

    const data = parseDataURL(value.asset.data);

    if (!data) {
      throw new InternalServerErrorException(
        'Error occurred while parsing asset',
      );
    }

    const dataBuffer = Buffer.from(data.body);

    const asset = new File(
      [dataBuffer],
      value.asset.name || value.name, // Should add a string to the filename
      {
        type: value.asset.mimetype || data.mimeType.essence,
      },
    );

    const filename = `${asset.name}.${extension(asset.type)}`;

    const [artifactHash] = await Promise.all([
      phash(dataBuffer),
      this.storageService.storage.from('artifacts').upload(filename, asset, {
        upsert: false,
      }),
    ]);

    const {
      data: { publicUrl },
    } = await this.storageService.storage
      .from('artifacts')
      .getPublicUrl(filename);

    let artifactEntry = await this.databaseService
      .insert(artifactTable)
      .values(
        typia.misc.assertPrune<InsertArtifact>({
          ...value,
          imageUrl: publicUrl,
          artifactHash,
        }),
      )
      .returning()
      .then(first)
      .catch((error: PostgresError) => {
        console.log(error);
        if (error.constraint_name == 'artifact_artifact_hash_unique') {
          throw new BadRequestException('Artifact already exists');
        }
      });

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

    return artifactEntry;
  }

  public async getArtifacts(
    props: {},
    options?: ArtifactService.ArtifactTableQuery,
  ) {
    const artifactEntries =
      await this.databaseService.query.artifactTable.findMany({
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

    const artifactEntry = await this.databaseService
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
    await this.databaseService
      .delete(artifactTable)
      .where(eq(artifactTable.id, id));
    return;
  }
}
