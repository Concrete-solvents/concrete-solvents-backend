// Libraries
import { Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { CreateUserWithSocialCommand } from '@Auth/cqrs/commands/create-user-with-social.command';
import { LoginUserWithSocialCommand } from '@Auth/cqrs/commands/login-user-with-social.command';

// User
import { SocialEntity } from '@User/entities/social.entity';
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(LoginUserWithSocialCommand)
class LoginUserWithSocialService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(SocialEntity)
    private readonly _socialRepository: Repository<SocialEntity>,
  ) {}

  async execute(command: LoginUserWithSocialCommand) {
    const socialInDB = await this._socialRepository.findOne({
      where: {
        name: command.socialName,
        socialId: command.user.id,
      },
      relations: {
        user: true,
      },
    });

    let userId = socialInDB?.user?.id || null;

    if (!socialInDB) {
      const createUserWithSocialCommand = new CreateUserWithSocialCommand({
        socialName: command.socialName,
        user: command.user,
      });

      const result: Result<number, CustomError> =
        await this._commandBus.execute(createUserWithSocialCommand);

      userId = result.unwrap();
    }

    const resultUserInDB = await this._userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        email: true,
      },
    });

    return Ok({
      user: {
        login: resultUserInDB.login,
        username: resultUserInDB.username,
        id: resultUserInDB.id,
        email: resultUserInDB.email?.value,
        avatarUrl: resultUserInDB.avatarUrl,
        isVerified: resultUserInDB.email?.isConfirm || false,
      },
    });
  }
}

export { LoginUserWithSocialService };
