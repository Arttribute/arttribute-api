import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { nth } from 'lodash';
import { File, Web3Storage } from 'web3.storage';
import { generateUniqueId } from '~/shared/util/generateUniqueId';

@Injectable()
export class FileService {
  client = new Web3Storage({
    token: process.env.WEB3STORAGE_TOKEN || 'unavailable',
  });

  public encodeToBase64(file: Express.Multer.File) {
    const encodedImage = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64',
    )}`;
    return encodedImage;
  }

  // This function takes in a base64 string, decodes it into a blob object and uploads it to web3storage then returns the url and cid
  public async uploadBase64File(base64FileObject: {
    data: string;
    mimetype?: string;
  }) /*: Promise<{ cid: string; url: string }>*/ {
    //Get the mimetype
    const mimeType =
      this.getMimeTypeFromBase64(base64FileObject.data) ||
      base64FileObject.mimetype;

    if (!mimeType) {
      throw new BadRequestException(
        'Invalid base-64 format : missing MIME type',
      );
    }

    // Remove the data URL prefix if it exists
    const base64WithoutPrefix = base64FileObject.data.replace(
      /^data:[^;]+;base64,/,
      '',
    );

    if (this.isValidBase64(base64WithoutPrefix)) {
      // Convert the Base64 string to binary data
      const binaryData = atob(base64WithoutPrefix);

      // Create a Uint8Array from the binary data
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // Create a Blob object from the Uint8Array with the specified MIME type
      const file_blob = new Blob([uint8Array], { type: mimeType });

      try {
        // Use the File object from web3.storage
        const fileName = generateUniqueId();
        const filelike = new File([file_blob], fileName);

        const cid = await this.client.put([filelike]);
        const url = this.generateURLfromCID(cid, fileName);

        return { cid, url };
      } catch (error) {
        throw new InternalServerErrorException(
          `Error uploading to Web3Storage: ${error?.message || error}`,
        );
      }
    } else {
      throw new BadRequestException('Invalid base-64 string');
    }
  }

  public generateURLfromCID(cid: string, fileName: string) {
    const url = `https://${cid}.ipfs.w3s.link/${fileName}`;
    return url;
  }

  public getMimeTypeFromBase64(base64String: string) {
    // Regular expression to match the MIME type from a Data URL
    const mimeTypeRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,/;

    // Use RegExp.exec to extract the MIME type from the Base64 string
    const matches = base64String.match(mimeTypeRegex);

    return nth(matches, 1); // Return the extracted MIME type
  }

  public isValidBase64(str: string): boolean {
    try {
      // Attempt to decode the string using the built-in atob function
      const decodedString = atob(str);

      // Re-encode the decoded string to Base64
      const reencodedString = btoa(decodedString);

      // Check if the re-encoded string matches the original string
      if (reencodedString === str) {
        return true;
      } else {
        throw new BadRequestException('Invalid base-64 string');
      }
    } catch (err) {
      throw new BadRequestException('Invalid base-64 string');
    }
  }
}
