import { CustomError } from '@Common/enums/custom-errors';
import { GetReceivedInvitesQuery } from '@GroupInvite/cqrs/queries/get-received-invites.query';
import { GetReceivedInvitesResponseDto } from '@GroupInvite/dtos/responses/get-received-invites-response.dto';
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@QueryHandler(GetReceivedInvitesQuery)
class GetReceivedInvitesApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(GroupInviteTypeormEntity)
    private readonly _groupInviteRepository: Repository<GroupInviteTypeormEntity>,
  ) {}

  async execute(
    query: GetReceivedInvitesQuery,
  ): Promise<Result<GetReceivedInvitesResponseDto, CustomError>> {
    const invites = await this._groupInviteRepository.find({
      where: {
        sentTo: {
          id: query.userId,
        },
      },
      relations: {
        group: true,
      },
      select: {
        group: {
          name: true,
          description: true,
          id: true,
          avatarUrl: true,
        },
      },
    });

    const groups = invites.map((invite) => ({
      name: invite.group.name,
      description: invite.group.description,
      id: invite.group.id,
      avatarUrl: invite.group.avatarUrl,
    }));

    return Ok({
      groups,
    });
  }
}

export { GetReceivedInvitesApplicationService };
