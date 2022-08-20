import { CustomError } from '@Common/enums/custom-errors';
import { DeleteGroupCommand } from '@Group/cqrs/commands/delete-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(DeleteGroupCommand)
class DeleteGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
  ) {}

  async execute(
    command: DeleteGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
    });

    if (!groupInDB) {
      return Err(CustomError.GroupDoesNotExist);
    }

    const isUserHasPermission = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
        groupUserPermissions: {
          permission: GroupUserPermission.Owner,
          userId: command.userId,
        },
      },
      relations: {
        groupUserPermissions: true,
      },
    });

    if (!isUserHasPermission) {
      return Err(CustomError.PermissionError);
    }

    await this._groupRepository.delete({
      id: command.groupId,
    });

    return Ok(true);
  }
}

export { DeleteGroupApplicationService };
