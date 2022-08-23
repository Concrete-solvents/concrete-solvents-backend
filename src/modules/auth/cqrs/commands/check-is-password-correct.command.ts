// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class CheckIsPasswordCorrectCommand extends BaseCommand {
  userId: number;
  tryPassword: string;

  constructor(props: CheckIsPasswordCorrectCommand) {
    super();
    this.tryPassword = props.tryPassword;
    this.userId = props.userId;
  }
}

export { CheckIsPasswordCorrectCommand };
