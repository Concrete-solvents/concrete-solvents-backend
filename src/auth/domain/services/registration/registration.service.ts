// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Auth
import { RegistrationCommand } from '@Auth/cqrs/commands/registration.command';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { EmailService } from '@Email/email.service';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(RegistrationCommand)
class RegistrationService implements ICommandHandler {
  constructor(
    private readonly _emailService: EmailService,
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

    const isEmailAlreadyBusy = await this._emailService.checkIsEmailAlreadyBusy(
      command.email,
    );

    if (isEmailAlreadyBusy) {
      return Err(CustomError.EmailIsAlreadyBusy);
    }

    const email = await this._emailService.createEmailAndSendVerificationCode(
      command.email,
    );

    const newSettings = await this._settingsRepository.create({
      language: command.language,
    });

    const newSettingsInDB = await this._settingsRepository.save(newSettings);

    const newUserInstance = await this._userRepository.create({
      login: command.login,
      username: command.login,
      password: command.password,
      email: email,
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
        email: email.value,
        isVerified: email.isConfirm,
        avatarUrl: userInDB.avatarUrl,
        description: userInDB.description
      },
    });
  }
}

export { RegistrationService };
