import { Global, Module, forwardRef } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { ProjectModule } from '~/modules/project/project.module';

@Global()
@Module({
  imports: [forwardRef(() => ProjectModule)],
  providers: [OAuthService],
  controllers: [OAuthController],
  exports: [OAuthService],
})
export class OAUTHModule {}
