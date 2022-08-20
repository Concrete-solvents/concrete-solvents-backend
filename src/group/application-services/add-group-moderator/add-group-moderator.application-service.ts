import { CustomError } from '@Common/enums/custom-errors';
import { AddGroupModeratorCommand } from '@Group/cqrs/commands/add-group-moderator.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(AddGroupModeratorCommand)
class AddGroupModeratorApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
  ) {}

  async execute(
    command: AddGroupModeratorCommand,
  ): Promise<Result<boolean, CustomError>> {
    const currentUserPermissionInDB =
      await this._groupUserPermissionRepository.findOne({
        where: {
          group: {
            id: command.groupId,
          },
          userId: command.userId,
        },
      });

    if (currentUserPermissionInDB.permission !== GroupUserPermission.Owner) {
      return Err(CustomError.PermissionError);
    }

    const givenUserPermissionInDB =
      await this._groupUserPermissionRepository.findOne({
        where: {
          group: {
            id: command.groupId,
          },
          userId: command.newModeratorUserId,
        },
      });

    if (!givenUserPermissionInDB) {
      return Err(CustomError.UserDoesNotInGroup);
    }

    if (givenUserPermissionInDB.permission === GroupUserPermission.Moderator) {
      return Err(CustomError.UserAlreadyModerator);
    }

    givenUserPermissionInDB.permission = GroupUserPermission.Moderator;

    await this._groupUserPermissionRepository.save(givenUserPermissionInDB);

    return Ok(true);
  }
}

export { AddGroupModeratorApplicationService };
