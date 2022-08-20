import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { GetJoinRequestReceivedByGroupApplicationService } from '@GroupJoinRequest/application-services/get-join-request-received-by-group/get-join-request-received-by-group.application-service';
import { GetRequestsToJoinGroupSentByUserApplicationService } from '@GroupJoinRequest/application-services/get-requests-to-join-group-sent-by-user/get-requests-to-join-group-sent-by-user.application-service';
import { GetJoinRequestReceivedByGroupHttpController } from '@GroupJoinRequest/controllers/get-join-request-received-by-group/get-join-request-received-by-group-http-controller/get-join-request-received-by-group.http-controller';
import { GetRequestsToJoinGroupSentByUserHttpController } from '@GroupJoinRequest/controllers/get-requests-to-join-group-sent-by-user/get-requests-to-join-group-sent-by-user-http-controller/get-requests-to-join-group-sent-by-user.http-controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@User/entities/user.entity';
import { AcceptRequestToJoinGroupApplicationService } from './application-services/accept-request-to-join-group/accept-request-to-join-group.application-service';
import { CancelRequestToJoinGroupApplicationService } from './application-services/cancel-request-to-join-group/cancel-request-to-join-group.application-service';
import { RejectRequestToJoinGroupApplicationService } from './application-services/reject-request-to-join-group/reject-request-to-join-group.application-service';
import { SendRequestToJoinGroupApplicationService } from './application-services/send-request-to-join-group/send-request-to-join-group.application-service';
import { AcceptRequestToJoinGroupHttpController } from './controllers/accept-request-to-join-group/accept-request-to-join-group-http-controller/accept-request-to-join-group.http-controller';
import { CancelRequestToJoinGroupHttpController } from './controllers/cancel-request-to-join-group/cancel-request-to-join-group-http-controller/cancel-request-to-join-group.http-controller';
import { RejectRequestToJoinGroupHttpController } from './controllers/reject-request-to-join-group/reject-request-to-join-group-http-controller/reject-request-to-join-group.http-controller';
import { SendRequestToJoinGroupHttpController } from './controllers/send-request-to-join-group/send-request-to-join-group-http-controller/send-request-to-join-group.http-controller';
import { GroupJoinRequestTypeormEntity } from './infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

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
