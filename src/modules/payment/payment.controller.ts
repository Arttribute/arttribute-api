import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserPayload } from '../auth';
import { Authentication, Project } from '../auth/decorators';
import { CreatePayment, Payment } from './payment.dto';
import { PaymentService } from './payment.service';

@ApiBearerAuth()
@ApiTags('payments')
@Controller({ version: '1', path: 'payments' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new payment',
    type: Payment,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Network not supported' })
  @Authentication('all')
  @Post()
  async createPayment(
    @Body() paymentDto: CreatePayment,
    @User() user: UserPayload,
    @Project() project: any,
  ) {
    return this.paymentService.createPayment(paymentDto, user, project);
  }

  @ApiOperation({ summary: 'Get all payments received by user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all payments received by user',
    type: [Payment],
  })
  @Authentication('jwt')
  @Get('/received')
  async getUserPaymentsReceived(@User() user: UserPayload) {
    return this.paymentService.getUserPaymentsReceived(user);
  }

  @Authentication('jwt')
  @ApiOperation({ summary: 'Get all payments sent by user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all payments sent by user',
    type: [Payment],
  })
  @Get('/sent')
  async getUserPaymentsSent(@User() user: UserPayload) {
    return this.paymentService.getUserPaymentsSent(user);
  }

  @ApiOperation({ summary: 'Get all payments by source' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all payments by source',
    type: [Payment],
  })
  @Get(':source')
  async getPaymentsBySource(@Param('source') source: string) {
    return this.paymentService.getPaymentsBySource(source);
  }

  //Delete Payment
  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.paymentService.deletePayment(id);
  }
}
