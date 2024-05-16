import { Artifact } from '~/modules/database/schema';
import { Except, SetNonNullable, SetRequired } from 'type-fest';
import typia from 'typia';

export interface BaseArtifact
  extends Partial<
    Except<Artifact, 'createdAt' | 'updatedAt' | 'artifactHash'>
  > {}

export interface Asset {
  //   data: string;
  data: string &
    typia.tags.Pattern<`^data:([-\\w]+\\/[-+\\w.]+)?((?:;?[\\w]+=[-\\w]+)*)(;base64)?,(.*)$`>;
  mimetype?: string;
  name?: string;
}
export interface CreateArtifact
  extends Except<SetNonNullable<BaseArtifact>, 'id' | 'creatorId'> {
  asset: Asset;
}

export interface UpdateArtifact
  extends Except<BaseArtifact, 'id' | 'creatorId' | 'imageUrl'> {}
