// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';

// UserRelation
import { ApproveFriendshipRequestApplicationService } from '@UserRelation/application-services/approve-frienship-request/approve-friendship-request.application-service';
import { CancelFriendshipRequestApplicationService } from '@UserRelation/application-services/cancel-friendship-request/cancel-friendship-request.application-service';
import { DenyFriendshipRequestApplicationService } from '@UserRelation/application-services/deny-friendship-request/deny-friendship-request.application-service';
import { GetUserRelationsApplicationService } from '@UserRelation/application-services/get-user-relations/get-user-relations.application-service';
import { SendFriendshipRequestApplicationService } from '@UserRelation/application-services/send-friendship-request/send-friendship-request.application-service';
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { GetUserRelationsHttpController } from '@UserRelation/controllers/get-user-relations-controllers/get-user-relations-http-controller/get-user-relations.http-controller';
import { SendFriendshipRequestHttpController } from '@UserRelation/controllers/send-friendship-request/send-friendship-request-http-controller/send-friendship-request.http-controller';
import { ApproveFriendshipRequestHttpController } from '@UserRelation/controllers/approve-friendship-request/approve-friendship-request-http-controller/approve-friendship-request.http-controller';
import { CancelFriendshipRequestHttpController } from '@UserRelation/controllers/cancel-friendship-request/cancel-friendship-request-http-controller/cancel-friendship-request.http-controller';
import { DenyFriendshipRequestHttpController } from '@UserRelation/controllers/deny-friendship-request/deny-friendship-request-http-controller/deny-friendship-request.http-controller';

const httpControllers = [
  GetUserRelationsHttpController,
  CancelFriendshipRequestHttpController,
  SendFriendshipRequestHttpController,
  ApproveFriendshipRequestHttpController,
  DenyFriendshipRequestHttpController,
];

const applicationServices = [
  GetUserRelationsApplicationService,
  SendFriendshipRequestApplicationService,
  DenyFriendshipRequestApplicationService,
  ApproveFriendshipRequestApplicationService,
  CancelFriendshipRequestApplicationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRelationTypeormEntity, UserEntity]),
    CqrsModule,
  ],
  providers: [...applicationServices],
  controllers: [...httpControllers],
})
class UserRelationModule {}

export { UserRelationModule };
