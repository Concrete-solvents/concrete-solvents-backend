// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class SendEmailVerificationCodeCommand extends BaseCommand {
  readonly userId: number;

  constructor(props: SendEmailVerificationCodeCommand) {
    super();
    this.userId = props.userId;
  }
}

export { SendEmailVerificationCodeCommand };
