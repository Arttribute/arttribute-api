import { Injectable } from '@nestjs/common';
import { CIDString, Web3Storage } from 'web3.storage';
import makeStorageClient from './upload';

@Injectable()
export class UploadService {
  private readonly web3Storage: Web3Storage;
  constructor() {
    this.web3Storage = makeStorageClient();
  }

  async upload(file: File) {
    try {
      // Upload the file to Web3Storage
      const cid: CIDString = await this.web3Storage.put([file]);
      return cid;
    } catch (error) {
      console.error('Error uploading to Web3Storage:', error);
      // Handle error response
    }
  }
}
