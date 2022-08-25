// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { ILike, Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { GetGroupsByUserIdQuery } from '@Group/cqrs/queries/get-groups-by-user-id.query';
import { GetGroupsByUserIdResponseDto } from '@Group/dtos/responses/get-groups-by-user-id-response.dto';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@QueryHandler(GetGroupsByUserIdQuery)
class GetGroupsByUserIdApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
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

    const groups = await this._groupRepository.find({
      where: {
        users: {
          id: query.userId,
        },
        name: ILike(`%${query.filter}%`),
      },
      select: {
        id: true,
        name: true,
        description: true,
        avatarUrl: true,
      },
      take: query.limit,
      skip: query.limit * (query.page - 1),
    });

    const countOfGroups = await this._groupRepository.count({
      where: {
        users: {
          id: query.userId,
        },
        name: ILike(`%${query.filter}%`),
      },
    });

    const totalPages = Math.ceil(countOfGroups / query.limit);

    return Ok({
      groups,
      totalPages,
    });
  }
}

export { GetGroupsByUserIdApplicationService };
