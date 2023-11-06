import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { PolybaseService } from '~/shared/polybase';
import { getSignerData } from '~/shared/util/getSignerData';
import { UserPayload } from '../auth';

@Injectable()
export class UserService {
  private readonly db: Polybase;
  private readonly userCollection: Collection<any>;

  constructor(private polybaseService: PolybaseService) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.userCollection = this.db.collection('User');
  }

  async findUser(id: string) {
    const { data: user } = await this.userCollection.record(id).get();
    if (user) {
      return user;
    } else {
      throw new NotFoundException('record not found');
    }
  }

  async populateUser(project: any): Promise<UserPayload> {
    const user = await this.findUser(project.owner.id);
    return {
      'sub': user.id,
      'wallet_address': user.address,
    };
  }

  async createUser(
    message: string,
    signature: string,
    address: string,
    name: string,
  ) {
    const { recoveredAddress, publicKey } = getSignerData(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Signature does not match!');
    }
    const existingUser = await this.userCollection
      .where('address', '==', address)
      .get();

    if (existingUser.data.length > 0) {
      return {
        message: 'This address is already registered to Arttribute',
        user: existingUser.data[0].data,
      };
    }
    const createdUser = await this.userCollection.create([
      publicKey,
      publicKey,
      address,
      name,
      new Date().toISOString(),
    ]);
    return {
      message: 'User created successfully',
      user: createdUser.data,
    };
  }

  public async getUserFromPublicKey(publicKey: string) {
    const user = await this.db
      .collection('User')
      .where('publicKey', '==', publicKey)
      .get();

    if (user.data.length > 0) {
      return user.data[0].data;
    } else {
      return null;
    }
  }
}
