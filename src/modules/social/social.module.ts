// Libraries
import { AuthModule } from '@Auth/auth.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Social
import { SocialAuthController } from './social-auth.controller';

@Module({
  controllers: [SocialAuthController],
  imports: [AuthModule, CqrsModule],
})
class SocialModule {}

export { SocialModule };
