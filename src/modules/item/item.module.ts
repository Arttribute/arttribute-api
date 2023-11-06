import { Module } from '@nestjs/common';
import { UploadService } from 'src/shared/web3storage/upload.service';
import { UserService } from '../user/user.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { FileService } from '../file/file.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ItemController],
  providers: [ItemService, UploadService, FileService],
  exports: [ItemService],
})
export class ItemModule {}
