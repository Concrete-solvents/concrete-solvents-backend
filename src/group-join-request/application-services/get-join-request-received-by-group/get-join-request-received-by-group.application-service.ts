import { CustomError } from '@Common/enums/custom-errors';
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupUserPermissionTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group-user-permission.typeorm-entity';
import { GetJoinRequestReceivedByGroupQuery } from '@GroupJoinRequest/cqrs/quieries/get-join-request-received-by-group.query';
import { GetJoinRequestReceivedByGroupResponseDto } from '@GroupJoinRequest/dtos/responses/get-join-request-received-by-group-response.dto';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@QueryHandler(GetJoinRequestReceivedByGroupQuery)
class GetJoinRequestReceivedByGroupApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(GroupUserPermissionTypeormEntity)
    private readonly _groupUserPermissionRepository: Repository<GroupUserPermissionTypeormEntity>,
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
  ) {}

  async execute(
    query: GetJoinRequestReceivedByGroupQuery,
  ): Promise<Result<GetJoinRequestReceivedByGroupResponseDto, CustomError>> {
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

    const joinRequestsInDB = await this._groupJoinRequestRepository.find({
      where: {
        group: {
          id: query.groupId,
        },
      },
      relations: {
        sentBy: true,
      },
      select: {
        id: true,
        sentBy: {
          username: true,
          level: true,
          avatarUrl: true,
          id: true,
        },
      },
    });

    const joinRequests = joinRequestsInDB.map((joinRequest) => ({
      id: joinRequest.id,
      fromUser: {
        id: joinRequest.sentBy.id,
        username: joinRequest.sentBy.username,
        avatarUrl: joinRequest.sentBy.avatarUrl,
        level: joinRequest.sentBy.level,
      },
    }));

    return Ok({ joinRequests });
  }
}

export { GetJoinRequestReceivedByGroupApplicationService };
