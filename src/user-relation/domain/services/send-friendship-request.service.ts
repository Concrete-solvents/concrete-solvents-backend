// Libraries
import { Err, Ok } from 'oxide.ts';
import { ResultType } from 'oxide.ts/dist/result';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// User relation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { SendFriendshipRequestCommand } from '@UserRelation/cqrs/commands/send-friendship-request/send-friendship-request.command';

@CommandHandler(SendFriendshipRequestCommand)
class SendFriendshipRequestService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(
    command: SendFriendshipRequestCommand,
  ): Promise<ResultType<boolean, string>> {
    const firstToSecondRelationInDB =
      await this._userRelationRepository.findOne({
        where: {
          firstUserId: command.fromUserId,
          secondUserId: command.toUserId,
        },
      });

    if (firstToSecondRelationInDB) {
      if (firstToSecondRelationInDB.type === UserRelationType.Block) {
        return Err('You have blocked the user');
      }

      if (firstToSecondRelationInDB.type === UserRelationType.FiendsPending) {
        return Err('You have already submitted a friendship request');
      }

      if (firstToSecondRelationInDB.type === UserRelationType.Friends) {
        return Err("You're already friends");
      }
    }

    const secondToFirstRelationInDB =
      await this._userRelationRepository.findOne({
        where: {
          firstUserId: command.toUserId,
          secondUserId: command.fromUserId,
        },
      });

    if (secondToFirstRelationInDB) {
      if (secondToFirstRelationInDB.type === UserRelationType.Block) {
        return Err('The user has blocked you');
      }

      if (firstToSecondRelationInDB.type === UserRelationType.FiendsPending) {
        return Err('The user has already sent a friend request to you');
      }

      if (firstToSecondRelationInDB.type === UserRelationType.Friends) {
        return Err("You're already friends");
      }
    }

    const newRelation = this._userRelationRepository.create({
      firstUserId: command.fromUserId,
      secondUserId: command.toUserId,
      type: UserRelationType.FiendsPending,
    });

    await this._userRelationRepository.save(newRelation);

    return Ok(true);
  }
}

export { SendFriendshipRequestService };
