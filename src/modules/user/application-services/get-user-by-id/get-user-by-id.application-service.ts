// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { GetUserByIdQuery } from '@User/cqrs/queries/get-user-by-id.query';
import { UserEntity } from '@User/entities/user.entity';

@QueryHandler(GetUserByIdQuery)
class GetUserByIdApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<Result<any, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: query.userId,
      },
    });

    if (!userInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    return Ok({
      user: {
        username: userInDB.username,
        level: userInDB.level,
        description: userInDB.description,
        id: userInDB.id,
        avatarUrl: userInDB.avatarUrl,
      },
    });
  }
}

export { GetUserByIdApplicationService };
