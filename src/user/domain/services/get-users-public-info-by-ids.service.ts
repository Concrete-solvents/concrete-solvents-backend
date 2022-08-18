import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersPublicInfoByIdsQuery } from '@User/cqrs/queries/get-users-public-info-by-ids.query';
import { GetUsersPublicInfoByIdsResponseDto } from '@User/dtos/get-users-public-info-by-ids.response.dto';
import { UserEntity } from '@User/entities/user.entity';
import { Ok, Result } from 'oxide.ts';
import { In, Repository } from 'typeorm';

@QueryHandler(GetUsersPublicInfoByIdsQuery)
class GetUsersPublicInfoByIdsService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    query: GetUsersPublicInfoByIdsQuery,
  ): Promise<Result<GetUsersPublicInfoByIdsResponseDto, string>> {
    const users = await this._userRepository.find({
      where: {
        id: In(query.userIds),
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    return Ok({
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: 1,
      })),
    });
  }
}

export { GetUsersPublicInfoByIdsService };
