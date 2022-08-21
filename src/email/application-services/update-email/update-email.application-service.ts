// Libraries
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Libs
import { generateRandomCode } from '@Libs/utils/generate-random-code';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { UpdateEmailCommand } from '@Email/cqrs/commands/update-email.command';
import { EmailEntity } from '@Email/entities/email.entity';

// Mailer
import { SendVerificationCodeToEmailCommand } from '@Mailer/cqrs/commands/send-verification-code-to-email.command';

@CommandHandler(UpdateEmailCommand)
class UpdateEmailApplicationService implements ICommandHandler {
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: UpdateEmailCommand,
  ): Promise<Result<EmailEntity, CustomError>> {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        id: command.emailId,
      },
    });

    emailInDB.value = command.newEmailValue;
    emailInDB.isConfirm = false;
    emailInDB.verificationCode = generateRandomCode();
    emailInDB.restoreCode = null;

    const updatedEmailInDB = await this._emailRepository.save(emailInDB);

    const sendVerificationCodeToEmailCommand =
      new SendVerificationCodeToEmailCommand({
        emailValue: updatedEmailInDB.value,
        verificationCode: updatedEmailInDB.verificationCode,
      });

    await this._commandBus.execute(sendVerificationCodeToEmailCommand);

    return Ok(updatedEmailInDB);
  }
}

export { UpdateEmailApplicationService };
