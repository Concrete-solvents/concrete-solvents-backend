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
import { SendAccountRestoreCodeCommand } from '@Email/cqrs/commands/send-account-restore-code.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Mailer
import { SendAccountRestoreCodeToEmailCommand } from '@Mailer/cqrs/commands/send-account-restore-code-to-email.command';

@CommandHandler(SendAccountRestoreCodeCommand)
class SendAccountRestoreCodeApplicationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: SendAccountRestoreCodeCommand,
  ): Promise<Result<boolean, CustomError>> {
    const emailInDB = await this._emailRepository.findOneBy({
      value: command.emailValue,
      isConfirm: true,
    });

    if (!emailInDB) {
      return Err(CustomError.EmailNotFoundOrNotConfirmed);
    }

    const restoreCode = generateRandomCode();

    emailInDB.restoreCode = restoreCode;

    await this._emailRepository.save(emailInDB);

    const sendAccountRestoreCodeToEmailCommand =
      new SendAccountRestoreCodeToEmailCommand({
        emailValue: command.emailValue,
        restoreCode,
      });

    await this._commandBus.execute(sendAccountRestoreCodeToEmailCommand);

    return Ok(true);
  }
}

export { SendAccountRestoreCodeApplicationService };
