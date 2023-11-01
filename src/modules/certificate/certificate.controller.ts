import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User, UserPayload } from '../auth';
import { CreateCertificate, PolybaseCertificate } from './certificate.dto';
import { CertificateService } from './certificate.service';
import { Project, Authentication } from '../auth/decorators';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('certificates')
@Controller({ version: '1', path: 'certificates' })
export class CertificateController {
  constructor(private certificateService: CertificateService) {}

  @ApiOperation({ summary: 'Create a new certificate' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new certificate',
    type: PolybaseCertificate,
  })
  @ApiResponse({ status: 404, description: 'No reference found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Authentication('jwt')
  @Post()
  public async createCertificate(
    @Body() body: CreateCertificate,
    @User() user: UserPayload,
  ) {
    return await this.certificateService.createCertificate({
      certificate: body,
      user,
    });
  }

  @ApiOperation({ summary: 'Get all certificates' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all certificates',
    type: [PolybaseCertificate],
  })
  @Get()
  public async getCertificates(@Query('full') full: boolean) {
    return this.certificateService.getCertificates({}, { full });
  }

  @ApiOperation({ summary: 'Get a certificate by slug' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved a certificate by slug',
    type: PolybaseCertificate,
  })
  @ApiResponse({ status: 404, description: 'No certificate found' })
  @Get(':slug')
  public async getCertificateBySlug(@Param('slug') slug: string) {
    return this.certificateService.getCertificateBySlug({ slug });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mint a certificate' })
  @Authentication('jwt')
  @Post('/mint/:certificateId')
  public async mintCertificate(
    @Param('certificateId') certificateId: string,
    @Body('message') message: string,
    @Body('signature') signature: string,
    @Body('image') image: string,
    @Body('title') title: string,
    @User() user: UserPayload,
  ) {
    return this.certificateService.mintCertificate(
      { certificateId },
      message,
      signature,
      user,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a certificate' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved a certificate',
    type: PolybaseCertificate,
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'The API key for the project',
    required: true,
  })
  @Authentication('all')
  @Get('/:certificateId')
  // TODO: a bit of an issue
  public async getCertificate(
    @Param('certificateId') certificateId: string,
    @Query('full') full: boolean,
    @User() user: UserPayload,
    @Project() project: any,
  ) {
    console.log({ user, project });
    return this.certificateService.getCertificate({ certificateId }, { full });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Discover certificates for a user',
    description:
      'Search for certificates that have been generated for your work. This includes certificates for items and collections.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved certificates for a user',
    type: [PolybaseCertificate],
  })
  @Authentication('any')
  @Get('/:userId/references') // TODO: This route structure?
  public async discoverUserCertificates(
    @Param('userId') userId: string,
    @Query('full') full: boolean,
  ) {
    return this.certificateService.discoverUserCertificates(
      { userId },
      { full },
    );
  }
}

