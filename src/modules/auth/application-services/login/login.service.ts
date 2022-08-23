// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { LoginCommand } from '@Auth/cqrs/commands/login.command';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { CheckIsPasswordCorrectCommand } from '@Auth/cqrs/commands/check-is-password-correct.command';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(LoginCommand)
class LoginService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<Result<LoginResponse, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        login: command.login,
      },
      relations: {
        email: true,
      },
    });

    if (!userInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    const checkIsUserPasswordCommand = new CheckIsPasswordCorrectCommand({
      userId: userInDB.id,
      tryPassword: command.password,
    });

    const isPasswordCorrect: boolean = await this._commandBus.execute(
      checkIsUserPasswordCommand,
    );

    if (!isPasswordCorrect) {
      return Err(CustomError.WrongLoginOrPassword);
    }

    return Ok({
      user: {
        login: userInDB.login,
        username: userInDB.username,
        id: userInDB.id,
        email: userInDB.email.value,
        avatarUrl: userInDB.avatarUrl,
        isVerified: userInDB.email.isConfirm,
        description: userInDB.description,
      },
    });
  }
}

export { LoginService };
