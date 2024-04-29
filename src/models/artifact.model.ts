import { Artifact } from '~/modules/database/schema';
import { SetRequired } from 'type-fest';

export interface BaseArtifact
  extends Partial<Omit<Artifact, 'createdAt' | 'updatedAt'>> {}

export interface CreateArtifact extends Omit<BaseArtifact, 'id'> {}

export interface UpdateArtifact extends Omit<BaseArtifact, 'id'> {}
