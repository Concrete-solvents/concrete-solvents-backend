// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Libs
import { generateRandomCode } from '@Libs/utils/generate-random-code';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { SendEmailVerificationCodeCommand } from '@Email/cqrs/commands/send-email-verification-code.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Mailer
import { SendVerificationCodeToEmailCommand } from '@Mailer/cqrs/commands/send-verification-code-to-email.command';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(SendEmailVerificationCodeCommand)
class SendVerificationCodeApplicationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: SendEmailVerificationCodeCommand,
  ): Promise<Result<boolean, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
      relations: {
        email: true,
      },
    });

    if (!userInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    if (!userInDB.email) {
      return Err(CustomError.EmailDoesNotLinked);
    }

    if (userInDB.email.isConfirm) {
      return Err(CustomError.EmailAlreadyConfirmed);
    }

    const verificationCode = generateRandomCode();

    const emailInDB = await this._emailRepository.findOneBy({
      id: userInDB.email.id,
    });

    emailInDB.verificationCode = verificationCode;

    await this._emailRepository.save(emailInDB);

    const sendMailCommand = new SendVerificationCodeToEmailCommand({
      emailValue: emailInDB.value,
      verificationCode,
    });

    await this._commandBus.execute(sendMailCommand);

    return Ok(true);
  }
}

export { SendVerificationCodeApplicationService };
