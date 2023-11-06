import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { PolybaseService } from '~/shared/polybase';
import { generateUniqueId } from '~/shared/util/generateUniqueId';
import { CreateRequest, UpdateRequest } from './request.dto';

@Injectable()
export class RequestService {
  db: Polybase;
  requestCollection: Collection<any>;
  itemCollection: Collection<any>;
  collectionsCollection: Collection<any>;

  constructor(private polybaseService: PolybaseService) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.requestCollection = this.db.collection('PermissionRequest');
    this.itemCollection = this.db.collection('Item');
    this.collectionsCollection = this.db.collection('Collection');
  }

  public async findReference(
    id: string,
    type: string,
  ): Promise<{ id: string; type: string; owner: string }> {
    if (type === 'item') {
      const { data: item } = await this.itemCollection.record(id).get();
      if (item) {
        return { id: item.id, type: 'item', owner: item.owner.id };
      } else {
        throw new NotFoundException('record not found');
      }
    } else if (type === 'collection') {
      const { data: collection } = await this.collectionsCollection
        .record(id)
        .get();
      if (collection) {
        return {
          id: collection.id,
          type: 'collection',
          owner: collection.owner.id,
        };
      } else {
        throw new NotFoundException('record not found');
      }
    } else {
      throw new NotFoundException(`reference ${type} does not exist`);
    }
  }

  async createRequest(requestDto: CreateRequest, senderId: string) {
    const requestReference = await this.findReference(
      requestDto.reference.id,
      requestDto.reference.type,
    );
    //check if sender is not the owner of the reference
    if (requestReference.owner === senderId) {
      throw new BadRequestException('You cannot request your own item');
    }

    const receiverId = requestReference.owner;
    const accepted = false;
    const closed = false;

    const id = generateUniqueId();
    const current_time = new Date().toISOString();

    const request = await this.requestCollection.create([
      id,
      requestDto.reference.type,
      requestDto.reference.id,
      this.db.collection('User').record(senderId),
      this.db.collection('User').record(receiverId),
      requestDto.senderNote || '',
      accepted,
      closed,
      current_time,
      current_time,
    ]);
    return request;
  }

  //get received requests
  async getReceivedRequests(userId: string) {
    const requests = await this.requestCollection
      .where('receiver', '==', this.db.collection('User').record(userId))
      .get();
    return requests;
  }
  //get sent requests
  async getSentRequests(userId: string) {
    const requests = await this.requestCollection
      .where('sender', '==', this.db.collection('User').record(userId))
      .get();
    return requests;
  }

  //update request status
  async updateRequestStatus(
    updateDto: UpdateRequest,
    requestId: string,
    userId: string,
  ) {
    const current_time = new Date().toISOString();
    const request = await this.requestCollection.record(requestId).get();
    if (!request) {
      throw new NotFoundException('record not found');
    }
    if (request.data.receiver.id !== userId) {
      throw new UnauthorizedException('Unauthorized action: You are not owner');
    }

    if (request.data.closed) {
      throw new BadRequestException('request already closed');
    }

    if (updateDto.accepted && updateDto.receiverNote) {
      throw new BadRequestException('request acceptance should be unequivocal');
    }

    const updatedRequest = await this.requestCollection
      .record(requestId)
      .call('updateRequestStatus', [
        updateDto.accepted,
        true,
        current_time,
        updateDto.receiverNote || '',
      ]);
    return updatedRequest;
  }

  //Delete request
  async deleteRequest(id: string) {
    const payment = await this.requestCollection.record(id).get();
    if (!payment) {
      throw new NotFoundException('Request not found');
    }
    await this.requestCollection.record(id).call('del');
    return payment;
  }
}
