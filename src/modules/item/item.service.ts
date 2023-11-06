import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Collection, Polybase, Query } from '@polybase/client';
import { map, without } from 'lodash';
import { UploadService } from 'src/shared/web3storage/upload.service';
import { PolybaseService } from '~/shared/polybase';
import { generateUniqueId } from '~/shared/util/generateUniqueId';
import { UserPayload } from '../auth';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';
import { CreateItemDto, UpdateItemDto } from './item.dto';
import { Merge } from 'type-fest';

@Injectable()
export class ItemService {
  private readonly db: Polybase;
  private readonly itemCollection: Collection<any>;

  constructor(
    private polybaseService: PolybaseService,
    private uploadService: UploadService,
    private fileService: FileService,
    private userService: UserService,
  ) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.itemCollection = this.db.collection('Item');
  }

  public async recordExists(id: string) {
    const item = await this.itemCollection.record(id).get();
    return item.exists();
  }

  public async findAll(query: { source?: string; tags?: string }) {
    const reference = await this.itemCollection;
    let builder: Collection<any> | Query<any> = reference;
    if (query.source) {
      const source = query.source.toLowerCase();
      builder = builder
        .where('source', '>=', source)
        .where('source', '<', `${source}~`);
    }

    // if tags exist, filter results based on tags
    if (query.tags) {
      const tags = query.tags.split(',').map((element) => {
        return element.toLowerCase();
      });
      const { data: raw_items } = await builder.get();

      const items = map(raw_items, function (item) {
        let match = true;
        for (const i in tags) {
          if (!item.data.tags.includes(tags[i])) {
            match = false;
          }
        }
        if (match) {
          return item.data;
        }
      });
      return without(items, undefined);
    }
    // const { data: items } = await this.itemCollection.get();
    const { data: items } = await builder.get();
    return map(items, 'data');
  }

  public async findOne(id: string) {
    const { data: item } = await this.itemCollection.record(id).get();
    if (item) {
      return item;
    } else {
      throw new NotFoundException('record not found');
    }
  }

  // async uploadToWeb3Storage(
  //   file: Express.Multer.File,
  // ): Promise<{ cid: string; url: string }> {
  //   const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
  //   try {
  //     if (!file) {
  //       throw new NotFoundException('file not included');
  //     }
  //     // Create a new Blob from the buffer
  //     const blob = new Blob([file.buffer], { type: file.mimetype });

  //     // Use the File object from web3.storage
  //     const filelike = new File([blob], file.originalname);

  //     const cid = await client.put([filelike]);
  //     const url = this.generateURLfromCID(cid, file.originalname);

  //     return { cid, url };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       `Error uploading to Web3Storage: ${error?.message || error}`,
  //     );
  //   }
  // }

  // public async create(
  //   file: Express.Multer.File,
  //   createItem: CreateItemDto,
  //   user: UserPayload,
  //   project: any, //should have type Project
  // ) {
  //   const LicenseCollection = this.db.collection('License');

  //   const id = generateUniqueId();
  //   const current_time = new Date().toISOString();
  //   const owner = await this.userService.getUserFromPublicKey(user.sub);
  //   if (!owner) {
  //     console.log('No owner');
  //     throw new UnauthorizedException('Unauthorized');
  //   }

  //   const { cid, url } = await this.fileService(file);

  //   const createdItem = await this.itemCollection.create([
  //     id,
  //     createItem.title,
  //     createItem.description,
  //     url,
  //     createItem.tags,
  //     createItem.author,
  //     this.db.collection('User').record(user.sub),
  //     createItem.source,
  //     this.db.collection('Project').record(project.id),
  //     createItem.license.join(),
  //     createItem.license.map((license_id) =>
  //       LicenseCollection.record(license_id),
  //     ),
  //     createItem.price_amount || 0,
  //     createItem.price_currency || 'none',
  //     createItem.needsRequest,
  //     current_time,
  //     current_time,
  //   ]);

  //   return createdItem;
  // }

  public async create(
    createItem: CreateItemDto,
    user: UserPayload,
    project: any, //should have type Project
  ) {
    const LicenseCollection = this.db.collection('License');

    const id = generateUniqueId();
    const current_time = new Date().toISOString();
    const owner = await this.userService.getUserFromPublicKey(user.sub);
    if (!owner) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { cid, url } = await this.fileService.uploadBase64File(
      createItem.file,
    );

    const createdItem = await this.itemCollection.create([
      id,
      createItem.title,
      createItem.description,
      url,
      createItem.tags.map((element) => {
        return element.toLowerCase();
      }),
      createItem.author,
      this.db.collection('User').record(user.sub),
      createItem.source.toLowerCase(),
      this.db.collection('Project').record(project.id),
      createItem.license.join(''),
      createItem.license.map((license_id) =>
        LicenseCollection.record(license_id),
      ),
      createItem.price.amount || 0,
      createItem.price.currency || 'none',
      createItem.needsRequest,
      current_time,
      current_time,
    ]);

    return createdItem;
  }

  public async update(
    id: string,
    updateItem: UpdateItemDto,
    user: UserPayload,
    project: any,
  ) {
    const oldItem = await this.findOne(id);
    const current_time = new Date().toISOString();
    const LicenseCollection = this.db.collection('License');

    // Check if user is the owner of the item they are trying to update
    const owner = await this.userService.getUserFromPublicKey(user.sub);
    if (oldItem.owner.id !== owner.id) {
      throw new UnauthorizedException('Unauthorized request to resource');
    }

    let licenseReference;
    if (updateItem.license) {
      licenseReference = updateItem.license.map((license_id) =>
        LicenseCollection.record(license_id),
      );
    } else {
      licenseReference = oldItem.license.reference;
    }

    const updatedItem = await this.itemCollection.record(id).call('update', [
      updateItem.title || oldItem.title,
      updateItem.description || oldItem.description,
      updateItem.tags || oldItem.tags,
      updateItem.author || oldItem.author,
      updateItem.source || oldItem.source,
      // project.name || oldItem.project.name,
      updateItem?.license?.join() || oldItem.license.name,
      licenseReference,
      updateItem?.price?.amount || oldItem.price.amount,
      updateItem?.price?.currency || oldItem.price.currency,
      updateItem.needsRequest || oldItem.needsRequest,
      current_time,
    ]);

    return this.findOne(id);
  }

  public async remove(id: string, user: UserPayload) {
    // Check if user is the owner of the item they are trying to delete
    const owner = await this.userService.getUserFromPublicKey(user.sub);
    const oldItem = await this.findOne(id);
    if (oldItem.owner.id !== owner.id) {
      throw new UnauthorizedException('Unauthorized request to resource');
    }
    try {
      await this.itemCollection.record(id).call('del');
    } catch (error) {
      switch (error.code) {
        case 'not-found':
          throw new NotFoundException('record not found');
        default:
          console.log(error);
          throw new InternalServerErrorException('record could not be deleted');
      }
      // throw new HttpException('record not found', HttpStatus.NOT_FOUND);
    }
  }
}
