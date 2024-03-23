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
import { ProjectService } from '~/modules/project/project.service';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class OIDCService {
  private readonly db: Polybase;

  private authClientCollection: Collection<any>;

  constructor(
    private polybaseService: PolybaseService,
    private projectService: ProjectService,
  ) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.authClientCollection = this.db.collection('AuthClient');
  }

  public async createOIDCClient(
    userId: string,
    projectId: string,
    name: string,
    redirect: string,
  ) {
    //check if user is owner of project
    const currentProject = await this.projectService.findOne(projectId);
    if (currentProject.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized action');
    }
    const createdAt = new Date().toISOString();

    const secret = this.generateClientSecret();

    let authClient = first(
      (await this.authClientCollection.where('project', '==', projectId).get())
        .data,
    );
    if (!authClient) {
      authClient = await this.authClientCollection.create([
        generateUniqueId(),
        this.db.collection('Project').record(projectId),
        name,
        redirect,
        createdAt,
      ]);
    }

    const updatedAuthClient = await this.authClientCollection
      .record(authClient.id)
      .call('addSecretHash', [this.hash(secret)]);
    return { data: updatedAuthClient.data, secret };
  }

  public async generateOIDCCode(clientId: string, user: any) {
    // Get Client
    const existingClient = await this.authClientCollection
      .where('id', '==', clientId)
      .get();

    const cipher = createCipheriv(
      'aes-128-gcm',
      existingClient.data[0].data.secretHash,
      process.env.AUTH_CODE_IV,
    );

    let encrypted = cipher.update(user, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { code: encrypted, redirect: existingClient.data[0].data.redirect };
  }

  public async validateOIDCCode(clientId: string, code: string) {
    const existingClient = await this.authClientCollection
      .where('id', '==', clientId)
      .get();

    existingClient.data[0].data.secretHash;

    const decipher = createDecipheriv(
      'aes-128-gcm',
      existingClient.data[0].data.secretHash,
      process.env.AUTH_CODE_IV,
    );

    let decrypted = decipher.update(code, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private generateClientSecret() {
    // UUID to hex
    const buffer = Buffer.alloc(16);
    uuidv4({}, buffer);
    const authClient = buffer.toString('base64');

    return authClient;
  }

  hash(val: string) {
    return new sha256().update(val).digest('base64');
  }
}
