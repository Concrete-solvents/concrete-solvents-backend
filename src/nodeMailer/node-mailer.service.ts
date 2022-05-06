import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(mail: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: mail,
      subject: 'Verify your email',
      text: `Your verification code is ${code}`,
      html: `<h1>Verification</h1><br>
<p>You can follow this link: <a href='http://localhost:3001/email/verifyEmail?email=${mail}&code=${code}'>verify email</a><p><br>
<p>or you can enter the code in the profile settings: ${code}</p>
`,
    });
  }

  async sendRestoreCode(mail: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: mail,
      subject: 'Restore your account',
      text: `Your restore code is ${code}`,
      html: `<h1>Restore</h1><br>
<p>You can follow this link: <a href='http://localhost:3001/email/restoreAccount?email=${mail}&code=${code}'>restore account</a><p><br>
<p>or you can enter the code: ${code}</p>
`,
    });
  }
}
