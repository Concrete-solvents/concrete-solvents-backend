import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { CancelFriendshipRequestCommand } from '@UserRelation/cqrs/commands/cancel-friendship-request/cancel-friendship-request.command';

@CommandHandler(CancelFriendshipRequestCommand)
class CancelFriendshipRequestService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: CancelFriendshipRequestCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.toUserId,
      },
    });

    if (
      !userRelationInDB ||
      userRelationInDB.type !== UserRelationType.FiendsPending
    ) {
      return Err('The request does not exist');
    }

    await this._userRelationRepository.delete(userRelationInDB);

    return Ok(true);
  }
}

export { CancelFriendshipRequestService };
