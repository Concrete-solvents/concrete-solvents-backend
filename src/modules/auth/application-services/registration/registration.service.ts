// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Auth
import { RegistrationCommand } from '@Auth/cqrs/commands/registration.command';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { CreateEmailCommand } from '@Email/cqrs/commands/create-email.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(RegistrationCommand)
class RegistrationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(SettingsEntity)
    private readonly _settingsRepository: Repository<SettingsEntity>,
  ) {}

  async execute(
    command: RegistrationCommand,
  ): Promise<Result<RegistrationResponse, CustomError>> {
    const isUserAlreadyExist = await this._userRepository.findOne({
      where: {
        login: command.login,
      },
    });

    if (isUserAlreadyExist) {
      return Err(CustomError.LoginIsAlreadyBusy);
    }

    const isLoginCompatibleWithPattern = /^[A-z\d]+$/.test(command.login);

    if (!isLoginCompatibleWithPattern) {
      return Err(CustomError.LoginIncompatibleWithPattern);
    }

    const createEmailCommand = new CreateEmailCommand({
      emailValue: command.email,
    });

    const resultOfCreatingNewEmail: Result<EmailEntity, CustomError> =
      await this._commandBus.execute(createEmailCommand);

    if (resultOfCreatingNewEmail.isErr()) {
      return resultOfCreatingNewEmail;
    }

    const newEmail = resultOfCreatingNewEmail.unwrap();

    const newSettings = await this._settingsRepository.create({
      language: command.language,
    });

    const newSettingsInDB = await this._settingsRepository.save(newSettings);

    const newUserInstance = await this._userRepository.create({
      login: command.login,
      username: command.login,
      password: command.password,
      email: newEmail,
      settings: newSettingsInDB,
    });

    await this._userRepository.save(newUserInstance);

    const userInDB = await this._userRepository.findOne({
      where: {
        login: command.login,
      },
      relations: {
        email: true,
      },
    });

    return Ok({
      user: {
        login: userInDB.login,
        username: userInDB.username,
        id: userInDB.id,
        email: newEmail.value,
        isVerified: newEmail.isConfirm,
        avatarUrl: userInDB.avatarUrl,
        description: userInDB.description,
      },
    });
  }
}

export { RegistrationService };
