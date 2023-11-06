import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { PolybaseService } from '~/shared/polybase';
import { LicenseModel } from './license.dto';

@Injectable()
export class LicenseService {
  private readonly db: Polybase;
  private readonly licenseCollection: Collection<any>;

  constructor(private polybaseService: PolybaseService) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.licenseCollection = this.db.collection('License');
  }

  public async findAll() {
    const { data: licenses } = await this.licenseCollection.get();
    return licenses.map((license) => license.data);
  }

  public async findOne(id: string) {
    const { data: item } = await this.licenseCollection.record(id).get();
    if (item) {
      return item;
    } else {
      throw new NotFoundException('record not found');
    }
  }

  public async create(createLicense: LicenseModel) {
    const collection = this.db.collection('License');

    const createdLicense = await collection.create([
      createLicense.id,
      createLicense.name,
      createLicense.description,
      createLicense.symbol,
      createLicense.family,
    ]);
    return createdLicense;
  }

  update() {
    return `This action updates a license`;
  }

  public async remove(id: string) {
    try {
      await this.licenseCollection.record(id).call('del');
    } catch (error) {
      switch (error.code) {
        case 'not-found':
          throw new NotFoundException('record not found');
        default:
          throw new InternalServerErrorException('record could not be deleted');
      }
    }
  }
}
