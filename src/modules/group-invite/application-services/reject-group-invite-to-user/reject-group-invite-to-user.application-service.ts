// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupInvite
import { RejectGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/reject-group-invite-to-user.command';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';

@CommandHandler(RejectGroupInviteToUserCommand)
class RejectGroupInviteToUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
  ) {}

  async execute(
    command: RejectGroupInviteToUserCommand,
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

    await this._groupInviteRepository.delete({
      id: command.inviteId,
    });

    return Ok(true);
  }
}

export { RejectGroupInviteToUserApplicationService };
