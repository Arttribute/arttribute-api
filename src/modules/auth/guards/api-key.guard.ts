import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { first, get, isObject } from 'lodash';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    let apiKey = get(req.headers, 'x-api-key');

    try {
      if ((isObject(apiKey) && (apiKey = first(apiKey))) || !apiKey) {
        throw new BadRequestException('Missing API Key');
      }
      const project = await this.authService.getProjectForAPIKey(
        this.authService.hash(apiKey),
      );

      const isValid = Boolean(project);

      if (isValid) {
        (req as any).project = project;
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
