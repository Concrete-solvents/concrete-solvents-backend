import { CustomError } from '@Common/enums/custom-errors';
import { LeaveFromGroupCommand } from '@Group/cqrs/commands/leave-from-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(LeaveFromGroupCommand)
class LeaveFromGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
  ) {}

  async execute(
    command: LeaveFromGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
      relations: {
        users: true,
      },
    });

    if (!groupInDB) {
      return Err(CustomError.GroupDoesNotExist);
    }

    const filteredUsers = groupInDB.users.filter(
      (user) => user.id !== command.userId,
    );

    const isUserInGroup = filteredUsers.length !== groupInDB.users.length;

    if (!isUserInGroup) {
      return Err(CustomError.UserDoesNotInGroup);
    }

    const permissionInDB = await this._groupUserPermissionRepository.findOne({
      where: {
        userId: command.userId,
        group: {
          id: command.groupId,
        },
      },
    });

    if (permissionInDB.permission === GroupUserPermission.Owner) {
      return Err(CustomError.OwnerCantLeaveFromGroup);
    }

    groupInDB.users = filteredUsers;

    await this._groupRepository.save(groupInDB);

    await this._groupUserPermissionRepository.delete({
      userId: command.userId,
      group: {
        id: command.groupId,
      },
    });

    return Ok(true);
  }
}

export { LeaveFromGroupApplicationService };
