import { Global, Module, forwardRef } from '@nestjs/common';
import { OIDCController } from './oidc.controller';
import { OIDCService } from './oidc.service';
import { ProjectModule } from '~/modules/project/project.module';

@Global()
@Module({
  imports: [forwardRef(() => ProjectModule)],
  providers: [OIDCService],
  controllers: [OIDCController],
  exports: [OIDCService],
})
export class OIDCModule {}
