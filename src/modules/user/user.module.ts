// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Email
import { EmailEntity } from '@Email/entities/email.entity';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

// Group
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { GetUserProfileApplicationService } from '@User/application-services/get-user-profile/get-user-profile.application-service';
import { GetUserProfileHttpController } from '@User/controllers/get-user-profile/get-user-profile-http-controller/get-user-profile.http-controller';
import { UserEntity } from '@User/entities/user.entity';
import { GetMeApplicationService } from '@User/application-services/get-me/get-me.application-service';
import { UpdateUserApplicationService } from '@User/application-services/update-user/update-user.application-service';
import { GetMeHttpController } from '@User/controllers/get-me/get-me-http-controller/get-me.http-controller';
import { UpdateUserHttpController } from '@User/controllers/update-user/update-user-http-controller/update-user.http-controller';
import { GetUserByIdApplicationService } from '@User/application-services/get-user-by-id/get-user-by-id.application-service';
import { UpdateUserInfoApplicationService } from '@User/application-services/update-user-info/update-user-info.appliction-service';
import { GetUserByIdHttpController } from '@User/controllers/get-user-by-id/get-user-by-id-http-controller/get-user-by-id.http-controller';
import { UpdateUserProfileHttpController } from '@User/controllers/update-user-profile/update-user-profile-http-controller/update-user-profile.http-controller';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';

const httpControllers = [
  GetMeHttpController,
  UpdateUserHttpController,
  UpdateUserProfileHttpController,
  GetUserByIdHttpController,
  GetUserProfileHttpController,
];

const applicationServices = [
  GetMeApplicationService,
  UpdateUserApplicationService,
  UpdateUserInfoApplicationService,
  GetUserByIdApplicationService,
  GetUserProfileApplicationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmailEntity,
      SettingsEntity,
      UserRelationTypeormEntity,
      GroupTypeormEntity,
    ]),
    CqrsModule,
  ],
  providers: [...applicationServices],
  controllers: [...httpControllers],
})
export class UserModule {}
