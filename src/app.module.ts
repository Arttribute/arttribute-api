import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './modules/payment/payment.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { PolybaseModule } from './shared/polybase';
import { ItemModule } from './modules/item/item.module';
import { LicenseModule } from './modules/license/license.module';
import { UploadModule } from './shared/web3storage/upload.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CollectionModule } from './modules/collection/collection.module';
import { ProjectModule } from './modules/project/project.module';
import { RequestModule } from './modules/request/request.module';
import { NetworkModule } from './modules/network/network.module';

@Module({
  imports: [
    // Utility Modules
    AuthModule,
    PolybaseModule,
    FileModule,
    UploadModule,

    // Feature Modules
    CertificateModule,
    CollectionModule,
    PaymentModule,
    ItemModule,
    LicenseModule,
    UserModule,
    ProjectModule,
    RequestModule,
    NetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
