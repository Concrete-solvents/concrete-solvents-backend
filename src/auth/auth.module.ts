// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

// Auth
import { GithubStrategy } from '@Auth/strategies/github.strategy';
import { JwtStrategy } from '@Auth/strategies/jwt.strategy';
import { AuthController } from '@Auth/auth.controller';
import { AuthService } from '@Auth/auth.service';
import { GoogleStrategy } from '@Auth/strategies/google.strategy';
import { SteamStrategy } from '@Auth/strategies/steam.strategy';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

// User
import { UserModule } from '@User/user.module';
import { UserEntity } from '@User/entities/user.entity';
import { SocialEntity } from '@User/entities/social.entity';

// Email
import { EmailEntity } from '@Email/entities/email.entity';
import { EmailModule } from '@Email/email.module';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    SteamStrategy,
  ],
  imports: [
    UserModule,
    PassportModule,
    EmailModule,
    TypeOrmModule.forFeature([
      UserEntity,
      EmailEntity,
      SocialEntity,
      SettingsEntity,
    ]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
