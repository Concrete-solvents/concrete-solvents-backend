// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { UserEntity } from '@User/entities/user.entity';

// Group
import { CreateGroupCommand } from '@Group/cqrs/commands/create-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

@CommandHandler(CreateGroupCommand)
class CreateGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionsRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    command: CreateGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const isGroupWithGivenNameAlreadyExist =
      await this._groupRepository.findOne({
        where: {
          name: command.name,
        },
      });

    if (isGroupWithGivenNameAlreadyExist) {
      return Err(CustomError.LoginIsAlreadyBusy);
    }

    const ownerInDB = await this._userRepository.findOne({
      where: {
        id: command.ownerId,
      },
    });

    const ownerPermission = new GroupUserPermissionTypeormEntity();

    ownerPermission.userId = command.ownerId;
    ownerPermission.permission = GroupUserPermission.Owner;
    const ownerPermissionInDB = await this._groupUserPermissionsRepository.save(
      ownerPermission,
    );

    const newGroup = new GroupTypeormEntity();

    newGroup.name = command.name;
    newGroup.description = command.description;

    if (command.avatarUrl) {
      newGroup.avatarUrl = command.avatarUrl;
    }

    newGroup.groupUserPermissions = [ownerPermissionInDB];
    newGroup.users = [ownerInDB];

    await this._groupRepository.save(newGroup);

    return Ok(true);
  }
}

export { CreateGroupApplicationService };
