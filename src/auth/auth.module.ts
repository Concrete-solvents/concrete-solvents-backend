import { LoginHttpController } from '@Auth/controllers/login-controllers/login.http-controller';
import { LogoutHttpController } from '@Auth/controllers/logout-controllers/logout-http-controller/logout.http-controller';
import { RegistrationHttpController } from '@Auth/controllers/registration-controllers/registration-http-controller/registration.http-controller';
import { CreateUserWithSocialService } from '@Auth/domain/services/create-user-with-social/create-user-with-social.service';
import { LoginUserWithSocialService } from '@Auth/domain/services/login-user-with-social/login-user-with-social.service';
import { LoginService } from '@Auth/domain/services/login/login.service';
import { RegistrationService } from '@Auth/domain/services/registration/registration.service';
import { GithubStrategy } from '@Auth/strategies/github.strategy';
import { GoogleStrategy } from '@Auth/strategies/google.strategy';
import { JwtStrategy } from '@Auth/strategies/jwt.strategy';
import { SteamStrategy } from '@Auth/strategies/steam.strategy';
import { EmailModule } from '@Email/email.module';
import { EmailEntity } from '@Email/entities/email.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from '@Settings/entity/Settings.entity';
import { SocialEntity } from '@User/entities/social.entity';
import { UserEntity } from '@User/entities/user.entity';
import { UserModule } from '@User/user.module';

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
];

@Module({
  providers: [...passportStrategies, ...commandHandlers],
  imports: [
    UserModule,
    PassportModule,
    EmailModule,
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
