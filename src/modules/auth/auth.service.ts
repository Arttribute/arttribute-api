import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Collection, Polybase } from '@polybase/client';
import { first } from 'lodash';
import { sha256 } from 'sha.js';
import { v4 as uuidv4 } from 'uuid';
import { PolybaseService } from '~/shared/polybase';
import { generateUniqueId } from '~/shared/util/generateUniqueId';
import { getSignerData } from '~/shared/util/getSignerData';
import { MessagePayload, UserPayload } from './decorators';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AuthService {
  private readonly db: Polybase;
  private readonly userCollection: Collection<any>;
  private apikeyCollection: Collection<any>;
  private projectCollection: Collection<any>;

  constructor(
    private readonly jwtService: JwtService,
    private polybaseService: PolybaseService,
    private projectService: ProjectService,
  ) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.userCollection = this.db.collection('User');
    this.apikeyCollection = this.db.collection('ApiKey');
    this.projectCollection = this.db.collection('Project');
  }

  async authenticate(address: string, message: string, signature: string) {
    try {
      try {
        const { wallet_address } =
          this.jwtService.verify<MessagePayload>(message);
        if (wallet_address.toLowerCase() !== address.toLowerCase()) {
          throw new Error(
            'Message address and authenticating address do not match',
          );
        }
      } catch (err) {
        throw new UnauthorizedException('Message signed is invalid!');
      }
      const { recoveredAddress, publicKey } = getSignerData(message, signature);
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new UnauthorizedException('Signature does not match!');
      }
      const existingUser = await this.userCollection
        .where('address', '==', address)
        .get();
      if (!first(existingUser.data)?.data) {
        throw new UnauthorizedException('User does not exist!');
      }
      const payload: UserPayload = { sub: publicKey, wallet_address: address };
      const token = this.jwtService.sign(payload);
      return { token, publicKey };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async createKey(userId: string, projectId: string) {
    //check if user is owner of project
    const currentProject = await this.projectService.findOne(projectId);
    if (currentProject.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized action');
    }
    const createdAt = new Date().toISOString();

    const apiKey = this.generateAPIKey();

    const key = await this.apikeyCollection.create([
      generateUniqueId(),
      this.db.collection('Project').record(projectId),
      this.hash(apiKey),
      createdAt,
    ]);
    return { data: key.data, apiKey };
  }

  async getProjectForAPIKey(hashedApiKey: string) {
    const { data: apiKeyRecords } = await this.apikeyCollection
      .where('value', '==', hashedApiKey)
      .limit(1)
      .get();
    const apiKey = first(apiKeyRecords);
    if (!apiKey) {
      throw new NotFoundException('API Key Not found');
    }
    const { data: project } = await this.projectCollection
      .record(apiKey.data.project.id)
      .get();
    if (!project) {
      throw new NotFoundException('Project Not found');
    }
    return project;
  }

  async generateAuthenticationMessage(address: string) {
    const payload: MessagePayload = { wallet_address: address };
    const token = this.jwtService.sign(payload, { expiresIn: '10m' });

    return token;
  }

  validateToken(token: string) {
    return this.jwtService.verify<UserPayload>(token);
  }

  private generateAPIKey() {
    // UUID to hex
    const buffer = Buffer.alloc(16);
    uuidv4({}, buffer);
    const key = buffer.toString('base64');

    return key;
  }

  hash(val: string) {
    return new sha256().update(val).digest('base64');
  }
}
