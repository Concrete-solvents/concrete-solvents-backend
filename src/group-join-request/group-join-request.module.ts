// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Group
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// groupJoinRequest
import { GetJoinRequestReceivedByGroupApplicationService } from '@GroupJoinRequest/application-services/get-join-request-received-by-group/get-join-request-received-by-group.application-service';
import { GetRequestsToJoinGroupSentByUserApplicationService } from '@GroupJoinRequest/application-services/get-requests-to-join-group-sent-by-user/get-requests-to-join-group-sent-by-user.application-service';
import { GetJoinRequestReceivedByGroupHttpController } from '@GroupJoinRequest/controllers/get-join-request-received-by-group/get-join-request-received-by-group-http-controller/get-join-request-received-by-group.http-controller';
import { GetRequestsToJoinGroupSentByUserHttpController } from '@GroupJoinRequest/controllers/get-requests-to-join-group-sent-by-user/get-requests-to-join-group-sent-by-user-http-controller/get-requests-to-join-group-sent-by-user.http-controller';
import { AcceptRequestToJoinGroupApplicationService } from '@GroupJoinRequest/application-services/accept-request-to-join-group/accept-request-to-join-group.application-service';
import { CancelRequestToJoinGroupApplicationService } from '@GroupJoinRequest/application-services/cancel-request-to-join-group/cancel-request-to-join-group.application-service';
import { RejectRequestToJoinGroupApplicationService } from '@GroupJoinRequest/application-services/reject-request-to-join-group/reject-request-to-join-group.application-service';
import { SendRequestToJoinGroupApplicationService } from '@GroupJoinRequest/application-services/send-request-to-join-group/send-request-to-join-group.application-service';
import { AcceptRequestToJoinGroupHttpController } from '@GroupJoinRequest/controllers/accept-request-to-join-group/accept-request-to-join-group-http-controller/accept-request-to-join-group.http-controller';
import { CancelRequestToJoinGroupHttpController } from '@GroupJoinRequest/controllers/cancel-request-to-join-group/cancel-request-to-join-group-http-controller/cancel-request-to-join-group.http-controller';
import { RejectRequestToJoinGroupHttpController } from '@GroupJoinRequest/controllers/reject-request-to-join-group/reject-request-to-join-group-http-controller/reject-request-to-join-group.http-controller';
import { SendRequestToJoinGroupHttpController } from '@GroupJoinRequest/controllers/send-request-to-join-group/send-request-to-join-group-http-controller/send-request-to-join-group.http-controller';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

const httpControllers = [
  SendRequestToJoinGroupHttpController,
  AcceptRequestToJoinGroupHttpController,
  RejectRequestToJoinGroupHttpController,
  CancelRequestToJoinGroupHttpController,
  GetRequestsToJoinGroupSentByUserHttpController,
  GetJoinRequestReceivedByGroupHttpController,
];

const applicationServices = [
  SendRequestToJoinGroupApplicationService,
  AcceptRequestToJoinGroupApplicationService,
  RejectRequestToJoinGroupApplicationService,
  CancelRequestToJoinGroupApplicationService,
  GetRequestsToJoinGroupSentByUserApplicationService,
  GetJoinRequestReceivedByGroupApplicationService,
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
class GroupJoinRequestModule {}

export { GroupJoinRequestModule };
