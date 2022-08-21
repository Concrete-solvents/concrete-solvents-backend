// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class SendAccountRestoreCodeToEmailCommand extends BaseCommand {
  readonly emailValue: string;
  readonly restoreCode: string;

  constructor(props: SendAccountRestoreCodeToEmailCommand) {
    super();
    this.emailValue = props.emailValue;
    this.restoreCode = props.restoreCode;
  }
}

export { SendAccountRestoreCodeToEmailCommand };
