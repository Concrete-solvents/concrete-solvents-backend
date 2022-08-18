// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';

// User relation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { DeleteFriendCommand } from '@UserRelation/cqrs/commands/delete-friend/delete-friend.command';

@CommandHandler(DeleteFriendCommand)
class DeleteFriendService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: DeleteFriendCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.userToDeleteId,
      },
    });

    if (
      !userRelationInDB ||
      userRelationInDB.type !== UserRelationType.Friends
    ) {
      return Err('You and the user are not friends');
    }

    await this._userRelationRepository.delete(userRelationInDB);

    const secondUserRelation = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userToDeleteId,
        secondUserId: command.userId,
      },
    });

    if (secondUserRelation) {
      await this._userRelationRepository.delete(secondUserRelation);
    }

    return Ok(true);
  }
}

export { DeleteFriendService };
