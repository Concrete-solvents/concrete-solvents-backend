// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { EditGroupCommand } from '@Group/cqrs/commands/edit-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

@CommandHandler(EditGroupCommand)
class EditGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    command: EditGroupCommand,
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

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
    });

    if (typeof command.name !== 'undefined') {
      const isNameAlreadyBusy = await this._groupRepository.findOne({
        where: {
          name: command.name,
        },
      });

      if (isNameAlreadyBusy) {
        return Err(CustomError.GroupNameAlreadyBusy);
      }

      groupInDB.name = command.name;
    }

    if (typeof command.description !== 'undefined') {
      groupInDB.description = command.description;
    }

    if (typeof command.avatarUrl !== 'undefined') {
      groupInDB.avatarUrl = command.avatarUrl;
    }

    await this._groupRepository.save(groupInDB);

    return Ok(true);
  }
}

export { EditGroupApplicationService };
