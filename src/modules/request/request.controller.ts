import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User, UserPayload } from '../auth';
import { CreateRequest, UpdateRequest, PermissionRequest } from './request.dto';
import { RequestService } from './request.service';
import { Authentication } from '../auth/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('requests')
@Controller({ version: '1', path: 'requests' })
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({ summary: 'Create a new request' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new request',
    type: PermissionRequest,
  })
  @ApiResponse({ status: 400, description: 'You cannot request your own item' })
  @Authentication('jwt')
  @Post()
  async createRequest(
    @Body() requestDto: CreateRequest,
    @User() user: UserPayload,
  ) {
    const userId = user.sub;
    return this.requestService.createRequest(requestDto, userId);
  }

  @ApiOperation({ summary: 'Get received requests' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved received requests',
    type: PermissionRequest,
  })
  @Authentication('jwt')
  @Get('/received')
  async getReceivedRequests(@User() user: UserPayload) {
    const userId = user.sub;
    return this.requestService.getReceivedRequests(userId);
  }

  @ApiOperation({ summary: 'Get sent requests' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved sent requests',
    type: PermissionRequest,
  })
  @Authentication('jwt')
  @Get('/sent')
  async getSentRequests(@User() user: UserPayload) {
    const userId = user.sub;
    return this.requestService.getSentRequests(userId);
  }

  @Authentication('jwt')
  @Patch(':id')
  async updateRequestStatus(
    @Body() updateDto: UpdateRequest,
    @User() user: UserPayload,
    @Param('id') id: string,
  ) {
    const userId = user.sub;
    return this.requestService.updateRequestStatus(updateDto, id, userId);
  }

  //Delete Request
  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.requestService.deleteRequest(id);
  }
}
