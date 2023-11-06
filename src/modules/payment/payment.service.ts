import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { ethers } from 'ethers';
import { PolybaseService } from '~/shared/polybase';
import { generateUniqueId } from '~/shared/util/generateUniqueId';
import { UserPayload } from '../auth';
import { CreatePayment } from './payment.dto';
import { first } from 'lodash';

@Injectable()
export class PaymentService {
  db: Polybase;
  paymentCollection: Collection<any>;
  itemCollection: Collection<any>;
  collectionsCollection: Collection<any>;
  networkCollection: Collection<any>;

  constructor(private polybaseService: PolybaseService) {
    this.db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');
    this.paymentCollection = this.db.collection('Payment');
    this.itemCollection = this.db.collection('Item');
    this.collectionsCollection = this.db.collection('Collection');
    this.networkCollection = this.db.collection('Network');
  }

  public async findReference(
    id: string,
    type: string,
  ): Promise<{
    id: string;
    type: string;
    owner: {
      id: string;
      address: string;
    };
    price: { amount: number; currency: string };
  }> {
    if (type === 'item') {
      const { data: item } = await this.itemCollection.record(id).get();
      if (item) {
        const { data: owner } = await this.db
          .collection('User')
          .record(item.owner.id)
          .get();
        return {
          id: item.id,
          type: 'item',
          owner: {
            id: item.owner.id,
            address: owner.address,
          },
          price: item.price,
        };
      } else {
        throw new NotFoundException('Reference item does not exist');
      }
    } else if (type === 'collection') {
      const { data: collection } = await this.collectionsCollection
        .record(id)
        .get();
      if (collection) {
        const { data: owner } = await this.db
          .collection('User')
          .record(collection.owner.id)
          .get();
        return {
          id: collection.id,
          type: 'collection',
          owner: {
            id: collection.owner.id,
            address: owner.address,
          },
          price: collection.price,
        };
      } else {
        throw new NotFoundException('Reference collection does not exist');
      }
    } else {
      throw new NotFoundException(`reference ${type} does not exist`);
    }
  }

  public async findNetwork(chainId: string): Promise<{ id: string }> {
    const { data: network } = await this.networkCollection
      .record(chainId)
      .get();
    if (network) {
      return { id: network.id };
    } else {
      throw new BadRequestException('Unsupported network specified');
    }
  }

  async createPayment(
    paymentDto: CreatePayment,
    user: UserPayload,
    project: any,
  ) {
    const id = generateUniqueId();
    const createdAt = new Date().toISOString();
    const reference = await this.findReference(
      paymentDto.reference.id,
      paymentDto.reference.type,
    );
    const paymentType = reference.price.amount > 0 ? 'fee' : 'gift';

    //check if sender is not the owner of the reference
    if (reference.owner.id === user.sub) {
      throw new BadRequestException(
        'You are the owner of this item/collection. You cannot make a payment for your own item/collection',
      );
    }

    //check if payment amount is less than the required price
    if (paymentDto.amount < reference.price.amount) {
      throw new BadRequestException(
        'Payment amount is less than the required  price',
      );
    }

    const paymentExists = await this.paymentCollection
      .where('transactionHash', '==', paymentDto.transactionHash)
      .get();
    if (first(paymentExists.data)?.data) {
      throw new HttpException(
        'Payment with the transaction hash already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    //To do: get endpoint from network
    const network = await this.findNetwork(paymentDto.network.chainId);

    //Confirm transaction on the blockchain
    const provider = new ethers.JsonRpcProvider(
      `https://celo-alfajores.infura.io/v3/${process.env.PROJECT_ID}`,
    );

    const tx = await provider.getTransaction(paymentDto.transactionHash);
    if (
      tx?.to &&
      tx.to.toLowerCase() != reference.owner.address.toLowerCase()
    ) {
      throw new BadRequestException(
        'Invalid transaction hash: receiver does not match',
      );
    }
    if (tx && ethers.formatEther(tx.value) < paymentDto.amount.toString()) {
      throw new BadRequestException(
        'Invalid transaction hash: amount does not match',
      );
    }
    const txresult = await tx?.wait();
    if (txresult && txresult.status != 1) {
      throw new BadRequestException('Transaction failed');
    }
    //create payment once transaction is confirmed
    try {
      const payment = await this.paymentCollection.create([
        paymentDto.transactionHash, // could also be uuid
        paymentDto.reference.type,
        paymentDto.reference.id,
        paymentDto.transactionHash,
        this.db.collection('User').record(user.sub),
        this.db.collection('User').record(reference.owner.id),
        paymentDto.amount,
        paymentDto.currency,
        paymentType,
        project.name,
        this.db.collection('Project').record(project.id),
        this.db.collection('Network').record(network.id),
        createdAt,
      ]);
      return payment;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating payment: ${error?.message || error}`,
      );
    }
  }

  //get user payments received
  async getUserPaymentsReceived(user: UserPayload) {
    const payments = await this.paymentCollection
      .where('receiver', '==', this.db.collection('User').record(user.sub))
      .get();
    return payments;
  }

  //get user payments sent
  async getUserPaymentsSent(user: UserPayload) {
    const payments = await this.paymentCollection
      .where('sender', '==', this.db.collection('User').record(user.sub))
      .get();
    return payments;
  }

  //get payments by source
  async getPaymentsBySource(source: string) {
    const payments = await this.paymentCollection
      .where('source', '==', source)
      .get();
    return payments;
  }

  //Delete payment
  async deletePayment(id: string) {
    const payment = await this.paymentCollection.record(id).get();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    await this.paymentCollection.record(id).call('del');
    return payment;
  }
}
