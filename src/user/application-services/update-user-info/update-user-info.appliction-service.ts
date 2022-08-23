// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { UpdateUserInfoCommand } from '@User/cqrs/commands/update-user-info.command';
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(UpdateUserInfoCommand)
class UpdateUserInfoApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    command: UpdateUserInfoCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
    });

    if (!userInDB) {
      return Err(CustomError.PermissionError);
    }

    if (command.username) {
      userInDB.username = command.username;
    }

    if (command.avatarUrl) {
      userInDB.avatarUrl = command.avatarUrl;
    }

    if (command.description) {
      userInDB.description = command.description;
    }

    await this._userRepository.save(userInDB);

    return Ok(true);
  }
}

export { UpdateUserInfoApplicationService };
