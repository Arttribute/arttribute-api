import { Artifact } from '~/modules/database/schema';
import { SetRequired } from 'type-fest';
import typia from 'typia';

export interface BaseArtifact
  extends Partial<Omit<Artifact, 'createdAt' | 'updatedAt' | 'artifactHash'>> {}

export interface Asset {
  //   data: string;
  data: string &
    typia.tags.Pattern<`^data:([-\\w]+\\/[-+\\w.]+)?((?:;?[\\w]+=[-\\w]+)*)(;base64)?,(.*)$`>;
  mimetype?: string;
  name?: string;
}
export interface CreateArtifact
  extends SetRequired<Omit<BaseArtifact, 'id'>, 'name'> {
  asset: Asset;
}

export interface UpdateArtifact extends Omit<BaseArtifact, 'id'> {}
