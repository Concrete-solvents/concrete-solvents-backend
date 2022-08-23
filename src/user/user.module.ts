// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Email
import { EmailEntity } from '@Email/entities/email.entity';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';
import { UpdateUserInfoApplicationService } from '@User/application-services/update-user-info/update-user-info.appliction-service';
import { UpdateUserProfileHttpController } from '@User/controllers/update-user-profile/update-user-profile-http-controller/update-user-profile.http-controller';

// User
import { UserEntity } from '@User/entities/user.entity';
import { GetMeApplicationService } from '@User/application-services/get-me/get-me.application-service';
import { UpdateUserApplicationService } from '@User/application-services/update-user/update-user.application-service';
import { GetMeHttpController } from '@User/controllers/get-me/get-me-http-controller/get-me.http-controller';
import { UpdateUserHttpController } from '@User/controllers/update-user/update-user-http-controller/update-user.http-controller';

const httpControllers = [
  GetMeHttpController,
  UpdateUserHttpController,
  UpdateUserProfileHttpController,
];

const applicationServices = [
  GetMeApplicationService,
  UpdateUserApplicationService,
  UpdateUserInfoApplicationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailEntity, SettingsEntity]),
    CqrsModule,
  ],
  providers: [...applicationServices],
  controllers: [...httpControllers],
})
export class UserModule {}
