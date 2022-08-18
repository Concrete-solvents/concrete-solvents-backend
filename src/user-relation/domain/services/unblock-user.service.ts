// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';

// User relation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { UnblockUserCommand } from '@UserRelation/cqrs/commands/unblock-user/unblock-user.command';

@CommandHandler(UnblockUserCommand)
class UnblockUserService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: UnblockUserCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.userToUnblockId,
      },
    });

    if (!userRelationInDB || userRelationInDB.type !== UserRelationType.Block) {
      return Err('You are not blocking this user');
    }

    await this._userRelationRepository.delete(userRelationInDB);

    return Ok(true);
  }
}

export { UnblockUserService };
