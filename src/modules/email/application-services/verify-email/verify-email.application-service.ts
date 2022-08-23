// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { VerifyEmailCommand } from '@Email/cqrs/commands/verify-email.command';
import { EmailEntity } from '@Email/entities/email.entity';

@CommandHandler(VerifyEmailCommand)
class VerifyEmailApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async execute(
    command: VerifyEmailCommand,
  ): Promise<Result<boolean, CustomError>> {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        value: command.emailValue,
        verificationCode: command.verificationCode,
      },
    });

    if (!emailInDB) {
      return Err(CustomError.EmailDoesNotExist);
    }

    emailInDB.isConfirm = true;

    await this._emailRepository.save(emailInDB);

    return Ok(true);
  }
}

export { VerifyEmailApplicationService };
