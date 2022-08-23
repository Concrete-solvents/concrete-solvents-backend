// Libraries
import { CheckIsPasswordCorrectApplicationService } from '@Auth/application-services/check-is-password-correct/check-is-password-correct.application.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// Auth
import { LoginHttpController } from '@Auth/controllers/login-controllers/login.http-controller';
import { LogoutHttpController } from '@Auth/controllers/logout-controllers/logout-http-controller/logout.http-controller';
import { RegistrationHttpController } from '@Auth/controllers/registration-controllers/registration-http-controller/registration.http-controller';
import { CreateUserWithSocialService } from '@Auth/application-services/create-user-with-social/create-user-with-social.service';
import { LoginUserWithSocialService } from '@Auth/application-services/login-user-with-social/login-user-with-social.service';
import { LoginService } from '@Auth/application-services/login/login.service';
import { RegistrationService } from '@Auth/application-services/registration/registration.service';
import { GithubStrategy } from '@Auth/strategies/github.strategy';
import { GoogleStrategy } from '@Auth/strategies/google.strategy';
import { JwtStrategy } from '@Auth/strategies/jwt.strategy';
import { SteamStrategy } from '@Auth/strategies/steam.strategy';

// Email
import { EmailEntity } from '@Email/entities/email.entity';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

// User
import { SocialEntity } from '@User/entities/social.entity';
import { UserEntity } from '@User/entities/user.entity';

const passportStrategies = [
  JwtStrategy,
  GoogleStrategy,
  GithubStrategy,
  SteamStrategy,
];

const httpControllers = [
  LoginHttpController,
  RegistrationHttpController,
  LogoutHttpController,
];

const commandHandlers = [
  LoginUserWithSocialService,
  LoginService,
  RegistrationService,
  CreateUserWithSocialService,
  CheckIsPasswordCorrectApplicationService,
];

@Module({
  providers: [...passportStrategies, ...commandHandlers],
  imports: [
    PassportModule,
    CqrsModule,
    TypeOrmModule.forFeature([
      UserEntity,
      EmailEntity,
      SocialEntity,
      SettingsEntity,
    ]),
  ],
  controllers: [...httpControllers],
})
export class AuthModule {}
