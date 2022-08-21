// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { ChangeGroupOwnerCommand } from '@Group/cqrs/commands/change-group-owner.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(ChangeGroupOwnerCommand)
class ChangeGroupOwnerApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    command: ChangeGroupOwnerCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userPermissionInDB =
      await this._groupUserPermissionRepository.findOne({
        where: {
          group: {
            id: command.groupId,
          },
          userId: command.userId,
          permission: GroupUserPermission.Owner,
        },
      });

    if (!userPermissionInDB) {
      return Err(CustomError.PermissionError);
    }

    const newOwnerInDB = await this._userRepository.findOne({
      where: {
        id: command.newOwnerId,
      },
    });

    if (!newOwnerInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    const newOwnerPermissionInDB =
      await this._groupUserPermissionRepository.findOne({
        where: {
          group: {
            id: command.groupId,
          },
          userId: command.newOwnerId,
        },
      });

    if (!newOwnerPermissionInDB) {
      return Err(CustomError.UserDoesNotInGroup);
    }

    newOwnerPermissionInDB.permission = GroupUserPermission.Owner;
    userPermissionInDB.permission = GroupUserPermission.Moderator;

    await this._groupUserPermissionRepository.save(newOwnerPermissionInDB);
    await this._groupUserPermissionRepository.save(userPermissionInDB);

    return Ok(true);
  }
}

export { ChangeGroupOwnerApplicationService };
