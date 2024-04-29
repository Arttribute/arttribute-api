import { Controller } from '@nestjs/common';
import { CollectionItemService } from './collection-item.service';

@Controller({ version: '2', path: 'collections' })
export class CollectionItemController {
  constructor(private collectionItemService: CollectionItemService) {}
}
