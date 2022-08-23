// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class SendVerificationCodeToEmailCommand extends BaseCommand {
  readonly emailValue: string;
  readonly verificationCode: string;

  constructor(props: SendVerificationCodeToEmailCommand) {
    super();
    this.verificationCode = props.verificationCode;
    this.emailValue = props.emailValue;
  }
}

export { SendVerificationCodeToEmailCommand };
