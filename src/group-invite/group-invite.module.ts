import { GetReceivedInvitesApplicationService } from '@GroupInvite/application-services/get-received-invites/get-received-invites.application-service';
import { GetSentByGroupInvitesApplicationService } from '@GroupInvite/application-services/get-sent-by-group-invites/get-sent-by-group-invites.application-service';
import { GetReceivedInvitesHttpController } from '@GroupInvite/controllers/get-received-invites/get-received-invites-http-controller/get-received-invites.http-controller';
import { GetSentByGroupInvitesHttpController } from '@GroupInvite/controllers/get-sent-by-group-invites/get-sent-by-group-invites-http-controller/get-sent-by-group-invites.http-controller';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@User/entities/user.entity';
import { AcceptGroupInviteToUserApplicationService } from './application-services/accept-group-invite-to-user/accept-group-invite-to-user.application-service';
import { CancelGroupInviteToUserApplicationService } from './application-services/cancel-group-invite-to-user/cancel-group-invite-to-user.application-service';
import { RejectGroupInviteToUserApplicationService } from './application-services/reject-group-invite-to-user/reject-group-invite-to-user.application-service';
import { SendGroupInviteToUserApplicationService } from './application-services/send-group-invite-to-user/send-group-invite-to-user.application-service';
import { AcceptGroupInviteToUserHttpController } from './controllers/accept-group-invite-to-user/accept-group-invite-to-user-http-controller/accept-group-invite-to-user.http-controller';
import { CancelGroupInviteToUserHttpController } from './controllers/cancel-group-invite-to-user/cancel-group-invite-to-user-http-controller/cancel-group-invite-to-user.http-controller';
import { RejectGroupInviteToUserHttpController } from './controllers/reject-group-invite-to-user/reject-group-invite-to-user-http-controller/reject-group-invite-to-user.http-controller';
import { SendGroupInviteToUserHttpController } from './controllers/send-group-invite-to-user/send-group-invite-to-user-http-controller/send-group-invite-to-user.http-controller';
import { GroupInviteTypeormEntity } from './infrastructure/database/typeorm-entities/group-invite.typeorm-entity';

const httpControllers = [
  SendGroupInviteToUserHttpController,
  CancelGroupInviteToUserHttpController,
  AcceptGroupInviteToUserHttpController,
  RejectGroupInviteToUserHttpController,
  GetReceivedInvitesHttpController,
  GetSentByGroupInvitesHttpController,
];

const applicationServices = [
  SendGroupInviteToUserApplicationService,
  CancelGroupInviteToUserApplicationService,
  AcceptGroupInviteToUserApplicationService,
  RejectGroupInviteToUserApplicationService,
  GetReceivedInvitesApplicationService,
  GetSentByGroupInvitesApplicationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupTypeormEntity,
      GroupUserPermissionTypeormEntity,
      GroupJoinRequestTypeormEntity,
      GroupInviteTypeormEntity,
    ]),
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [...applicationServices],
})
class GroupInviteModule {}

export { GroupInviteModule };
