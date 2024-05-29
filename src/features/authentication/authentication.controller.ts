import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from './decorators';
import { RequestMessage } from '~/models/authentication.model';
import { Result } from '~/shared/response';

@Controller({ version: '2', path: 'authentication' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('request')
  async requestMessage(@TypedBody() body: RequestMessage) {
    const message =
      await this.authenticationService.generateAuthenticationMessage(
        body.address,
      );
    if (!message) {
      throw new UnauthorizedException('Authentication failed');
    }

    return Result({ message } as { message: string });
  }
}
