import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { first } from 'lodash';
import { AttributionService } from '~/features/attribution/attribution.service';

@Injectable()
export class UserAttributionService {
  constructor(private attributionService: AttributionService) {}

  public async getAttributionForType(props: {
    userId: string;
    type: 'collection' | 'artifact';
    typeId: string;
  }) {
    const { type, typeId, userId } = props;
    const attribution = await this.attributionService
      .getAttributions(
        {},
        {
          where: (t) =>
            and(
              eq(t.attributorId, userId),
              eq(type == 'artifact' ? t.artifactId : t.collectionId, typeId),
            ),
        },
      )
      .then(first);

    if (!attribution) {
      throw new NotFoundException(
        `Attribution for ${type}: ${typeId} with attributionId: ${userId} not found`,
      );
    }

    return attribution;
  }
}
