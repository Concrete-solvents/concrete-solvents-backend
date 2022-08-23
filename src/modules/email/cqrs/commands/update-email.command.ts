// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class UpdateEmailCommand extends BaseCommand {
  readonly emailId: number;
  readonly newEmailValue: string;

  constructor(props: UpdateEmailCommand) {
    super();
    this.emailId = props.emailId;
    this.newEmailValue = props.newEmailValue;
  }
}

export { UpdateEmailCommand };
