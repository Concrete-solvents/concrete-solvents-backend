// Libraries
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Libs
import { generateRandomCode } from '@Libs/utils/generate-random-code';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { CreateEmailCommand } from '@Email/cqrs/commands/create-email.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Mailer
import { SendVerificationCodeToEmailCommand } from '@Mailer/cqrs/commands/send-verification-code-to-email.command';

@CommandHandler(CreateEmailCommand)
class CreateEmailApplicationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: CreateEmailCommand,
  ): Promise<Result<EmailEntity, CustomError>> {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        value: command.emailValue,
        isConfirm: true,
      },
    });

    if (emailInDB) {
      return Err(CustomError.EmailIsAlreadyBusy);
    }

    const newEmail = await this._emailRepository.create({
      value: command.emailValue,
      verificationCode: generateRandomCode(),
    });

    const newEmailInDB = await this._emailRepository.save(newEmail);

    const sendVerificationCodeToEmail = new SendVerificationCodeToEmailCommand({
      emailValue: newEmail.value,
      verificationCode: newEmail.verificationCode,
    });

    await this._commandBus.execute(sendVerificationCodeToEmail);

    return Ok(newEmailInDB);
  }
}

export { CreateEmailApplicationService };
