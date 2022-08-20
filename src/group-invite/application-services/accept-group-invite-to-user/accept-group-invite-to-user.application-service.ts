import { CustomError } from '@Common/enums/custom-errors';
import { AcceptGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/accept-group-invite-to-user.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@User/entities/user.entity';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(AcceptGroupInviteToUserCommand)
class AcceptGroupInviteToUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
  ) {}

  async execute(
    command: AcceptGroupInviteToUserCommand,
  ): Promise<Result<boolean, CustomError>> {
    const inviteInDB = await this._groupInviteRepository.findOne({
      where: {
        id: command.inviteId,
      },
      relations: {
        sentTo: true,
        group: true,
      },
    });

    if (!inviteInDB) {
      return Err(CustomError.InviteDoesNotExist);
    }

    if (inviteInDB.sentTo.id !== command.userId) {
      return Err(CustomError.PermissionError);
    }

    const isUserAlreadyInGroup =
      await this._groupUserPermissionRepository.findOne({
        where: {
          userId: command.userId,
          group: {
            id: inviteInDB.group.id,
          },
        },
      });

    if (isUserAlreadyInGroup) {
      return Err(CustomError.UserAlreadyInGroup);
    }

    const newPermission = new GroupUserPermissionTypeormEntity();
    newPermission.userId = command.userId;
    newPermission.group = inviteInDB.group;
    newPermission.permission = GroupUserPermission.Member;

    const newPermissionInDB = await this._groupUserPermissionRepository.save(
      newPermission,
    );

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: inviteInDB.group.id,
      },
      relations: {
        users: true,
        groupUserPermissions: true,
      },
    });

    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
    });

    groupInDB.users.push(userInDB);
    groupInDB.groupUserPermissions.push(newPermissionInDB);

    await this._groupRepository.save(groupInDB);

    await this._groupInviteRepository.delete({
      id: command.inviteId,
    });

    return Ok(true);
  }
}

export { AcceptGroupInviteToUserApplicationService };
