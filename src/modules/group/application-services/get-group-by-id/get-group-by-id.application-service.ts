// Libraries
// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { GetGroupByIdQuery } from '@Group/cqrs/queries/get-group-by-id.query';
import { GetGroupByIdResponseDto } from '@Group/dtos/responses/get-group-by-id-response.dto';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

@QueryHandler(GetGroupByIdQuery)
class GetGroupByIdApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    query: GetGroupByIdQuery,
  ): Promise<Result<GetGroupByIdResponseDto, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: query.userId,
        groups: {
          id: query.groupId,
        },
      },
    });

    if (!userInDB) {
      return Err(CustomError.PermissionError);
    }

    const groupInDB = await this._groupRepository.findOne({
      where: {
        id: query.groupId,
      },
      select: {
        name: true,
        description: true,
        id: true,
        avatarUrl: true,
      },
    });

    if (!groupInDB) {
      return Err(CustomError.GroupDoesNotExist);
    }

    const countOfUserInGroup = await this._userRepository.count({
      where: {
        groups: {
          id: query.groupId,
        },
      },
    });

    return Ok({
      group: {
        name: groupInDB.name,
        description: groupInDB.description,
        id: groupInDB.id,
        avatarUrl: groupInDB.avatarUrl,
        countOfUsers: countOfUserInGroup,
        type: 'Open',
      },
    });
  }
}

export { GetGroupByIdApplicationService };
