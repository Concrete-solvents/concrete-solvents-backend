// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { CancelFriendshipRequestCommand } from '@UserRelation/cqrs/commands/cancel-friendship-request.command';

@CommandHandler(CancelFriendshipRequestCommand)
class CancelFriendshipRequestApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(
    command: CancelFriendshipRequestCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.toUserId,
        type: UserRelationType.FiendsPending,
      },
    });

    if (!userRelationInDB) {
      return Err(CustomError.RequestDoesNotExist);
    }

    await this._userRelationRepository.delete({
      id: userRelationInDB.id,
    });

    return Ok(true);
  }
}

export { CancelFriendshipRequestApplicationService };
