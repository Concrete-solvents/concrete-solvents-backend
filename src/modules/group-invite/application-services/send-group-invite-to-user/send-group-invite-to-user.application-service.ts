// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupInvite
import { SendGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/send-group-invite-to-user.command';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';

// Group
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(SendGroupInviteToUserCommand)
class SendGroupInviteToUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
  ) {}

  async execute(
    command: SendGroupInviteToUserCommand,
  ): Promise<Result<boolean, CustomError>> {
    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: command.groupId,
      },
    });

    if (!groupInDB) {
      return Err(CustomError.GroupDoesNotExist);
    }

    const invitedUserInDB = await this._userRepository.findOne({
      where: {
        id: command.sentToUserId,
      },
      relations: {
        groups: true,
      },
    });

    if (!invitedUserInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    const userWhoSentInviteInDB = await this._userRepository.findOne({
      where: {
        id: command.sentByUserId,
      },
      relations: {
        groups: true,
      },
    });

    const isUserHasPermissionToInvite =
      userWhoSentInviteInDB.groups.findIndex(
        (el) => el.id === command.groupId,
      ) !== -1;

    if (!isUserHasPermissionToInvite) {
      return Err(CustomError.PermissionError);
    }

    const isInvitedUserAlreadyInGroup =
      invitedUserInDB.groups.findIndex((el) => el.id === command.groupId) !==
      -1;

    if (isInvitedUserAlreadyInGroup) {
      return Err(CustomError.UserAlreadyInGroup);
    }

    const isInvitedAlreadyExist = await this._groupInviteRepository.findOne({
      where: {
        group: {
          id: command.groupId,
        },
        sentTo: {
          id: command.sentToUserId,
        },
      },
    });

    if (isInvitedAlreadyExist) {
      return Err(CustomError.UserAlreadyInvited);
    }

    const newInvite = new GroupInviteTypeormEntity();

    newInvite.group = groupInDB;
    newInvite.sentBy = userWhoSentInviteInDB;
    newInvite.sentTo = invitedUserInDB;

    await this._groupInviteRepository.save(newInvite);

    return Ok(true);
  }
}

export { SendGroupInviteToUserApplicationService };
