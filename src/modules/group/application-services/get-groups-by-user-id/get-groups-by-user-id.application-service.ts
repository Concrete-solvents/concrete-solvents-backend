// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { GetGroupsByUserIdQuery } from '@Group/cqrs/queries/get-groups-by-user-id.query';
import { GetGroupsByUserIdResponseDto } from '@Group/dtos/responses/get-groups-by-user-id-response.dto';

// User
import { UserEntity } from '@User/entities/user.entity';

@QueryHandler(GetGroupsByUserIdQuery)
class GetGroupsByUserIdApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    query: GetGroupsByUserIdQuery,
  ): Promise<Result<GetGroupsByUserIdResponseDto, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: query.userId,
      },
      relations: {
        groups: true,
      },
      select: {
        groups: {
          id: true,
          name: true,
          description: true,
          avatarUrl: true,
        },
      },
    });

    if (!userInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    return Ok({
      groups: userInDB.groups,
    });
  }
}

export { GetGroupsByUserIdApplicationService };