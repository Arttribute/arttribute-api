import { Module } from '@nestjs/common';
import { AttributionController } from './attribution.controller';
import { AttributionService } from './attribution.service';

@Module({
  imports: [],
  controllers: [AttributionController],
  providers: [AttributionService],
  exports: [AttributionService],
})
export class AttributionModule {}
