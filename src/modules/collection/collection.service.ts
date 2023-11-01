import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CallArgs, Collection, Polybase } from '@polybase/client';
import { compact, concat, differenceBy, isEmpty } from 'lodash';
import { PolybaseService } from '~/shared/polybase';
import { generateUniqueId } from '~/shared/util/generateUniqueId';
import { UserPayload } from '../auth';
import { LicenseModel } from '../license/license.dto';
import { CollectionResponse, CreateCollection, Item } from './collection.dto';

@Injectable()
export class CollectionService {
  db: Polybase;
  collection: Collection<any>;

  constructor(private polybaseService: PolybaseService) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable'); //changed from Khalifa to bashy for testing
    this.collection = this.db.collection('Collection');
  }

  async createCollection(
    createCollectionDto: CreateCollection,
    user: UserPayload,
    project: any,
  ) {
    const id = generateUniqueId();
    const defaultImage =
      'https://bafybeiadgrpvvdbejsrhebyathrdtdacr4qtuioot7gkaxnkpjtjc3y3ye.ipfs.w3s.link/CollectionDefault.png';
    const collection = await this.collection.create([
      id,
      createCollectionDto.title,
      createCollectionDto.featureImage || defaultImage,
      createCollectionDto.description,
      createCollectionDto.isPublic,
      createCollectionDto.tags,
      this.db.collection('User').record(user.sub),
      this.db.collection('Project').record(project.id),
      createCollectionDto.license.join(''),
      createCollectionDto.license.map((license_id) =>
        this.db.collection('License').record(license_id),
      ),
      createCollectionDto.price?.amount || 0,
      createCollectionDto.price?.currency || 'none',
      createCollectionDto.needsRequest,
      new Date().toISOString(),
      new Date().toISOString(),
    ]);
    return collection;
  }

  async getAllCollections(): Promise<CollectionResponse[]> {
    const { data: collections } = await this.collection.get();

    if (!collections) throw new NotFoundException('No collections found');
    return collections.map((collection) => collection.data);
  }

  public async getCollectionsForUser(
    userId: string,
  ): Promise<CollectionResponse[]> {
    const { data: collections } = await this.collection
      .where('owner', '==', this.db.collection('User').record(userId))
      .get();

    if (!collections)
      throw new NotFoundException('No collections found for this user');
    return collections.map((collection) => collection.data);
  }

  async getCollection(collectionId: string): Promise<CollectionResponse> {
    const { data: collection } = await this.collection
      .record(collectionId)
      .get();

    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async changeVisibility(
    collectionId: string,
    isPublic: boolean,
    user: UserPayload,
  ) {
    const curr = await this.getCollection(collectionId);

    if (curr.owner.id !== user.sub) {
      throw new UnauthorizedException(
        'Only the owner can change the visibility of a collection',
      );
    }

    const { data: collection } = await this.collection
      .record(collectionId)
      .call('changeVisibility', [isPublic]);

    return collection;
  }

  async addItemToCollection(
    collectionId: string,
    itemId: string,
    user: UserPayload,
  ) {
    const collection = await this.getCollection(collectionId);

    if (collection.owner.id !== user.sub) {
      throw new UnauthorizedException(
        'Only the owner can add items to a collection',
      );
    }

    // TODO: integrate with actual Item module
    const record = await this.db.collection('Item').record(itemId).get();
    const item = record.data;

    if (!record || !item) throw new NotFoundException('Item not found');

    if (collection.items.find((i) => i.id == item.id))
      throw new ConflictException('Item already in collection');

    const newLicenses = differenceBy(
      item.license.reference,
      collection.license.reference,
      'id',
    );

    const args: CallArgs = compact(
      concat(
        [record],
        [isEmpty(newLicenses) ? undefined : (newLicenses as any)], // TODO: Temporary fix
      ),
    );

    const { data: collections } = await this.collection
      .record(collectionId)
      .call('addItemToCollection', args);

    return collections;
  }

  async removeItemFromCollection(
    collectionId: string,
    itemId: string,
    user: UserPayload,
  ) {
    const collection = await this.getCollection(collectionId);

    if (collection.owner.id !== user.sub) {
      throw new UnauthorizedException(
        'Only the owner can remove items from a collection',
      );
    }

    if (!collection.items.find((i) => i.id == itemId))
      throw new NotFoundException('Item not found');

    const items: Item[] = collection.items.filter((i) => i.id != itemId);

    const newLicenses: LicenseModel[] = [];
    const seen = new Set<string>();

    for (const item of items) {
      for (const license of item.license) {
        if (!seen.has(license.id)) {
          seen.add(license.id);
          newLicenses.push(license);
        }
      }
    }

    const { data: collections } = await this.collection
      .record(collectionId)
      .call('removeItemFromCollection', [items as any, newLicenses]);

    return collections;
  }

  async deleteCollection(collectionId: string, user: UserPayload) {
    const collection = await this.getCollection(collectionId);

    if (collection.owner.id !== user.sub) {
      throw new UnauthorizedException('Only the owner can delete a collection');
    }

    await this.collection.record(collectionId).call('del');
  }
}

