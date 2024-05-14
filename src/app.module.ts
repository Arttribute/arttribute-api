import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtifactModule } from './features/artifact';
import { AttributionModule } from './features/attribution';
import { CollectionModule } from './features/collection';
import { DatabaseModule } from './modules/database';
import { StorageModule } from './modules/storage';
import { AuthenticationGuard } from './features/authentication/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationModule } from './features/authentication';
import { UserModule } from './features/user';

@Module({
  imports: [
    // Utilities
    StorageModule,
    DatabaseModule,

    AuthenticationModule,

    ArtifactModule,
    AttributionModule,
    CollectionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    AppService,
  ],
})
export class AppModule {}
