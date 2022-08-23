// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { DenyFriendshipRequestCommand } from '@UserRelation/cqrs/commands/deny-friendship-request.command';

@CommandHandler(DenyFriendshipRequestCommand)
class DenyFriendshipRequestApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: DenyFriendshipRequestCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.fromUserId,
        secondUserId: command.userId,
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

export { DenyFriendshipRequestApplicationService };
