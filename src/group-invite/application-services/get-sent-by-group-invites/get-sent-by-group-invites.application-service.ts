import { CustomError } from '@Common/enums/custom-errors';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GetSentByGroupInvitesQuery } from '@GroupInvite/cqrs/queries/get-sent-by-group-invites.query';
import { GetSentByGroupInvitesResponseDto } from '@GroupInvite/dtos/responses/get-sent-by-group-invites-response.dto';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@QueryHandler(GetSentByGroupInvitesQuery)
class GetSentByGroupInvitesApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
  ) {}

  async execute(
    query: GetSentByGroupInvitesQuery,
  ): Promise<Result<GetSentByGroupInvitesResponseDto, CustomError>> {
    const userPermissionInDB =
      await this._groupUserPermissionRepository.findOne({
        where: {
          group: {
            id: query.groupId,
          },
          userId: query.userId,
        },
      });

    const isUserHasPermission =
      userPermissionInDB &&
      (userPermissionInDB.permission === GroupUserPermission.Owner ||
        userPermissionInDB.permission === GroupUserPermission.Moderator);

    if (!isUserHasPermission) {
      return Err(CustomError.PermissionError);
    }

    const invitesInDB = await this._groupInviteRepository.find({
      where: {
        group: {
          id: query.groupId,
        },
      },
      relations: {
        sentTo: true,
      },
      select: {
        id: true,
        sentTo: {
          username: true,
          level: true,
          avatarUrl: true,
          id: true,
        },
      },
    });

    const invites = invitesInDB.map((invite) => ({
      id: invite.id,
      toUser: {
        id: invite.sentTo.id,
        username: invite.sentTo.username,
        avatarUrl: invite.sentTo.avatarUrl,
        level: invite.sentTo.level,
      },
    }));

    return Ok({ invites });
  }
}

export { GetSentByGroupInvitesApplicationService };
