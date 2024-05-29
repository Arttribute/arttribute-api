import { Module, forwardRef } from '@nestjs/common';
import { UserAttributionController } from './user-attribution.controller';
import { AttributionModule } from '~/features/attribution';
import { UserAttributionService } from './user-attribution.service';

@Module({
  imports: [forwardRef(() => AttributionModule)],
  controllers: [UserAttributionController],
  providers: [UserAttributionService],
  exports: [],
})
export class UserAttributionModule {}
