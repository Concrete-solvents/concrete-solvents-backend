// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class VerifyEmailCommand extends BaseCommand {
  readonly emailValue: string;
  readonly verificationCode: string;

  constructor(props: VerifyEmailCommand) {
    super();
    this.emailValue = props.emailValue;
    this.verificationCode = props.verificationCode;
  }
}

export { VerifyEmailCommand };
