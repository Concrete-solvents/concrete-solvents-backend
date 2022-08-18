// Libraries
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UserEntity } from '@User/entities/user.entity';
import { ApproveFriendshipRequestService } from './domain/services/approve-friendship-request.service';
import { CancelFriendshipRequestService } from './domain/services/cancel-friendship-request.service';
import { DenyFriendshipRequestService } from './domain/services/deny-friendship-request.service';
import { GetUserRelationsService } from './domain/services/get-user-relations.service';
import { SendFriendshipRequestService } from './domain/services/send-friendship-request.service';
import { UserRelationTypeormEntity } from './entities/user-relation.typeorm-entity';

// Controllers
import { GetUserRelationsHttpController } from './controllers/get-user-relations-controllers/get-user-relations.http-controller';
import { SendFriendshipRequestHttpController } from './cqrs/commands/send-friendship-request/send-friendship-request.http-controller';
import { ApproveFriendshipRequestHttpController } from './cqrs/commands/approve-friendship-request/approve-friendship-request.http-controller';
import { CancelFriendshipRequestHttpController } from './cqrs/commands/cancel-friendship-request/cancel-friendship-request.http-controller';
import { DenyFriendshipRequestHttpController } from './cqrs/commands/deny-friendship-request/deny-friendship-request.http-controller';

const httpControllers = [
  GetUserRelationsHttpController,
  CancelFriendshipRequestHttpController,
  SendFriendshipRequestHttpController,
  ApproveFriendshipRequestHttpController,
  DenyFriendshipRequestHttpController,
];

const queryHandlers = [GetUserRelationsService];

const commandHandlers = [
  SendFriendshipRequestService,
  DenyFriendshipRequestService,
  ApproveFriendshipRequestService,
  CancelFriendshipRequestService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRelationTypeormEntity, UserEntity]),
    CqrsModule,
  ],
  providers: [...queryHandlers, ...commandHandlers],
  controllers: [...httpControllers],
})
class UserRelationModule {}

export { UserRelationModule };
