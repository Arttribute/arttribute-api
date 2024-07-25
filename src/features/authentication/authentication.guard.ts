import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { add, first, get, isObject, startsWith, trim } from 'lodash';
import { Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { IS_PUBLIC_KEY } from './decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('Authentication Level:	Public');
      return true;
    }

    let address = get(req.headers, 'x-authentication-address');
    let message = get(req.headers, 'x-authentication-message');
    let signature = get(req.headers, 'x-authentication-signature');

    let email = get(req.headers, 'x-authentication-email');

    if ((isObject(email) && (email = first(email))) || email) {
      (req as any).email = email;
      const validUser = this.authenticationService.validateUser(email);
      const isValid = Boolean(validUser);

      if (isValid) {
        (req as any).address = validUser;
        return true;
      }
    }

    try {
      if ((isObject(address) && (address = first(address))) || !address) {
        throw new BadRequestException(
          'Invalid x-authentication-address header',
        );
      }
      if ((isObject(message) && (message = first(message))) || !message) {
        throw new BadRequestException(
          'Invalid x-authentication-message header',
        );
      }
      if (
        (isObject(signature) && (signature = first(signature))) ||
        !signature
      ) {
        throw new BadRequestException(
          'Invalid x-authentication-signature header',
        );
      }

      const validAddress = this.authenticationService.validateSignature(
        address,
        message,
        signature,
      );

      const isValid = Boolean(validAddress);

      if (isValid) {
        (req as any).address = validAddress;
        return true;
      }
      throw new UnauthorizedException();
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(
        err instanceof BadRequestException ? err.message : undefined,
      );
    }
  }
}
