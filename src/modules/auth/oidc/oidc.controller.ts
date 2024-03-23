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
import { OIDCService } from './oidc.service';
import { Authentication, User, UserPayload } from '../decorators';
import { CreateOIDCClient, ValidateOIDCCode } from './oidc-client.dto';

@ApiTags('oidc')
@Controller({ version: '1', path: 'auth/oidc' })
export class OIDCController {
  constructor(private readonly oidcService: OIDCService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create OIDC Client' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created OIDC Client',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authentication('jwt')
  @Post()
  async createOIDCClient(
    @Param('id') projectId: string,
    @User() user: UserPayload,
    @Body() body: CreateOIDCClient,
  ) {
    const userId = user.sub;
    const clientData = await this.oidcService.createOIDCClient(
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
  @ApiOperation({ summary: 'Validate OIDC Code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully validate OIDC Code',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authentication('api-key')
  @Post('validate')
  async validateOIDCCode(
    @Body() body: ValidateOIDCCode,
    @Query('clientId') clientId: string,
  ) {
    return await this.oidcService.validateOIDCCode(clientId, body.code);
  }
}
