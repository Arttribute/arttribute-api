import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Authentication, User, UserPayload } from './decorators';
import { OIDCService } from './oidc/oidc.service';
import { Duration } from 'luxon';

@ApiTags('auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oidcService: OIDCService,
  ) {}

  @ApiOperation({ summary: 'Verify signature' })
  @ApiResponse({
    status: 200,
    description: 'Successfully verified signature',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async verifySignature(
    @Res() response,
    @Body('address') address: string,
    @Body('message') message: string,
    @Body('signature') signature: string,
    @Query('clientId') clientId?: string,
  ): Promise<{ token: string }> {
    const verifiedUser = await this.authService.authenticate(
      address,
      message,
      signature,
    );
    const token = verifiedUser.token;
    if (!token) {
      throw new UnauthorizedException('Authentication failed');
    }

    if (clientId) {
      // if the client exists, redirect
      const { code, redirect } = await this.oidcService.generateOIDCCode(
        clientId,
        verifiedUser,
      );
      // Add token so user is still signed in for arttribute applications
      response.cookie('idToken', token, {
        domain: '.arttribute.io',
        maxAge: Duration.fromObject({ hours: 1 }).as('milliseconds'),
        secure: process.env.LOCATION != 'LOCAL',
        sameSite: 'lax',
        path: '/',
      });
      const url = new URL(redirect);
      url.searchParams.append('code', code);
      return response.redirect(url);
    }

    return { token: token };
  }

  @ApiOperation({ summary: 'Request authentication message' })
  @ApiResponse({
    status: 200,
    description: 'Successfully requested message',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('request')
  async requestMessage(@Body('address') address: string) {
    const message = await this.authService.generateAuthenticationMessage(
      address,
    );
    if (!message) {
      throw new UnauthorizedException('Authentication failed');
    }

    return { message };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create API key' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created API key',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authentication('jwt')
  @Post('api-key/:id')
  async createAPIKey(
    @Param('id') projectId: string,
    @User() user: UserPayload,
  ) {
    const userId = user.sub;
    const keyData = await this.authService.createKey(userId, projectId);
    const createKeyResult = {
      message: 'Key created successfully',
      apiKey: keyData.apiKey,
      note: 'Please save this key, it will not be shown again.',
    };
    return createKeyResult;
  }
}
