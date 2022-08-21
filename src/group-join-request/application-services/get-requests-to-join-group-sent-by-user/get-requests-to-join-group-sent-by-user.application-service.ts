// Libraries
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupJoinRequest
import { GetRequestsToJoinGroupSentByUserQuery } from '@GroupJoinRequest/cqrs/quieries/get-requests-to-join-group-sent-by-user.query';
import { GetRequestsToJoinGroupSentByUserResponseDto } from '@GroupJoinRequest/dtos/responses/get-requests-to-join-group-sent-by-user-response.dto';
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

@QueryHandler(GetRequestsToJoinGroupSentByUserQuery)
class GetRequestsToJoinGroupSentByUserApplicationService
  implements IQueryHandler
{
  constructor(
    @InjectRepository(GroupJoinRequestTypeormEntity)
    private readonly _groupJoinRequestRepository: Repository<GroupJoinRequestTypeormEntity>,
  ) {}

  async execute(
    query: GetRequestsToJoinGroupSentByUserQuery,
  ): Promise<Result<GetRequestsToJoinGroupSentByUserResponseDto, CustomError>> {
    const joinRequestsInDB = await this._groupJoinRequestRepository.find({
      where: {
        sentBy: {
          id: query.userId,
        },
      },
      relations: {
        group: true,
      },
      select: {
        id: true,
        group: {
          id: true,
          name: true,
          description: true,
          avatarUrl: true,
        },
      },
    });

    const joinRequests = joinRequestsInDB.map((joinRequest) => ({
      id: joinRequest.id,
      group: {
        id: joinRequest.id,
        name: joinRequest.group.name,
        description: joinRequest.group.description,
        avatarUrl: joinRequest.group.avatarUrl,
      },
    }));

    return Ok({ joinRequests });
  }
}

export { GetRequestsToJoinGroupSentByUserApplicationService };
