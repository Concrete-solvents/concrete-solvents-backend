// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class SendAccountRestoreCodeCommand extends BaseCommand {
  readonly emailValue: string;

  constructor(props: SendAccountRestoreCodeCommand) {
    super();
    this.emailValue = props.emailValue;
  }
}

export { SendAccountRestoreCodeCommand };
