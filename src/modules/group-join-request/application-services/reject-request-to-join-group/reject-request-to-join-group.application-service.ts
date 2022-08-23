// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupJoinRequest
import { RejectRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/reject-request-to-join-group.command';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

// Group
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';

@CommandHandler(RejectRequestToJoinGroupCommand)
class RejectRequestToJoinGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
  ) {}

  async execute(
    command: RejectRequestToJoinGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const joinRequestInDB = await this._groupJoinRequestRepository.findOne({
      where: {
        id: command.joinRequestId,
      },
      relations: {
        group: true,
        sentBy: true,
      },
    });

    if (!joinRequestInDB) {
      return Err(CustomError.JoinRequestDoesNotExist);
    }

    const userPermission = await this._groupUserPermissionRepository.findOne({
      where: {
        group: {
          id: joinRequestInDB.group.id,
        },
        userId: command.userId,
      },
    });

    const isUserHasPermission =
      userPermission &&
      userPermission.permission ===
        (GroupUserPermission.Owner || GroupUserPermission.Moderator);

    if (!isUserHasPermission) {
      return Err(CustomError.PermissionError);
    }

    await this._groupJoinRequestRepository.delete({
      id: command.joinRequestId,
    });

    return Ok(true);
  }
}

export { RejectRequestToJoinGroupApplicationService };
