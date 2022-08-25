// Libraries
import { CustomError } from '@Common/enums/custom-errors';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { UnblockUserCommand } from '@UserRelation/cqrs/commands/unblock-user.command';

@CommandHandler(UnblockUserCommand)
class UnblockUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: UnblockUserCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.userToUnblockId,
        type: UserRelationType.Block,
      },
    });

    if (!userRelationInDB) {
      return Err(CustomError.YouNotBlockingUser);
    }

    await this._userRelationRepository.delete({
      id: userRelationInDB.id,
    });

    return Ok(true);
  }
}

export { UnblockUserApplicationService };
