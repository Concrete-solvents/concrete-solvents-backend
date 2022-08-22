// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { KickUserFromGroupCommand } from '@Group/cqrs/commands/kick-user-from-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(KickUserFromGroupCommand)
class KickUserFromGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    command: KickUserFromGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userToKickInDB = await this._userRepository.findOne({
      where: {
        id: command.userToKickId,
      },
    });

    if (!userToKickInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    const userToKickPermission =
      await this._groupUserPermissionRepository.findOne({
        where: {
          userId: command.userToKickId,
          group: {
            id: command.groupId,
          },
        },
      });

    if (!userToKickPermission) {
      return Err(CustomError.UserDoesNotInGroup);
    }

    const userWhoKickPermission =
      await this._groupUserPermissionRepository.findOne({
        where: {
          userId: command.userWhoKickId,
          group: {
            id: command.groupId,
          },
        },
      });

    if (userWhoKickPermission.permission === GroupUserPermission.Member) {
      return Err(CustomError.PermissionError);
    }

    if (userToKickPermission.permission === GroupUserPermission.Owner) {
      return Err(CustomError.PermissionError);
    }

    if (
      userToKickPermission.permission === GroupUserPermission.Moderator &&
      userWhoKickPermission.permission !== GroupUserPermission.Owner
    ) {
      return Err(CustomError.PermissionError);
    }

    await this._groupUserPermissionRepository.delete({
      id: userToKickPermission.id,
    });

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
      relations: {
        users: true,
      },
    });

    groupInDB.users = groupInDB.users.filter(
      (user) => user.id !== command.userWhoKickId,
    );

    await this._groupRepository.save(groupInDB);

    return Ok(true);
  }
}

export { KickUserFromGroupApplicationService };
