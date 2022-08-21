// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { CreateEmailCommand } from '@Email/cqrs/commands/create-email.command';
import { UpdateEmailCommand } from '@Email/cqrs/commands/update-email.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Auth
import { CheckIsPasswordCorrectCommand } from '@Auth/cqrs/commands/check-is-password-correct.command';

// User
import { UpdateUserCommand } from '@User/cqrs/commands/update-user.command';
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(UpdateUserCommand)
class UpdateUserApplicationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: UpdateUserCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
      relations: {
        email: true,
      },
    });

    if (command.email) {
      const isEmailIsAlreadyBusy = await this._emailRepository.findOne({
        where: {
          value: command.email,
          isConfirm: true,
        },
      });

      if (isEmailIsAlreadyBusy) {
        return Err(CustomError.EmailIsAlreadyBusy);
      }
    }

    if (command.newPassword) {
      const checkIsUserPasswordCommand = new CheckIsPasswordCorrectCommand({
        userId: command.userId,
        tryPassword: command.oldPassword,
      });

      const isPasswordCorrect: boolean = await this._commandBus.execute(
        checkIsUserPasswordCommand,
      );

      if (!isPasswordCorrect) {
        return Err(CustomError.WrongPassword);
      }
    }

    if (command.email) {
      if (userInDB.email) {
        const updateEmailCommand = new UpdateEmailCommand({
          newEmailValue: command.email,
          emailId: userInDB.email.id,
        });

        const updateEmailResult: Result<EmailEntity, CustomError> =
          await this._commandBus.execute(updateEmailCommand);

        if (updateEmailResult.isErr()) {
          return updateEmailResult;
        }
      } else {
        const createEmailCommand = new CreateEmailCommand({
          emailValue: command.email,
        });

        const createEmailResult: Result<EmailEntity, CustomError> =
          await this._commandBus.execute(createEmailCommand);

        if (createEmailResult.isErr()) {
          return createEmailResult;
        }

        userInDB.email = createEmailResult.unwrap();
      }
    }

    if (command.username) {
      userInDB.username = command.username;
    }

    if (command.avatarUrl) {
      userInDB.avatarUrl = command.avatarUrl;
    }

    if (command.newPassword) {
      userInDB.password = await bcrypt.hash(command.newPassword, 10);
    }

    await this._userRepository.save(userInDB);

    return Ok(true);
  }
}

export { UpdateUserApplicationService };
