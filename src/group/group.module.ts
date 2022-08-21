// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Group
import { AddGroupModeratorApplicationService } from '@Group/application-services/add-group-moderator/add-group-moderator.application-service';
import { ChangeGroupOwnerApplicationService } from '@Group/application-services/change-group-owner/change-group-owner.application-service';
import { DeleteGroupApplicationService } from '@Group/application-services/delete-group/delete-group.application-service';
import { DemoteGroupModeratorApplicationService } from '@Group/application-services/demote-group-moderator/demote-group-moderator.application-service';
import { EditGroupApplicationService } from '@Group/application-services/edit-group/edit-group.application-service';
import { GetGroupsByUserIdApplicationService } from '@Group/application-services/get-groups-by-user-id/get-groups-by-user-id.application-service';
import { KickUserFromGroupApplicationService } from '@Group/application-services/kick-user-from-group/kick-user-from-group.application-service';
import { LeaveFromGroupApplicationService } from '@Group/application-services/leave-from-group/leave-from-group.application-service';
import { AddGroupModeratorHttpController } from '@Group/controllers/add-group-moderator/add-group-moderator-http-controller/add-group-moderator.http-controller';
import { ChangeGroupOwnerHttpController } from '@Group/controllers/change-group-owner/change-group-owner-http-controller/change-group-owner.http-controller';
import { DeleteGroupHttpController } from '@Group/controllers/delete-group/delete-group-http-controller/delete-group.http-controller';
import { DemoteGroupModeratorHttpController } from '@Group/controllers/demote-group-moderator/demote-group-moderator-http-controller/demote-group-moderator.http-controller';
import { EditGroupHttpController } from '@Group/controllers/edit-group/edit-group-http-controller/edit-group.http-controller';
import { GetGroupsByUserIdHttpController } from '@Group/controllers/get-groups-by-user-id/get-groups-by-user-id-http-controller/get-groups-by-user-id.http-controller';
import { KickUserFromGroupHttpController } from '@Group/controllers/kick-user-from-group/kick-user-from-group-http-controller/kick-user-from-group.http-controller';
import { LeaveFromGroupHttpController } from '@Group/controllers/leave-from-group/leave-from-group-http-controller/leave-from-group.http-controller';
import { CreateGroupApplicationService } from './application-services/create-group/create-group.application-service';
import { CreateGroupHttpController } from './controllers/create-group/create-group-http-controller/create-group.http-controller';
import { GroupUserPermissionTypeormEntity } from './infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from './infrastructure/database/typeorm-entities/group.typeorm-entity';

// GroupJoinRequest
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

const httpControllers = [
  CreateGroupHttpController,
  DeleteGroupHttpController,
  LeaveFromGroupHttpController,
  AddGroupModeratorHttpController,
  DemoteGroupModeratorHttpController,
  KickUserFromGroupHttpController,
  GetGroupsByUserIdHttpController,
  ChangeGroupOwnerHttpController,
  EditGroupHttpController,
];

const applicationServices = [
  CreateGroupApplicationService,
  DeleteGroupApplicationService,
  LeaveFromGroupApplicationService,
  AddGroupModeratorApplicationService,
  DemoteGroupModeratorApplicationService,
  KickUserFromGroupApplicationService,
  GetGroupsByUserIdApplicationService,
  ChangeGroupOwnerApplicationService,
  EditGroupApplicationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupTypeormEntity,
      GroupUserPermissionTypeormEntity,
      GroupJoinRequestTypeormEntity,
    ]),
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [...applicationServices],
})
class GroupModule {}

export { GroupModule };
