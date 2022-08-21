// Libraries
import { MailerService } from '@nestjs-modules/mailer';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Mailer
import { SendVerificationCodeToEmailCommand } from '@Mailer/cqrs/commands/send-verification-code-to-email.command';

@CommandHandler(SendVerificationCodeToEmailCommand)
class SendVerificationCodeToEmailApplicationService implements ICommandHandler {
  constructor(private readonly mailerService: MailerService) {}

  async execute(
    command: SendVerificationCodeToEmailCommand,
  ): Promise<Result<boolean, CustomError>> {
    await this.mailerService.sendMail({
      to: command.emailValue,
      subject: 'Verify your email',
      text: `Your verification code is ${command.verificationCode}`,
      html: `<h1>Verification</h1><br>
<p>You can follow this link: <a href='http://localhost:3001/email/verifyEmail?email=${command.emailValue}&code=${command.verificationCode}'>verify email</a><p><br>
<p>or you can enter the code in the profile settings: ${command.verificationCode}</p>
`,
    });

    return Ok(true);
  }
}

export { SendVerificationCodeToEmailApplicationService };
