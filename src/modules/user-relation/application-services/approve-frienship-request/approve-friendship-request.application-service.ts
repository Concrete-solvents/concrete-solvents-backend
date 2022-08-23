// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { ApproveFriendshipRequestCommand } from '@UserRelation/cqrs/commands/approve-friendship-request.command';

@CommandHandler(ApproveFriendshipRequestCommand)
class ApproveFriendshipRequestApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(
    command: ApproveFriendshipRequestCommand,
  ): Promise<Result<boolean, string>> {
    console.log(command);
    const friendshipRequest = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.fromUserId,
        secondUserId: command.toUserId,
      },
    });

    if (!friendshipRequest) {
      return Err('The request does not exist');
    }

    if (friendshipRequest.type !== UserRelationType.FiendsPending) {
      return Err('The request does not pending');
    }

    friendshipRequest.type = UserRelationType.Friends;

    await this._userRelationRepository.save(friendshipRequest);

    const newRelation = await this._userRelationRepository.create({
      firstUserId: command.toUserId,
      secondUserId: command.fromUserId,
      type: UserRelationType.Friends,
    });

    await this._userRelationRepository.save(newRelation);

    return Ok(true);
  }
}

export { ApproveFriendshipRequestApplicationService };
