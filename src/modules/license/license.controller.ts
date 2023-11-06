import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseModel } from './license.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authentication } from '../auth';

@Authentication('jwt')
@ApiTags('licenses')
@Controller({ version: '1', path: 'licenses' })
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @ApiOperation({ summary: 'Get all licenses' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all licenses',
    type: [LicenseModel],
  })
  @Get()
  findAll() {
    return this.licenseService.findAll();
  }

  @ApiOperation({ summary: 'Get a license by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved a license',
    type: LicenseModel,
  })
  @ApiResponse({ status: 404, description: 'License not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new license' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new license',
    type: LicenseModel,
  })
  @Authentication('jwt')
  @Post()
  create(@Body() createLicense: LicenseModel) {
    return this.licenseService.create(createLicense);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a license' })
  @Authentication('jwt')
  @Patch(':id')
  // TODO: do something here
  update(@Param('id') id: string, @Body() updateLicense: LicenseModel) {
    return this.licenseService.update();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a license' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted a license',
  })
  @ApiResponse({ status: 404, description: 'License not found' })
  @Authentication('jwt')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenseService.remove(id);
  }
}
