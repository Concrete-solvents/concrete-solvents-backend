import { CustomError } from '@Common/enums/custom-errors';
import { AcceptRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/accept-request-to-join-group.command';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@CommandHandler(AcceptRequestToJoinGroupCommand)
class AcceptRequestToJoinGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    command: AcceptRequestToJoinGroupCommand,
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

    const newPermission = new GroupUserPermissionTypeormEntity();
    newPermission.group = joinRequestInDB.group;
    newPermission.userId = joinRequestInDB.sentBy.id;
    newPermission.permission = GroupUserPermission.Member;

    await this._groupUserPermissionRepository.save(newPermission);

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: joinRequestInDB.group.id,
      },
      relations: {
        users: true,
      },
    });

    groupInDB.users.push(joinRequestInDB.sentBy);

    await this._groupRepository.save(groupInDB);

    await this._groupJoinRequestRepository.delete({
      id: command.joinRequestId,
    });

    return Ok(true);
  }
}

export { AcceptRequestToJoinGroupApplicationService };
