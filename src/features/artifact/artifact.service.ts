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
  inArray,
} from 'drizzle-orm';
import { compact, first, join, map } from 'lodash';
import typia from 'typia';
import {
  CreateArtifact,
  UpdateArtifact,
  ArtifactCheckResult,
} from '~/models/artifact.model';
import { InsertArtifact, artifactTable } from '~/modules/database/schema';
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';
import parseDataURL from 'data-urls';
import { DataURL } from 'data-urls';
import { StorageService } from '~/modules/storage/storage.service';
// import phash from 'sharp-phash';
import mime from 'mime-types';
import path from 'path';
import slug from 'slug';
const got = import('got');
// // @ts-expect-error
// import { HTTPError } from 'got';
// import FormData from 'form-data';

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
  private similarityAPI = got.then(({ default: _ }) =>
    _.extend({
      prefixUrl: process.env.SIMILARITY_API_ENDPOINT,
    }),
  );

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

    const asset = new File(
      [data.body],
      value.asset.name || value.name || '', // Should add a string to the filename
      {
        type: value.asset.mimetype || data.mimeType.essence,
      },
    );

    const mimetypeFromName = mime.lookup(asset.name);

    let extension;
    if (mimetypeFromName && mimetypeFromName == asset.type) {
      extension = path.extname(asset.name);
    } else {
      extension = '.' + mime.extension(asset.type);
    }

    if (!extension) {
      throw new BadRequestException('Invalid asset mimetype');
    }

    // Generate phash
    const formData = new FormData();

    formData.append('file', asset, asset.name);

    const search = await this.similarityAPI.then((_) =>
      _.post('search', {
        body: formData as any,
      }).json<{ image_id: string; distance: number; vector: string }>(),
    );

    console.log(search);

    if (1 - search?.distance > 0.85) {
      throw new BadRequestException('Artifact already exists');
    }

    let artifactEntry = await this.databaseService
      .insert(artifactTable)
      .values(
        typia.misc.assertPrune<InsertArtifact>({
          ...value,
        }),
      )
      .returning()
      .then(first);
    if (!artifactEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating artifact',
      );
    }

    const filename =
      join(
        compact([slug(path.basename(asset.name, extension)), artifactEntry.id]),
        '_',
      ) + extension;

    formData.set('image_id', artifactEntry.id);

    await Promise.all([
      this.similarityAPI.then((_) =>
        _.post('register', {
          body: formData as any,
          searchParams: { image_id: artifactEntry.id },
        }).json(),
      ),
      this.storageService.from('artifacts').upload(filename, asset, {
        upsert: false,
      }),
    ]).catch(async (err) => {
      await this.databaseService
        .delete(artifactTable)
        .where(eq(artifactTable.id, artifactEntry.id));
      throw err;
    });

    // If an error occurs in upload, we need to delete the artifact entry

    const {
      data: { publicUrl },
    } = this.storageService.from('artifacts').getPublicUrl(filename);

    const updatedArtifactEntry = await this.databaseService
      .update(artifactTable)
      .set(
        typia.misc.assertPrune<Partial<InsertArtifact>>({
          imageUrl: publicUrl,
        }),
      )
      .where(eq(artifactTable.id, artifactEntry?.id))
      .returning()
      .then(first);

    return updatedArtifactEntry;
  }

  public async checkArtifacts(props: {
    value: Array<CreateArtifact>;
    userId: string;
  }): Promise<ArtifactCheckResult[]> {
    const { value, userId } = props;

    const artifactChecks = await Promise.allSettled(
      value.map(async (_) => {
        const data = parseDataURL(_.asset.data);
        if (!data) {
          throw new InternalServerErrorException(
            'Error occurred while parsing asset',
          );
        }
        const asset = new File(
          [data.body],
          _.asset.name || _.name || '', // Should add a string to the filename
          {
            type: _.asset.mimetype || data.mimeType.essence,
          },
        );

        const formData = new FormData();

        formData.append('file', asset, asset.name);

        const search = await this.similarityAPI.then((_) =>
          _.post('search', {
            body: formData as any,
          }).json<{ image_id: string; distance: number; vector: string }>(),
        );

        if (1 - search?.distance > 0.8) {
          const artifactAttribution =
            await this.databaseService.query.attributionTable.findFirst({
              where: (t, {}) =>
                and(
                  eq(t.artifactId, search.image_id),
                  eq(t.attributorId, userId),
                ),
            });

          if (artifactAttribution) {
            return {
              attribution: artifactAttribution,
              imageId: search.image_id,
            };
          }

          const collectionItemsWithItem =
            await this.databaseService.query.collectionItemTable.findMany({
              where: (t, {}) => eq(t.artifactId, search.image_id),
            });

          if (collectionItemsWithItem.length > 0) {
            const artifactAttribution =
              await this.databaseService.query.attributionTable.findFirst({
                where: (t, {}) =>
                  and(
                    inArray(
                      t.collectionId,
                      map(collectionItemsWithItem, 'collectionId'),
                    ),
                    eq(t.attributorId, userId),
                  ),
              });

            if (artifactAttribution) {
              return {
                attribution: artifactAttribution,
                imageId: search.image_id,
              };
            }
          }

          return { attribution: false, imageId: search.image_id };
        }
        return { attribution: false, imageId: search.image_id };
      }),
    );

    return artifactChecks.map((_) => {
      if (_.status === 'fulfilled') {
        return _.value as ArtifactCheckResult;
      }
      return { attribution: false, imageId: null } as ArtifactCheckResult;
    });
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

