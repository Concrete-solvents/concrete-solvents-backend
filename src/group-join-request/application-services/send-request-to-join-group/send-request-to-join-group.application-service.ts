// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupJoinRequest
import { SendRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/send-request-to-join-group.command';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

// Group
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(SendRequestToJoinGroupCommand)
class SendRequestToJoinGroupApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    command: SendRequestToJoinGroupCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userPermission = await this._groupUserPermissionRepository.findOne({
      where: {
        userId: command.userId,
        group: {
          id: command.groupId,
        },
      },
    });

    if (userPermission) {
      return Err(CustomError.UserAlreadyInGroup);
    }

    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
    });

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
    });

    if (!groupInDB) {
      return Err(CustomError.GroupDoesNotExist);
    }

    const isJoinRequestAlreadyExist =
      await this._groupJoinRequestRepository.findOne({
        where: {
          sentBy: {
            id: command.userId,
          },
          group: {
            id: command.groupId,
          },
        },
      });

    if (isJoinRequestAlreadyExist) {
      return Err(CustomError.RequestToJoinGroupAlreadyExist);
    }

    const newJoinRequest = new GroupJoinRequestTypeormEntity();
    newJoinRequest.group = groupInDB;
    newJoinRequest.sentBy = userInDB;

    await this._groupJoinRequestRepository.save(newJoinRequest);

    return Ok(true);
  }
}

export { SendRequestToJoinGroupApplicationService };
