import { CustomError } from '@Common/enums/custom-errors';
import { CancelRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/cancel-request-to-join-group.command';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(CancelRequestToJoinGroupCommand)
class CancelRequestToJoinGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    command: CancelRequestToJoinGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const joinRequestInDB = await this._groupJoinRequestRepository.findOne({
      where: {
        group: {
          id: command.groupId,
        },
        sentBy: {
          id: command.userId,
        },
      },
    });

    if (!joinRequestInDB) {
      return Err(CustomError.JoinRequestDoesNotExist);
    }

    await this._groupJoinRequestRepository.delete({
      group: {
        id: command.groupId,
      },
      sentBy: {
        id: command.userId,
      },
    });

    return Ok(true);
  }
}

export { CancelRequestToJoinGroupApplicationService };
