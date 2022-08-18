// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { LoginCommand } from '@Auth/cqrs/commands/login.command';
import { LoginResponse } from '@Auth/dtos/login-response.dto';

// User
import { UserEntity } from '@User/entities/user.entity';
import { UserService } from '@User/user.service';

@CommandHandler(LoginCommand)
class LoginService implements ICommandHandler {
  constructor(
    private readonly _userService: UserService,
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

    const isPasswordCorrect = await this._userService.checkPassword(
      command.password,
      userInDB.id,
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
      },
    });
  }
}

export { LoginService };
