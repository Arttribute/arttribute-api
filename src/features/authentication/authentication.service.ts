import { v4 } from 'uuid';
import { SignJWT } from 'jose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { UserService } from '../user/user.service';
// import { ethPersonalSignRecoverPublicKey } from '@polybase/eth';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService) {}

  validateUser(email: string) {
    const user = this.userService
      .upsertUser({ value: { email } })
      .then((user) => {
        return user || this.userService.getUser({ email });
      });
    return user;
  }

  validateSignature(address: string, message: string, signature: string) {
    const { address: recoveredAddress } = this.getSignerData(
      message,
      signature,
    );
    //   jwtValidate(message, {secret, isExpired: isLocal ?false: undefined });
    console.log({ recoveredAddress, address });
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Signature does not match!');
    }

    const user = this.userService
      .upsertUser({
        value: { web3Address: address.toLowerCase() },
      })
      .then((user) => {
        return (
          user ||
          this.userService.getUser({ web3Address: address.toLowerCase() })
        );
      });
    return user;
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
        alg: 'HS256',
        typ: 'JWT',
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
