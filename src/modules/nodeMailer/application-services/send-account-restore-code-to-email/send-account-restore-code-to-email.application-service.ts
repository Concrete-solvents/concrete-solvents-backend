// Libraries
import { MailerService } from '@nestjs-modules/mailer';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Mailer
import { SendAccountRestoreCodeToEmailCommand } from '@Mailer/cqrs/commands/send-account-restore-code-to-email.command';

@CommandHandler(SendAccountRestoreCodeToEmailCommand)
class SendAccountRestoreCodeToEmailApplicationService
  implements ICommandHandler
{
  constructor(private readonly mailerService: MailerService) {}

  async execute(
    command: SendAccountRestoreCodeToEmailCommand,
  ): Promise<Result<boolean, CustomError>> {
    await this.mailerService.sendMail({
      to: command.emailValue,
      subject: 'Restore your account',
      text: `Your restore code is ${command.restoreCode}`,
      html: `<h1>Restore</h1><br>
<p>You can follow this link: <a href='http://localhost:3001/email/restoreAccount?email=${command.emailValue}&code=${command.restoreCode}'>restore account</a><p><br>
<p>or you can enter the code: ${command.restoreCode}</p>
`,
    });

    return Ok(true);
  }
}

export { SendAccountRestoreCodeToEmailApplicationService };
