import { v4 } from 'uuid';
import { SignJWT } from 'jose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
// import { ethPersonalSignRecoverPublicKey } from '@polybase/eth';

@Injectable()
export class AuthenticationService {
  constructor() {}

  validateSignature(address: string, message: string, signature: string) {
    const { address: recoveredAddress } = this.getSignerData(
      message,
      signature,
    );
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Signature does not match!');
    }
    return address.toLowerCase();
  }

  generateAuthenticationMessage(address: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = new SignJWT({
      jti: v4(),
      iss: 'https://api.arttribute.io/v2/authentication',
      sub: address,
      aud: 'arttribute.io',
    })
      .setExpirationTime('10m')
      .setProtectedHeader({
        alg: 'RS256',
        typ: 'JWT',
        kid: process.env.SERVICE_NAME,
      })
      .sign(secret);

    return token;
  }

  getSignerData(message: string, signature: string) {
    const address = ethers.verifyMessage(message, signature);
    // const publicKey = ethPersonalSignRecoverPublicKey(signature, message);
    return { address };
  }
}
