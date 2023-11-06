import {
  Body,
  Controller,
  Param,
  Post,
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

@ApiTags('auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Verify signature' })
  @ApiResponse({
    status: 200,
    description: 'Successfully verified signature',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async verifySignature(
    @Body('address') address: string,
    @Body('message') message: string,
    @Body('signature') signature: string,
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

    return { token: token };
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
