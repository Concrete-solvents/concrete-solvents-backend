import { CustomError } from '@Common/enums/custom-errors';
import { CancelGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/cancel-group-invite-to-user.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(CancelGroupInviteToUserCommand)
class CancelGroupInviteToUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
  ) {}

  async execute(
    command: CancelGroupInviteToUserCommand,
  ): Promise<Result<boolean, CustomError>> {
    const inviteInDB = await this._groupInviteRepository.findOne({
      where: {
        id: command.inviteId,
      },
      relations: {
        sentBy: true,
        group: true,
      },
    });

    if (!inviteInDB) {
      return Err(CustomError.InviteDoesNotExist);
    }

    const permissionInDB = await this._groupUserPermissionRepository.findOne({
      where: {
        group: {
          id: inviteInDB.group.id,
        },
        userId: command.userId,
      },
    });

    if (!permissionInDB) {
      return Err(CustomError.PermissionError);
    }

    const isUserHasPermission =
      inviteInDB.sentBy.id === command.userId ||
      permissionInDB.permission === GroupUserPermission.Owner ||
      permissionInDB.permission === GroupUserPermission.Moderator;

    if (!isUserHasPermission) {
      return Err(CustomError.PermissionError);
    }

    await this._groupInviteRepository.delete({
      id: command.inviteId,
    });

    return Ok(true);
  }
}

export { CancelGroupInviteToUserApplicationService };
