// Libraries
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// User
import { GetMeQuery } from '@User/cqrs/queries/get-me.query';
import { UserEntity } from '@User/entities/user.entity';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@QueryHandler(GetMeQuery)
class GetMeApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetMeQuery): Promise<UserBaseResponse> {
    const user = await this._userRepository.findOne({
      where: {
        id: query.userId,
      },
      relations: {
        email: true,
      },
    });

    return {
      description: user.description,
      login: user.login,
      username: user.username,
      email: user.email?.value,
      isVerified: user.email?.isConfirm,
      avatarUrl: user.avatarUrl,
      id: user.id,
    };
  }
}

export { GetMeApplicationService };
