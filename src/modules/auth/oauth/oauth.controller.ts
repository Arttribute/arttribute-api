import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OAuthService } from './oauth.service';
import { Authentication, User, UserPayload } from '../decorators';
import { CreateOAuthClient, ValidateOAuthCode } from './oauth-client.dto';

@ApiTags('oauth')
@Controller({ version: '1', path: 'auth/oauth' })
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create OAuth Client' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created OAuth Client',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authentication('jwt')
  @Post()
  async createOAuthClient(
    @Param('id') projectId: string,
    @User() user: UserPayload,
    @Body() body: CreateOAuthClient,
  ) {
    const userId = user.sub;
    const clientData = await this.oauthService.createOAuthClient(
      userId,
      projectId,
      body.name,
      body.redirect,
    );
    const createClientResult = {
      message: 'Client created successfully',
      secret: clientData.secret,
      note: 'Please save this secret, it will not be shown again.',
    };
    return createClientResult;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate OAuth Code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully validate OAuth Code',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authentication('api-key')
  @Post('validate')
  async validateOAuthCode(
    @Body() body: ValidateOAuthCode,
    @Query('clientId') clientId: string,
  ) {
    // Should return tokens
    return await this.oauthService.validateOAuthCode(
      clientId,
      body.secret,
      body.code,
    );
  }
}
