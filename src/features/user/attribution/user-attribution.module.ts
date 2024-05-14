import { Module, forwardRef } from '@nestjs/common';
import { UserAttributionController } from './user-attribution.controller';
import { AttributionModule } from '~/features/attribution';

@Module({
  imports: [forwardRef(() => AttributionModule)],
  controllers: [UserAttributionController],
  providers: [],
  exports: [],
})
export class UserAttributionModule {}
