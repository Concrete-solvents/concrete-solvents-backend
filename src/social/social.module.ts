// Libraries
import { AuthModule } from '@Auth/auth.module';
import { Module } from '@nestjs/common';

// Social
import { SocialAuthController } from './social-auth.controller';

@Module({
  controllers: [SocialAuthController],
  imports: [AuthModule],
})
class SocialModule {}

export { SocialModule };
