import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtifactModule } from './features/artifact';
import { AttributionModule } from './features/attribution';
import { CollectionModule } from './features/collection';
import { DatabaseModule } from './modules/database';

@Module({
  imports: [
    // Utilities
    DatabaseModule,

    ArtifactModule,
    AttributionModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
