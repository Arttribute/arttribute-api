import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

// @Authentication('any')
@Controller({ version: '1', path: 'file' })
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // 10 MB size limit
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 }) as any], // TODO: Temporary fix
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.encodeToBase64(file);
  }

  @Post('verify')
  verifyFile(
    @Body() base64String: { file: { data: string; mimetype?: string } },
  ) {
    return this.fileService.uploadBase64File(base64String.file);
  }
}

/*
{
  "file": {
    "fieldname": "file",
    "originalname": "flag 4.png",
    "encoding": "7bit",
    "mimetype": "image/png",
    "buffer": {
      "type": "Buffer",
      "data": [
        137,
        80, ---
      ]
    },
    "size": 48180
  }
}
*/
